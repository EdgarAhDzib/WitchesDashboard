const express = require("express");
const router = express.Router();

var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

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

// Require model for deities
var God = require ("../models/Gods.js");

// Replaces all ".jpg" extensions with ".png"
God.find({"img_ref": {"$exists":true} }).exec(function(error, doc) {
	for (i = 0; i < doc.length; i++) {
		doc[i].img_ref = doc[i].img_ref.replace(".jpg", ".png");
		// console.log(doc[i].img_ref);
		doc[i].save();
	}
});
console.log("Gods collection updated");
