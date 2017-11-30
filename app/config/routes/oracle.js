const express = require("express");
const router = express.Router();

const Card = require("../models/Cards.js");

// Push cards to array with length from params
router.get("/query/:count", (req, res) => {
	var countSpread = req.params.count;
	// Default the count to 1 if any other values attempted
	if (countSpread != 1 && countSpread != 3 && countSpread != 10) {
		countSpread = 1;
	}
	var randIndices = [];
	var checkArray = [];

	console.log(checkArray);

	console.log("Count spread", countSpread);

	var i = 0;
	function buildTheSpread() {
		do {
			i++;
			Card.count().exec(function(err, count) {
				var random = Math.floor(Math.random() * count);
				// console.log(count, random);
				Card.findOne().skip(random).exec(function(error, doc){
					if (error) console.log(error);
					newArr = arrCb(randIndices, doc._id);

				}).then(function() {
					// console.log("THEN", newArr.length);
					if (newArr.length < countSpread) {
						buildTheSpread();
					}
					else if (newArr.length == countSpread) {
						// console.log(newArr);
						Card.find({"_id" : {$in : newArr} }).exec(function(error, doc){
							if (error) console.log(error);
							return res.json(doc);
							res.end();
							// Added THEN to prevent crash on repeat header sending
						}).then(function() {
							return;
						});
						// return;
					}
					else {
						return;
					}
				});
			});
		} while (i < countSpread);
	}

// Declared within scope of GET, was failing outside because of undefined variables
function arrCb(arr, id) {
	var ifInArray = checkArray.indexOf(id + "ind");
	if (ifInArray > -1) console.log("This ID already listed", ifInArray);
	else {
		arr.push(id);
		checkArray.push(id + "ind");
	}
	return arr;
}

buildTheSpread();

}); // Close GET operation

module.exports = router;
