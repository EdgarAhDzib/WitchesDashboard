const express = require("express");
const router = express.Router();
var CalendarDay = require("../models/CalendarDay.js");

router.get("/lunar/", (req, res) => {
	var currDate = new Date();
	var queryYear = currDate.getFullYear(); // getYear() will return 118 for 2018, etc.
	var month = currDate.getMonth();
	var day = currDate.getDate();
	CalendarDay.findOne({"year": queryYear, "month": month, "day": day}).exec(function(err,doc){
		CalendarDay.find({"lunarMonthIndex": doc.lunarMonthIndex}).sort({"position": 1}).exec(function(error, fullMonth){
			if (error) { console.log(error); }
			res.json(fullMonth);
		});
	});
});

// Add new POST to prepare content from other lunar months
router.post("/newmonth/", (req, res) => {
	var newMonth = req.body.month;
	if (newMonth < 0) { newMonth = 0; }
	CalendarDay.distinct("lunarMonthIndex").exec(function(error,result){
		if (error) { console.log(error); }
		var lastIndex = result.length - 1;
		if (newMonth > lastIndex) { newMonth = lastIndex; }
		CalendarDay.find({"lunarMonthIndex": newMonth}).sort({"position": 1}).exec(function(error, fullMonth){
			if (error) { console.log(error); }
			res.json(fullMonth);
		});
	});
});

module.exports = router;
