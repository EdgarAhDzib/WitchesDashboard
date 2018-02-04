var request = require("request");
var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var Keys = require("./keys.js");
var aztecProtectionSpell = require("./nahualtocaitl.js");

// Determine the Mongoose connection
const PORT = process.env.PORT || 3000;

// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");
mongoose.Promise = Promise;

// Initialize Express
var app = express();

require("./webpack.config.js");

// Use morgan and body parser with app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Make public a static dir
app.use(express.static("./public") );

const oracle = require("./app/config/routes/oracle");
app.use("/", oracle);

const tonalli = require("./app/config/routes/tonalli");
app.use("/", tonalli);

const lunar = require("./app/config/routes/lunar");
app.use("/", lunar);

const talisman = require("./app/config/routes/talisman");
app.use("/", talisman);

// Already run to populate the Gods collection, no longer required
// const popdeities = require("./app/config/routes/popDeities");
// app.use("/", popdeities);

// Changed DB for consistency
var databaseUri = "mongodb://localhost/witchesdb";

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
db.once("open", function() {
	console.log("Mongoose connection successful.");
});

app.listen(PORT, function() {
	console.log("App running on port " + PORT);
});
