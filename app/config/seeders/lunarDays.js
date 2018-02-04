var request = require("request");
var fs = require("fs");
var http = require('http');
var path = require("path");
var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Day = require("../models/Days.js");

// http://aa.usno.navy.mil/data/docs/api.php
// Accepted date format:
// date=9/25/1700
// date=09/25/2049

// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Use morgan and body parser
//app.use(logger("dev"));
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

var domain = "http://api.usno.navy.mil/moon/phase?year=2018";
// Add the December 2017 New and First phases
domain = "http://api.usno.navy.mil/moon/phase?date=12/17/2017&nump=2";
// Add the January 2019 New phase
domain = "http://api.usno.navy.mil/moon/phase?date=1/1/2019&nump=1";

request(domain, function(error, response) { // Will HTML param be necessary?
	var resJSON = JSON.parse(response.body);
	for (let i = 0; i < resJSON.phasedata.length; i++) {
		// Merge the "date" and "time" properties
		var queryDate = resJSON.phasedata[i]["date"] + " " + resJSON.phasedata[i]["time"];
		var formatDate = Date.parse(queryDate);
		var minusSixHours = formatDate - (1000 * 3600 * 6); // Milliseconds * seconds per hour * six hours
		var centralTimeZone = new Date(minusSixHours);
		var month = centralTimeZone.getMonth();
		var day = centralTimeZone.getDate();
		var hour = centralTimeZone.getHours();
		var minutes = centralTimeZone.getMinutes();
		var entry = new Day({
			month: month,
			day: day,
			hour: hour,
			minute: minutes,
			year: 2019,
			phase: resJSON.phasedata[i]["phase"]
		});
		entry.save(function(err, doc) {
			if (err) console.log(err);
			else console.log(doc);
		});
	}
});
