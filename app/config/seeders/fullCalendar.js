var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Day = require("../models/Days.js");
var Calendarday = require("../models/CalendarDay.js");

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

// Initialize date from which to begin full year
var currDate = new Date("2017 Dec 18");
// Initialize variables for population
var firstDayOfMoon = [];
var numericMonthAndDay = [];
var fullCalendar = [];

// Use month names to ensure proper date formatting in loops
var monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Sort first by month, then by day
Day.find({"phase" : "New Moon"}).sort({year:1, month: 1, day: 1}).exec(function(error, doc){
	for (i = 0; i < doc.length; i++) {
		var monthIndex = doc[i].month;
		firstDaysArray(doc[i].year + " " + monthList[monthIndex] + " " + doc[i].day, doc[i].year + " " + doc[i].month + " " + doc[i].day );
	}
	if (firstDayOfMoon.length == doc.length) {
		arrangeDaysPerMonth(firstDayOfMoon);
	}
	// Build new calendar from generated object
}).then(function() {
	// console.log(firstDayOfMoon);
	// console.log(numericMonthAndDay);
	// console.log(fullCalendar);
	/*
	for (i = 0; i < fullCalendar.length; i++) {
		var entry = new Calendarday( fullCalendar[i] );
		entry.save(function(err, doc) {
			if (err) console.log(err);
			else console.log(doc);
		});
	}
	*/
});

// Initialize array to store content from lunar phases
var lunarDayObjects = [];
Day.find().exec(function(error,doc){
	for (i = 0; i < doc.length; i++) {
		lunarDayObjects.push(doc[i]);
	}
}).done(function(){
	/*
 	for (i = 0; i < lunarDayObjects.length; i++) {
		Calendarday.findOneAndUpdate({"year": lunarDayObjects[i].year, "month": lunarDayObjects[i].month, "day": lunarDayObjects[i].day}, {"hour": lunarDayObjects[i].hour, "minute": lunarDayObjects[i].minute, "phase": lunarDayObjects[i].phase}).exec(function(err, doc){
			console.log(doc);
		});
	}
	*/
});

// Assign holiday dates by month and day
var sabbats = [
	{
		"month": 11,
		"day": 21,
		"sabbat": "Yule"
	},
	{
		"month": 1,
		"day": 2,
		"sabbat": "Imbolc"
	},
	{
		"month": 2,
		"day": 20,
		"sabbat": "Ostara"
	},
	{
		"month": 4,
		"day": 1,
		"sabbat": "Beltane"
	},
	{
		"month": 5,
		"day": 21,
		"sabbat": "Midsummer"
	},
	{
		"month": 7,
		"day": 1,
		"sabbat": "Lammas"
	},
	{
		"month": 8,
		"day": 22,
		"sabbat": "Mabon"
	},
	{
		"month": 9,
		"day": 31,
		"sabbat": "Samhain"
	}	
];

for (i = 0; i < sabbats.length; i++) {
	Calendarday.update({"month": sabbats[i].month, "day": sabbats[i].day}, {"$push": {"attributes": {"sabbat": sabbats[i].sabbat} } }, {multi:true}).exec(function(err, doc){
		console.log(doc);
	});
}


function firstDaysArray(monthAndDay, numericVersions) {
	firstDayOfMoon.push(monthAndDay);
	numericMonthAndDay.push(numericVersions);
}

function arrangeDaysPerMonth(allDays) {
	// Pass the index from j into lunarMonthIndex
	yearCalendar:
	for (j = 0; j < allDays.length; j++) {
		let k = 1;
		var loopDate = allDays[j];
		var formatDate = Date.parse(loopDate);
		var newDate = new Date(formatDate);
		var loopDateMonth = newDate.getMonth();
		var loopDateDay = newDate.getDate();
		var loopDateYear = newDate.getFullYear();
		var lunarMonth = {
			position: 0,
			year: loopDateYear,
			lunarMonthIndex: j,
			month: loopDateMonth,
			day: loopDateDay
		};
		fullCalendar.push(lunarMonth);
		do {
			var nextDate = formatDate + (1000 * 3600 * 24 * k); // Milliseconds * seconds per hour * 24 hours * k days
			var calendarDay = new Date(nextDate);
			var month = calendarDay.getMonth();
			var day = calendarDay.getDate();
			var year = calendarDay.getFullYear();
			var monthAndDay = year + " " + month + " " + day;
			if (monthAndDay == numericMonthAndDay[numericMonthAndDay.length - 1])  {
				break yearCalendar;
			}

			if (numericMonthAndDay.indexOf(monthAndDay) >= 0) { continue; }

			// lunarMonth set as object in order to assign lunar phase properties per day as determined by query
			lunarMonth = {
				position: k,
				year: year,
				lunarMonthIndex: j,
				month: month,
				day: day
			};
			// console.log(lunarMonth);
			k++;
			fullCalendar.push(lunarMonth);
		} while (numericMonthAndDay.indexOf(monthAndDay) <= 0); // The first element may be repeated to complete the first lunar cycle into 2019
	}
}
