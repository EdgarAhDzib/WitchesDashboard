// Require mongoose
var mongoose = require("mongoose");
// Create schema class
var Schema = mongoose.Schema;

// Create Card schema
var CardSchema = new Schema({
	title: String,
	img_file: String,
	keywords: Array,
	number: Number,
	qualities: Array,
	description: Array,
	reverse: Array
});

var Card = mongoose.model("Card", CardSchema);

module.exports = Card;
