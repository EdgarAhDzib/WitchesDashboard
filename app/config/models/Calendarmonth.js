// Require mongoose
var mongoose = require("mongoose");
// Create schema class
var Schema = mongoose.Schema;

var CalendarDay = require("./CalendarDay.js");

// Create Month schema
var CalendarSchema = new Schema({
	month: [CalendarDay]
});

var Calendarmonth = mongoose.model("Calendarmonth", CalendarSchema);

module.exports = Calendarmonth;
