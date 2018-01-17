var request = require("request");
var cheerio = require("cheerio");
var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var logger = require("morgan");

// Initialize Express
var app = express();

// Use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Make public a static dir
app.use(express.static("./public", {index: false} ) );

var url = "http://www2.szepmuveszeti.hu/talismans/cbd/"; // Current range 1-3206
url = url + 2630;

var itemProps = ["Iconography:", "Divine Names & Voces:", "Dating:", "Material:"];

router.get('/talisman', function(req, res) {

request(url, function(error, response, html) {
	var $ = cheerio.load(html);
	// Result object stores data
	var result = {};
	// Properties to display: title, image, Iconography, Divine Names & Voces, Description, (sides) A, B, Dating, Material, link
	// Initialize array to push one or two elements from selection
	result.description = [];
	// If no image (e.g., 2843), repeat query (may require variable assignment to function)

	// Title
	$("title").each(function(i, element) {
		result.title = $(element).text().trim();
	});
	// Image
	$("#image1").find("a").each(function(i, element){
		if (i < 1) {
			result.img_file = element.attribs.href;
		} else {
			return false;
		}
	});
	// Properties
	$(".field-row").each(function(i, element) {
		// Special characters might require escape for React display
		var objProperty = false;
		$(element).find(".field-title").each(function(inc, el){
			var elementTitle = $(el).text().trim();
			if (itemProps.indexOf(elementTitle) > -1) {
				objProperty = true;
				// console.log(elementTitle);
				result[i] = [elementTitle];
			}
		});
		if (objProperty) {
			$(element).find(".field-value").each(function(inc, el){
				var elementVal = $(el).text().trim();
				// console.log(elementVal);
				result[i].push(elementVal);
			});
		}
	});
	// Description
	$("p").each(function(i, element) {
		var descContent = $(element).text().trim();
		var bibPattern = new RegExp("Bibliography");
		// Store the first one or two elements only if they do not include the Bibliography content
		if (i < 2 && !bibPattern.test(descContent)) {
			// descContent = descContent.replace(/\r\n/g, ""); // May need to replace with <br/>
			result.description.push(descContent);
		} else {
			return false;
		}
	});
	
	console.log(result);
	res.json(result);
});

});

module.exports = router;
