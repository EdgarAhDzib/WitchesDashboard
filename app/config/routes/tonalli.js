const express = require("express");
const router = express.Router();
var Aztecday = require("../models/Aztecdays.js");
var God = require("../models/Gods.js");

var ceCipactli = new Date("02/23/2001");

var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1; // months begin at 0
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();
var today = month + "/" + day + "/" + year;

var queryDate = new Date(today);

var timeDiff = Math.abs(queryDate.getTime() - ceCipactli.getTime());
var daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

// Tonalli position is calculated from remainder of vigesimal division
var tonalli = (daysDiff % 20);
if (tonalli < 0) tonalli += 20;
// Number is calculated from remainder of 13
var mahtlactliOmeyi = (daysDiff % 13) + 1;
// Night calculated from remainder of 9
var night = (daysDiff % 9) + 1;

// "Trecena" (Mahtlactetlomeyi Tonalpohualli) calculated by subtracting days til 1
var sinceFirst = mahtlactliOmeyi - 1;
var firstDay = tonalli - sinceFirst;
if (firstDay < 0) firstDay += 20;
// Array of the trecenas in sequence, using 0-inital days from tonalli position series
var trecenaSeq = [0, 13, 6, 19, 12, 5, 18, 11, 4, 17, 10, 3, 16, 9, 2, 15, 8, 1, 14, 7];
var trecenaIndex = trecenaSeq.indexOf(firstDay) + 1;

// Adopted from https://coderwall.com/p/nilaba/simple-pure-javascript-array-unique-method-with-5-lines-of-code
Array.prototype.unique = function() {
	return this.filter(function (value, index, self) { 
		return self.indexOf(value) === index;
	});
}

router.get("/tonalli/", (req, res) => {
	// console.log(trecenaIndex);
	var tonalObj = {};
	// Create empty array for the deity document ids, each should occur uniquely
	tonalObj.deityIds = [];
	// Array for deity records
	// tonalObj.deities = [];
	Aztecday.find({"position" : tonalli}).exec(function(error, doc){
		if (error) console.log(error);
		tonalObj.thirteen = mahtlactliOmeyi;
		tonalObj.night = night;
		tonalObj.position = doc[0].position;
		tonalObj.name = doc[0].name;
		tonalObj.nahuatl = doc[0].nahuatl;
		God.find({"tonalli": doc[0].position}).exec(function(err, docu){
			tonalObj.deityIds.push(docu[0]._id);
		}).done(function(err, result){
			God.find({"dayPos": mahtlactliOmeyi}).exec(function(err, docu){
				tonalObj.deityIds.push(docu[0]._id);
			}).done(function(err, result){
				God.find({"nightPos": night}).exec(function(err, docu){
					tonalObj.deityIds.push(docu[0]._id);
				}).done(function(err, result){
					God.find({"thirteen":{$in: [trecenaIndex] } }).exec(function(err, doc){
						if (err) console.log(err);
						tonalObj.deityIds.push(doc[0]._id);
					}).done(function(err, result){
						// Run method to ensure each deity unique in array
						tonalObj.deityIds.unique();
						// console.log(tonalObj.deityIds);
						God.find({"_id": {$in: tonalObj.deityIds} }).exec(function(err, document){
							// property takes full array of objects
							tonalObj.deities = document;
							//console.log(tonalObj);
							return res.json(tonalObj);
							res.end();
						});
					});
				});
			});
		});
	});
});

/*
// Create the collection, run once: each subarray contains name, Nahuatl, and position values
var dayPositions = [
	[0, "Caiman", "Cipactli"],
	[1, "Wind", "Ehecatl"],
	[2, "House", "Calli"],
	[3, "Lizard", "Cuetzpalin"],
	[4, "Serpent", "Coatl"],
	[5, "Death", "Miquiztli"],
	[6, "Deer", "Mazatl"],
	[7, "Rabbit", "Tochtli"],
	[8, "Water", "Atl"],
	[9, "Dog", "Itzcuintli"],
	[10, "Monkey", "Ozomahtli"],
	[11, "(Grass) Twist", "Malinalli"],
	[12, "Reed", "Acatl"],
	[13, "Jaguar", "Ocelotl"],
	[14, "Eagle", "Cuauhtli"],
	[15, "Vulture", "Cozcacuauhtli"],
	[16, "Movement", "Ollin"],
	[17, "Flint Knife", "Tecpatl"],
	[18, "Rain", "Quiahuitl"],
	[19, "Flower", "Xochitl"]
];

router.get("/tonallicollection/", (req, res) => {
	for (i = 0; i < dayPositions.length; i++) {
		var obj = {
			position: dayPositions[i][0],
			name: dayPositions[i][1],
			nahuatl: dayPositions[i][2]
		};

		// Create new entry with the Aztecday model
		var entry = new Aztecday(obj);
		entry.save(function(err, doc) {
			if (err) console.log(err);
			else console.log(doc);
		});

	} // Close FOR loop
});
// Success: collection created and populated, operation no longer required
*/

module.exports = router;
