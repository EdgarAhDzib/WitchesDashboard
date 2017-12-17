var url = require("url");
var fs = require("fs");
var http = require('http');
var path = require("path");

var DOWNLOAD_DIR = "./codices/";

// Function to download file using HTTP.get
var download_file_httpget = function(file_url) {
	var options = {
		host: url.parse(file_url).host,
		port: 80,
		path: url.parse(file_url).pathname
	};

	var file_name = url.parse(file_url).pathname.split('COLLECTION/').pop(); // Generate file name on path's last element
	// Convert file name into legal, distinct string
	file_name = file_name.replace(/\//g, "_");
	file_name = file_name.replace("%20", "_");
	file_name = file_name.replace("_images_Borbonicus", "");
	file_name = file_name.replace("page_", "");
	console.log(file_name);
	var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

	http.get(options, function(res) {
    res.on('data', function(data) {
            file.write(data);
        }).on('end', function() {
            file.end();
            console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
        });
    });
};

var domain = "http://DOMAIN .... /"; // CODEX/IMAGEFILENAME.jpg
// Borbonicus and Tonalamatl begin at plate 03, so initialize the j index by number of first available plate
// Each sub-array lists path, index for first plate, number of last plate; cover plates not counted
// The fourth element indicates whether the codex is "book"-formatted, by European convention: if TRUE, nest an additional loop to iterate through r ("recto") and v ("verso") sides for each folio
// Run the program thrice, scraping all at once was getting sloppy results: per program run, uncomment only one row, then the next
// var codices = [ ["Borgia/page_", 1, 76, false], ["Borbonicus/images/Borbonicus_", 3, 38, false], ["Cospi/page_", 1, 31, false] ];
// var codices = [ ["Fejervary/page_", 1, 44, false], ["Tonalamatl/page_", 3, 20, false], ["Vaticanus%203738/page_", 1, 96, true] ];
var codices = [ ["Vaticanus%203773/page_", 1, 96, false], ["Magliabecchiano/page_", 1, 92, true], ["Telleriano-Remensis/page_", 1, 50, true] ];
var firstTen = ['00','01','02','03','04','05','06','07','08','09'];

// Download pictures
for (i = 0; i < codices.length; i++) {
	for (j = codices[i][1]; j <= codices[i][2]; j++){
		if (codices[i][3]) {
			for (k = 0; k <= 1; k++) {
				if (k == 0 && j <= 9) var imagePath = domain + codices[i][0] + firstTen[j] + "r.jpg";
				else if (k == 1 && j <= 9) var imagePath = domain + codices[i][0] + firstTen[j] + "v.jpg";
				else if (k == 0 && j > 9) var imagePath = domain + codices[i][0] + j + "r.jpg";
				else var imagePath = domain + codices[i][0] + j + "v.jpg";
				// May have to continue to prevent failing on a page that doesn't exist
				if (imagePath == "http://www.DOMAIN.../Magliabecchiano/page_92v.jpg") { continue; }
				// This calls the function to download the file
				download_file_httpget(imagePath);
				// console.log(imagePath);
			}
		} else {
			if (j <= 9) {
				var imagePath = domain + codices[i][0] + firstTen[j] + ".jpg";
				download_file_httpget(imagePath);	
			} else {
				var imagePath = domain + codices[i][0] + j + ".jpg";
				download_file_httpget(imagePath);
			}
			// console.log(imagePath);
		}
	}
}
