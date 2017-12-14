// Require mongoose
var mongoose = require("mongoose");
// Create schema class
var Schema = mongoose.Schema;

// Create User schema
var UserSchema = new Schema({
	name: String,
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true
	},
	password: {
		type: String,
		required: true
	},
	// Save oracle sets
	savedOracles: Array
});

var User = mongoose.model("User", UserSchema);

module.exports = User;
