// Require mongoose
var mongoose = require("mongoose");
// Create schema class
var Schema = mongoose.Schema;

// Create Aztecday schema
var TonalliSchema = new Schema({
	name: String,
	nahuatl: String,
	position: Number,
	img_ref: String,
	qualities: Array,
	description: Array
});

var Aztecday = mongoose.model("Aztecday", TonalliSchema);

module.exports = Aztecday;
