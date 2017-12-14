const express = require("express");
const router = express.Router();
// Require model for deities
var God = require ("../models/Gods.js");

// Model properties: name, English, charge, tonalli, dayPos, nightPos, thirteen, img_ref, specialTonalli
// E.g., Chalchihuitlicue presented on combination of ({specialTonalli: "1,8"})

// Create collection of deity objects, set properties into Mongo documents
// Day, night, and thirteen positions start at 1, tonalli signs start at 0
// Tier sequence, descending: highest abstract 0, Omeyocan 1, Celestial 2, Elemental 3, Above surface 4, Earth surface 5, Chthonic 6, Underworld 7
var deities = [
	// Deities of the twenty tonalli day-signs
	{
		name: "Tonacateuctli",
		english: "Sustenance Lord",
		charge: "Creation",
		tier: 1,
		tonalli: 0,
		dayPos: 7,
		thirteen: [1],
		specialTonalli: ["13,10"],
		img_ref: "tonacateuctli.jpg"
	},
	{
		name: "Quetzalcoatl",
		english: "Feathered Serpent",
		charge: "Wind",
		tier: 3,
		tonalli: 1,
		dayPos: 9,
		thirteen: [2],
		specialTonalli: ["1,12"],
		img_ref: "quetzalcoatl.jpg"
	},
	{
		name: "Tepeyollohtli",
		english: "Heart of the Mountain",
		charge: "Wilderness",
		tier: 4,
		tonalli: 2,
		nightPos: 8,
		thirteen: [3,11],
		img_ref: "tepeyollohtli.jpg"
	},
	{
		name: "Huehuehcoyotl",
		english: "Old Man Coyote",
		charge: "Dance",
		tier: 4,
		tonalli: 3,
		thirteen: [4],
		img_ref: "huehuehcoyotl.jpg"
	},
	{
		name: "Chalchihuitlicue",
		english: "Jade Skirt",
		charge: "Water",
		tier: 6,
		tonalli: 4,
		dayPos: 3,
		nightPos: 6,
		thirteen: [5],
		specialTonalli: ["1,8"],
		img_ref: "chalchihuitlicue.jpg"
	},
	{
		name: "Teucciztecatl",
		english: "Of Many Conchs",
		charge: "Moon",
		tier: 2,
		tonalli: 5,
		thirteen: [6],
		img_ref: "teucciztecatl.jpg"
	},
	{
		name: "Tlaloc",
		english: "Covered with Earth",
		charge: "Rain",
		tier: 6,
		tonalli: 6,
		dayPos: 8,
		nightPos: 9,
		thirteen: [7],
		img_ref: "tlaloc.jpg"
	},
	{
		name: "Mayahuel",
		english: "Rounded Palm",
		charge: "Intoxication",
		tier: 4,
		tonalli: 7,
		thirteen: [8],
		img_ref: "mayahuel.jpg"
	},
	{
		name: "Xiuhteuctli",
		english: "Turquoise Lord",
		charge: "Fire",
		tier: 3,
		tonalli: 8,
		dayPos: 1,
		nightPos: 1,
		thirteen: [9,20],
		specialTonalli: ["1,9"],
		img_ref: "xiuhteuctli.jpg"
	},
	{
		name: "Mictlanteuctli",
		english: "Lord in the Underworld",
		charge: "Death",
		tier: 7,
		tonalli: 9,
		dayPos: 6,
		nightPos: 5,
		thirteen: [10],
		img_ref: "mictlanteuctli.jpg"
	},
	{
		name: "Xochipilli",
		english: "Flower Prince",
		charge: "Psychedelics",
		tier: 4,
		tonalli: 10,
		img_ref: "xochipilli.jpg"
	},
	{
		name: "Pahtecatl",
		english: "Of Many Medicines",
		charge: "Medicine",
		tier: 4,
		tonalli: 11,
		thirteen: [11],
		img_ref: "pahtecatl.jpg"
	},
	{
		name: "Tezcatlipoca",
		english: "Smoking Mirror",
		charge: "Power",
		tier: 0,
		tonalli: 12,
		dayPos: 10,
		thirteen: [12],
		specialTonalli: ["1,5","1,12"],
		img_ref: "tezcatlipoca.jpg"
	},
	{
		name: "Tlahzolteotl",
		english: "Filth Goddess",
		charge: "Fertility",
		tier: 5,
		tonalli: 13,
		dayPos: 5,
		nightPos: 7,
		thirteen: [3,13],
		specialTonalli: ["9,11"],
		img_ref: "tlahzolteotl.jpg"
	},
	{
		name: "Xipeh Toteuc",
		english: "Our Lord in Flayed Skin",
		charge: "Springtime",
		tier: 4,
		tonalli: 14,
		thirteen: [14],
		img_ref: "xipeh.jpg"
	},
	{
		name: "Itzpapalotl",
		english: "Obsidian Butterfly",
		charge: "Desert",
		tier: 5,
		tonalli: 15,
		thirteen: [15],
		img_ref: "itzpapalotl.jpg"
	},
	{
		name: "Xolotl",
		english: "Servant",
		charge: "Spirit Animals",
		tier: 7,
		tonalli: 16,
		thirteen: [16],
		img_ref: "xolotl.jpg"
	},
	{
		name: "Chalchiuhtotolin",
		english: "Jade Turkey Hen",
		charge: "Sacrifice",
		tier: 4,
		tonalli: 17,
		thirteen: [17],
		img_ref: "chalchiuhtotolin.jpg"
	},
	{
		name: "Tonatiuh",
		english: "Goes Radiantly",
		charge: "Sun",
		tier: 2,
		tonalli: 18,
		dayPos: 4,
		thirteen: [6,10],
		specialTonalli: ["12,9"],
		img_ref: "tonatiuh.jpg"
	},
	{
		name: "Xochiquetzal",
		english: "Flower Plume",
		charge: "Flowers",
		tier: 4,
		tonalli: 19,
		thirteen: [19],
		img_ref: "xochiquetzal.jpg"
	},
	// Day-position deities
	{
		name: "Tlalteuctli",
		english: "Earth Lady",
		charge: "Earth",
		tier: 6,
		dayPos: 2,
		img_ref: "tlalteuctli.jpg"
	},
	{
		name: "Yohualteuctli",
		english: "Night Lord",
		charge: "Night",
		tier: 2,
		dayPos: 11,
		img_ref: "yohualteuctli.jpg"
	},
	{
		name: "Tlahuizcalpanteuctli",
		english: "Dawn House Lord",
		charge: "Venus",
		tier: 2,
		dayPos: 12,
		thirteen: 9,
		specialTonalli: ["10,7"],
		img_ref: "tlahuizcalpanteuctli.jpg"
	},
	{
		name: "Citlalinicue",
		english: "Star Skirt",
		charge: "Milky Way",
		tier: 2,
		dayPos: 13,
		specialTonalli: ["11,8"],
		img_ref: "citlalinicue.jpg"
	},
	// Night-position deities
	{
		name: "Itztli",
		english: "Obsidian",
		charge: "Obsidian",
		tier: 6,
		nightPos: 2,
		img_ref: "itztli.jpg"
	},
	{
		name: "Piltzinteuctli",
		english: "Princely Lord",
		charge: "Youth",
		tier: 2,
		nightPos: 3,
		img_ref: "piltzinteuctli.jpg"
	},
	{
		name: "Cinteotl",
		english: "Maize God",
		charge: "Maize",
		tier: 4,
		nightPos: 4,
		img_ref: "cinteotl.jpg"
	},
	// Thirteen-day count deities
	{
		name: "Tonacacihuatl",
		english: "Sustenance Lady",
		charge: "Creation",
		tier: 1,
		thirteen: [1],
		img_ref: "tonacacihuatl.jpg"
	},
	{
		name: "Itztlacoliuhqui",
		english: "Curved Obsidian",
		charge: "Frost",
		tier: 3,
		thirteen: [12],
		img_ref: "itztlacoliuhqui.jpg"
	},
	{
		name: "Chantico",
		english: "Come to Make Home",
		charge: "Hearth",
		tier: 5,
		thirteen: [18],
		img_ref: "chantico.jpg"
	},
	{
		name: "Xipeh Itztapaltoteuc",
		english: "Our Lord in Glaze Flayed Skin",
		charge: "Sacrifice",
		tier: 4,
		thirteen: [20],
		img_ref: "itztapaltoteuc.jpg"
	},
	// Special dates
	// Cihuapipiltin (Find images for the "Ce" aspects)
	{
		name: "Macuilli Ozomahtli",
		english: "Five Monkey",
		tier: 3,
		specialTonalli: ["5,10"],
		img_ref: "macuilliozomahtli.jpg"
	},
	{
		name: "Macuilli Calli",
		english: "Five House",
		tier: 3,
		specialTonalli: ["5,2"],
		img_ref: "macuillicalli.jpg"
	},
	{
		name: "Macuilli Cuauhtli",
		english: "Five Eagle",
		tier: 3,
		specialTonalli: ["5,14"],
		img_ref: "macuillicuauhtli.jpg"
	},
	{
		name: "Macuilli Mazatl",
		english: "Five Deer",
		tier: 3,
		specialTonalli: ["5,6"],
		img_ref: "macuillimazatl.jpg"
	},
	{
		name: "Macuilli Quiahuitl",
		english: "Five Rain",
		tier: 3,
		specialTonalli: ["5,18"],
		img_ref: "macuilliquiahuitl.jpg"
	},
	// Ahhuiateteoh
	{
		name: "Macuilli Cuetzpalin",
		english: "Five Lizard",
		tier: 3,
		specialTonalli: ["5,3"],
		img_ref: "macuillicuetzpalin.jpg"
	},
	{
		name: "Macuilli Cozcacuauhtli",
		english: "Five Vulture",
		tier: 3,
		specialTonalli: ["5,15"],
		img_ref: "macuillicozcacuauhtli.jpg"
	},
	{
		name: "Macuilli Tochtli",
		english: "Five Rabbit",
		tier: 3,
		specialTonalli: ["5,7"],
		img_ref: "macuillitochtli.jpg"
	},
	{
		name: "Macuilxochitl",
		english: "Five Flower",
		tier: 3,
		specialTonalli: ["5,19"],
		img_ref: "macuilxochitl.jpg"
	},
	{
		name: "Macuilmalinalli",
		english: "Five (Grass) Twist",
		tier: 3,
		specialTonalli: ["5,11"],
		img_ref: "macuilmalinalli.jpg"
	},
	{
		name: "Macuilli Ehecatl",
		english: "Five Wind",
		tier: 3,
		specialTonalli: ["5,1"],
		img_ref: "macuilliehecatl.jpg"
	},
	{
		name: "Macuilli Ollin",
		english: "Five Movement",
		tier: 3,
		specialTonalli: ["5,16"],
		img_ref: "macuilliollin.jpg"
	},
	// Other deities
	{
		name: "Huitzilopochtli",
		english: "Hummingbird at Left",
		tier: 3,
		charge: "War",
		specialTonalli: ["1,17"],
		img_ref: "huitzilopochtli.jpg"
	},
	{
		name: "Chicomecoatl",
		english: "Seven Serpent",
		tier: 4,
		charge: "Harvest",
		specialTonalli: ["7,4"],
		img_ref: "chicomecoatl.jpg"
	},
	{
		name: "Chicomexochitl",
		english: "Seven Flower",
		tier: 4,
		charge: "Agriculture",
		specialTonalli: ["7,19"],
		img_ref: "chicomexochitl.jpg"
	},
	{
		name: "Ometochtli",
		english: "Two Rabbit",
		tier: 4,
		charge: "Intoxication",
		specialTonalli: ["2,7"],
		img_ref: "ometochtli.jpg"
	}
];

router.get("/popdeities/", (req, res) => {
	for (i = 0; i < deities.length; i++) {
		// Create new entry with the God model
		var entry = new God(deities[i]);
		entry.save(function(err, doc) {
			if (err) console.log(err);
			else console.log(doc);
		});

	} // Close FOR loop
	console.log("Gods collection complete");
});
// Success: collection created and populated, operation no longer required

module.exports = router;
