var request = require("request");
var cheerio = require("cheerio");
var url = require("url");
var fs = require("fs");
var http = require('http');
var path = require("path");
var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Card = require("./models/Cards.js");

// Mirrored from https://www.hacksparrow.com/using-node-js-to-download-files.html
// var file_url = "http://www.DOMAIN/FOLDER/maj07.jpg";
// var DOWNLOAD_DIR = "./cards/";

// Function to download file using HTTP.get
var download_file_httpget = function(file_url) {
	var options = {
		host: url.parse(file_url).host,
		port: 80,
		path: url.parse(file_url).pathname
	};

	var file_name = url.parse(file_url).pathname.split('/').pop();
	var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

	http.get(options, function(res) {
    res.on('data', function(data) {
            file.write(data);
        }).on('end', function() {
            file.end();
            console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
        });
    });
};

// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Use morgan and body parser with our app
//app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Make public a static dir - but perhaps unnecessary, too, if the file runs all from the command line
app.use(express.static("./public", {index: false} ) );

var databaseUri = "mongodb://localhost/tarot";

if (process.env.MONGODB_URI) {
	mongoose.connect(process.env.MONGODB_URI);
} else {
	mongoose.connect(databaseUri);
}

// Database configuration with mongoose
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
	console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
// Should this be renamed openUri ?
db.once("open", function() {
	console.log("Mongoose connection successful.");
});

// Sample URL: http://www.DOMAIN/maj00.htm
var domain = "http://www.DOMAIN/";
var deck = [];
var images = [];
var major = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21'];
// To concatenate for .htm URLs
var suites = ['w','c','s','p'];
var minorLink = ['a','2','3','4','5','6','7','8','9','10','pg','kn','qn','kg'];
// To concatenate for .jpg URLs
var suiteImgs = ['wands','cups','swords','pents'];
var minorJpg = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14'];

for (i = 0; i < major.length; i++) {
	deck.push('maj' + major[i]);
	images.push('maj' + major[i]);
}
for (i = 0; i < suites.length; i++) {
	for (j = 0; j < minorLink.length; j++) {
		deck.push(suites[i] + minorLink[j]);
		images.push(suiteImgs[i] + minorJpg[j]);
	}
}

var count = 0;

// The deck yields 78 elements, the full set
// console.log(deck);

// Looped within the 'deck' array
for (j = 0; j < deck.length; j++) {

var cardPath = domain + deck[j] + ".htm";
// console.log(cardPath);

request(cardPath, function(error, response, html) {
	var $ = cheerio.load(html);
	// Array stores data
	var result = {};
	result.keywords = [];
	result.qualities = [];
	result.description = [];

	$("body").find("H1").each(function(i, element) {
		result.title = $(element).text();
	});
	$("UL").find("LI").each(function(i, element) {
		// Retrieve only the first list for card qualities, the other instances are empty
		if ($(element).find("B").text() != "") result.keywords[i] = $(element).find("B").text();
	});
	
	$("DL").find("DT").each(function(i, element) {
		// These are the correct elements, but each should be stripped of \r and \n substrings
		// Special characters might require escape for Mongoose insertion
		result.qualities[i] = $(element).text();
	});
	
	// Get the link from the first <A> element in body
	var imgPattern = new RegExp("FOLDER/");
	if ($("A").length > 0 && $("A")[0].hasOwnProperty("attribs")) {
		console.log($("A")[0].attribs);
		console.log(result.title, "has proper A HREF format");
		result.img_file = $("A")[0].attribs.href;
	} else {
		console.log(result.title, "fails A HREF test");
	}
	// console.log($("A")[0]);
	// console.log($("A")[1]);
	
	var descIndex = -1;
	var descArrEl = 0;
	
	$("BODY").find("P").each(function(i, element) {
		var elText = $(element).text();
		var descPattern = new RegExp("DESC...");
		var narrative = new RegExp("[HTML CONTENT]");
		var bottomLinks = "[MORE HTML CONTENT]";
		elText = elText.replace(bottomLinks, "");
		elText = elText.replace(/\r\n/g, "");
		elText = elText.replace(/  /g, "");
		if (descPattern.test(elText)) descIndex = i;
		if (descIndex > -1 && descIndex < i && !narrative.test(elText)) {
            result.description[descArrEl] = elText;
			descArrEl++;
		}
		// Write another comparison to skip the last <P> elements, which have links rather than description
	});

	// console.log(result);
	// Create new entry with the Card model
	var entry = new Card(result);
	entry.save(function(err, doc) {
		if (err) console.log(err);
		else console.log(doc);
	});
});

} // Close deck loop

// Download pictures
for (j = 0; j < images.length; j++) {
	var imagePath = domain + "FOLDER/" + images[j] + ".jpg";
	console.log(imagePath);
	// This calls the function to download the file
	download_file_httpget(imagePath);
}
