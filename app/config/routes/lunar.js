const express = require("express");
const router = express.Router();
var CalendarDay = require("../models/CalendarDay.js");

router.get("/lunar/", (req, res) => {
	// Restore from hard-code
	var currDate = new Date();
	// var currDate = new Date("Jan 6 2019");
	var queryYear = currDate.getFullYear(); // getYear() will return 118 for 2018, etc.
	var month = currDate.getMonth();
	var day = currDate.getDate();
	CalendarDay.findOne({"year": queryYear, "month": month, "day": day}).exec(function(err,doc){
		CalendarDay.find({"lunarMonthIndex": doc.lunarMonthIndex, "year": queryYear}).sort({"position": 1}).exec(function(error, fullMonth){
			if (error) { console.log(error); }
			res.json(fullMonth);
		});
	});
});

// Add new POST to prepare content from other lunar months
router.post("/newmonth/", (req, res) => {
	var newMonth = req.body.month;
	var queryYear = req.body.year;
	if (newMonth < 0) { newMonth = 0; }
	CalendarDay.distinct("lunarMonthIndex").exec(function(error,result){
		if (error) { console.log(error); }
		var lastIndex = result.length - 1;
		if (newMonth > lastIndex) { newMonth = lastIndex; }


		// Logic for queryYear must be revised for lunarMonthIndex == 12, when January dates should be included
// db.calendardays.find({$or: [{"year":2018,"month":11,"lunarMonthIndex":12},{"year":2019,"month":0,"lunarMonthIndex":12}]})
		var params = [{"lunarMonthIndex": newMonth, "year": queryYear}];
		// Include next year's January dates for Cold / final Moon
		if (newMonth == lastIndex) {
			// Prevent Cold Moon from including any days from last January
			params = [{"lunarMonthIndex": newMonth, "month":11, "year": queryYear}];
			params.push({"year": queryYear + 1, "month":0, "lunarMonthIndex":newMonth});
		}
		// Include last year's December dates for Wolf Moon
		if (newMonth == 0) {
			params.push({"year": queryYear - 1, "month":11, "lunarMonthIndex":newMonth});
		}
		CalendarDay.find({"$or":params}).sort({"position": 1}).exec(function(error, fullMonth){
			if (error) { console.log(error); }
			res.json(fullMonth);
		});
	});
});

router.get("/maxYear/", (req, res) => {
// db.calendardays.aggregate([{"$group":{"_id":null, "max":{"$max":"$year"}, "min": {"$min":"$year"}}}]) yields min 2017, max 2019
// 2018 could remain hard-coded, scale ahead
	CalendarDay.aggregate([{"$group":{"_id":null, "max":{"$max":"$year"}}}]).exec(function(error,result){
		if (error) { console.log(error); }
		res.json(result);
	});
});

module.exports = router;
