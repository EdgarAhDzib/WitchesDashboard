// Require mongoose
var mongoose = require("mongoose");
// Create schema class
var Schema = mongoose.Schema;

// Create Day schema
var DaySchema = new Schema({
	month: Number,
	day: Number,
	hour: Number,
	minute: Number,
	year: Number,
	phase: String
});

var Day = mongoose.model("Lunarday", DaySchema);

module.exports = Day;
