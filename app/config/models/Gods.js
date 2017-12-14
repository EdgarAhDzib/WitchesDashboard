// Require mongoose
var mongoose = require("mongoose");
// Create schema class
var Schema = mongoose.Schema;

// Create God schema
var GodSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	english: String,
	charge: String,
	tonalli: Number,
	dayPos: Number,
	nightPos: Number,
	thirteen: Array,
	img_ref: String,
	specialTonalli: Array,
	tier: Number
});
var God = mongoose.model("God", GodSchema);

module.exports = God;
