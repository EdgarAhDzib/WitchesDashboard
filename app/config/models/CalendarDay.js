// Require mongoose
var mongoose = require("mongoose");
// Create schema class
var Schema = mongoose.Schema;

// Create Day schema
var CalendarDay = new Schema({
	year: Number,
	month: Number,
	lunarMonthIndex: Number,
	day: Number,
	position: Number,
	phase: String,
	hour: Number,
	minute: Number,
	attributes: Array
});

var CalendarDay = mongoose.model("Calendarday", CalendarDay);

module.exports = CalendarDay;
