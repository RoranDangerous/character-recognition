const fs = require('fs');

const TYPE = {
	IMAGES : 0,
	LABELS : 1
};

function parseDataset(filename, type=TYPE.IMAGES){
	var fileBuffer = fs.readFileSync(filename);

	var magicNumber = hexArrayToNumber(fileBuffer.slice(0,4));
	var numItems = hexArrayToNumber(fileBuffer.slice(4,8));
	var dims = {
		height: 1,
		width: 1
	};
	var startIndex = 8;

	if(type == TYPE.IMAGES){
		dims = {
			height: hexArrayToNumber(fileBuffer.slice(8,12)),
			width: hexArrayToNumber(fileBuffer.slice(12,16))
		};
		startIndex = 16;
	}

	fileBuffer = fileBuffer.slice(startIndex);

	var data = [];

	for (var item = 0; item < numItems; item++) { 
		var pixels = [];
	
		for (var x = 0; x < dims.height; x++) {
				for (var y = 0; y < dims.width; y++) {
						pixels.push(fileBuffer[(item * dims.height * dims.width) + (x + (y * 28))]);
				}
		}

		data.push(pixels);
	}

	return { magicNumber: magicNumber, length: numItems, dims: dims, data: data};
}

function hexArrayToNumber(hex){
	var result = "0x";
	for(var i = 0; i < hex.length; i++){
		result += hex[i].toString(16);
	}

	return parseInt(result);
}

//parseDataset('emnist-digits-train-labels-idx1-ubyte', TYPE.LABELS);
//parseDataset('emnist-digits-train-images-idx3-ubyte', TYPE.IMAGES);