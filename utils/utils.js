const fs = require('fs');
var dataFileBuffer = fs.readFileSync('emnist-digits-train-images-idx3-ubyte.gz');
var labelFileBuffer = fs.readFileSync('emnist-digits-train-labels-idx1-ubyte.gz');
var pixelValues = [];

// It would be nice with a checker instead of a hard coded 60000 limit here
for (var image = 0; image <= 2; image++) { 
	var pixels = [];

	for (var x = 0; x <= 27; x++) {
			for (var y = 0; y <= 27; y++) {
					pixels.push(dataFileBuffer[(image * 28 * 28) + (x + (y * 28)) + 15]);
			}
	}

	var imageData  = {};
	imageData[JSON.stringify(labelFileBuffer[image + 8])] = pixels;
	console.log(Object.keys(imageData));

	pixelValues.push(imageData);
}
console.log(pixelValues[1]['255'].toString());
//console.log(Object.keys(pixelValues[0]));