var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Card = require("./../models/Cards.js");
var tarotKeywords = require("./tarotKeywords.js");

var Promise = require("bluebird");
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Use morgan and body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

mongoose.connect("mongodb://localhost/witchesdb");

// Database configuration with mongoose
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
	console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
	console.log("Mongoose connection successful.");
});

var images = [];
var major = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21'];
// Concatenate for img_file property per document
var suits = ["cups", "pents", "swords", "wands"]
var minorJpg = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14'];

for (i = 0; i < major.length; i++) {
	images.push('maj' + major[i]);
}
for (i = 0; i < suits.length; i++) {
	for (j = 0; j < minorJpg.length; j++) {
		images.push(suits[i] + minorJpg[j]);
	}
}

for (i = 0; i < images.length; i++) {
	
	var imageString = images[i];
	Card.findOne({"img_file": "bigjpgs/" + imageString + ".jpg"}).exec(function(error, doc){ // Will be findOneAndUpdate(), reset "qualities" and "description"
		if (error) { console.log(error); }
		var cardName = doc.img_file.replace("bigjpgs/", "");
		cardName = cardName.replace(".jpg", "");
		var newKeywords = getValueByKey(cardName);
		// Update properties on doc._id with findOneAndUpdate
		Card.findOneAndUpdate({"_id": doc._id},{"$set":{"keywords":newKeywords}}).exec(function(err, document) {
			if (err) { console.log(err); }
		});
	});
	
	function getValueByKey(key) {
		return tarotKeywords[key];
	}
}

// console.log(tarotKeywords);
