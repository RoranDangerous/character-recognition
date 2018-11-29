const fs = require('fs');

const TYPE = {
	IMAGES : 0,
	LABELS : 1
};

Array.prototype.multiply = function(val) {return multiply(this, val) };
Array.prototype.divide = function(val) {return divide(this, val) };
Array.prototype.add = function(val) {return add(this, val) };
Array.prototype.subtract = function(val) {return subtract(this, val) };
Array.prototype.dot = function(arr) { return dot(this, arr) };
Array.prototype.sum = function() { return this.reduce((a,b) => a + b, 0) };
Array.prototype.product = function() { return this.reduce((a,b) => a * b, 1) };
Array.prototype.reshape = function(s) { return reshape(this, s) };
Array.prototype.shape = function() { return shape(this) };
Number.prototype.subtract = function(arr) { return numberSubtract(this, arr) };

function parseDataset(filename, type=TYPE.IMAGES, maxSize=-1){
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

	var end = startIndex + (maxSize == -1 ? fileBuffer.length : (maxSize * dims.height * dims.width));
	fileBuffer = Array.prototype.slice.call(fileBuffer, startIndex, end);

	return { magicNumber: magicNumber, length: numItems, dims: dims, data: fileBuffer};
	
	// var data = [];

	// for (var item = 0; item < numItems; item++) { 
	// 	var pixels = [];
	
	// 	for (var x = 0; x < dims.height; x++) {
	// 			for (var y = 0; y < dims.width; y++) {
	// 					pixels.push(fileBuffer[(item * dims.height * dims.width) + (x + (y * 28))]);
	// 			}
	// 	}

	// 	data.push(pixels);
	// }
}

function hexArrayToNumber(hex){
	var result = "0x";
	for(var i = 0; i < hex.length; i++){
		result += hex[i].toString(16);
	}

	return parseInt(result);
}

function softmax(x){
	var result = [];
	if(x[0].length != undefined){
		for(var i = 0; i < x.length; i++){
			result.push(softmax(x[i]));
		}
		return result;
	}
	var exp = [];
	for(var i = 0; i < x.length; i++){
		exp.push(Math.exp(x[i]));
	}

	var exp_sum = exp.sum();
	for(var i = 0; i < exp.length; i++){
		result.push(exp[i] / exp_sum);
	}
	return result;
}

function tanh(x){
	var result = [];
	for(var i = 0; i < x.length; i++){
		result.push((1.0 - Math.exp(-2 * x[i])) / (1.0 + Math.exp(-2 * x[i])));
	}
	return result;
}

function tanh_derivative(x){
	var result = [];
	var t = tanh(x);
	for(var i = 0; i < t.length; i++){
		result.push((1 + t[i]) * (1 - t[i]));
	}
	return result;
}

function sigmoid(x){
	var result = [];
	if(x[0].length != undefined){
		for(var i = 0; i < x.length; i++){
			result.push(sigmoid(x[i]));
		}
		return result;
	}
	for(var i = 0; i < x.length; i ++){
		result.push(1 / (1 + Math.exp(-x[i])));
	}
	return result;
}

function sigmoid_derivative(x){
	var result = [];
	var sig = sigmoid(x);
	return sig.multiply((1).subtract(sig));
}

function shape(arr){
	var result = [];
	result.push(arr.length);
	if(arr[0].length != undefined){
		result = [...result, ...shape(arr[0])];
	}
	return result;
}

function multiply(arr, val){
	if(val.length != undefined){
		return multiplyArrays(arr, val);
	}

	for(var i = 0; i < arr.length; i++){
		if(arr[i].length == undefined){
			arr[i] *= val;
		}
		else{
			arr[i] = multiply(arr[i], val);
		}
	}

	return arr;
}

function multiplyArrays(arr1, arr2){
	for(var i = 0; i < arr1.length; i++){
		if(arr1[i].length == undefined){
			if(arr2[Math.min(i, arr2.length-1)].length == undefined){
				arr1[i] *= arr2[Math.min(i, arr2.length-1)];
			}
			else{
				arr1[i] = multiplyArrays(arr2, arr1[i]);
			}
		}
		else{
			if(arr2[Math.min(i, arr2.length-1)].length == undefined){
				arr1[i] = multiplyArrays(arr1[i], arr2);
			}
			else{
				arr1[i] = multiplyArrays(arr1[i], arr2[Math.min(i, arr2.length-1)]);
			}
		}
	}
	
	return arr1;
}

function divide(arr, val){
	if(val.length != undefined){
		return divideArrays(arr, val);
	}

	for(var i = 0; i < arr.length; i++){
		if(arr[i].length == undefined){
			arr[i] /= val;
		}
		else{
			arr[i] = divide(arr[i], val);
		}
	}

	return arr;
}

function divideArrays(arr1, arr2){
	for(var i = 0; i < arr1.length; i++){
		if(arr1[i].length == undefined){
			if(arr2[Math.min(i, arr2.length-1)].length == undefined){
				arr1[i] /= arr2[Math.min(i, arr2.length-1)];
			}
			else{
				arr1[i] = divideArrays(arr2, arr1[i]);
			}
		}
		else{
			if(arr2[Math.min(i, arr2.length-1)].length == undefined){
				arr1[i] = divideArrays(arr1[i], arr2);
			}
			else{
				arr1[i] = divideArrays(arr1[i], arr2[Math.min(i, arr2.length-1)]);
			}
		}
	}
	
	return arr1;
}

function add(arr, val){
	if(val.length != undefined){
		return addArrays(arr, val);
	}

	for(var i = 0; i < arr.length; i++){
		if(arr[i].length == undefined){
			arr[i] += val;
		}
		else{
			arr[i] = add(arr[i], val);
		}
	}

	return arr;
}

function reshape(arr, shape, index=0){
	// if(arr.shape().product() != shape.product()){
	// 	throw new Error("Reshaping array with shape ("+arr.shape()+") to ("+shape+") failed.");
	// }
	var result = [];
	if(shape.length == 1){
		for(var i = 0; i < shape[0]; i++){
			result.push(getIth(arr, index+i));
		}
		return result;
	}

	for(var i = 0; i < shape[0]; i++){
		result.push(reshape(arr, shape.slice(1), i*shape.slice(1).product()));
	}
	return result;

	for(var i = 0; i < rows; i++){
		var row = [];
		for(var j = 0; j < cols; j++){
			var element = getIth(arr, (i*cols)+j);
			row.push(element);
		}
		result.push(row);
	}
	return result;
}

function getIth(arr, index){
	if(arr[0].length == undefined){
		return arr[index];
	}
	var shape = arr.shape();
	var elementsInRow = shape.slice(1).product();
	var ind = Math.floor(index / elementsInRow);
	return getIth(arr[ind], index - (ind * elementsInRow));
}

function addArrays(arr1, arr2){
	for(var i = 0; i < arr1.length; i++){
		if(arr1[i].length == undefined){
			if(arr2[Math.min(i, arr2.length-1)].length == undefined){
				arr1[i] += arr2[Math.min(i, arr2.length-1)];
			}
			else{
				arr1[i] = addArrays(arr2, arr1[i]);
			}
		}
		else{
			if(arr2[Math.min(i, arr2.length-1)].length == undefined){
				arr1[i] = addArrays(arr1[i], arr2);
			}
			else{
				arr1[i] = addArrays(arr1[i], arr2[Math.min(i, arr2.length-1)]);
			}
		}
	}
	
	return arr1;
}

function subtract(arr, val){
	if(val.length != undefined){
		return subtractArrays(arr, val);
	}

	for(var i = 0; i < arr.length; i++){
		if(arr[i].length == undefined){
			arr[i] -= val;
		}
		else{
			arr[i] = subtract(arr[i], val);
		}
	}

	return arr;
}

function subtractArrays(arr1, arr2){
	for(var i = 0; i < arr1.length; i++){
		if(arr1[i].length == undefined){
			if(arr2[Math.min(i, arr2.length-1)].length == undefined){
				arr1[i] -= arr2[Math.min(i, arr2.length-1)];
			}
			else{
				arr1[i] = subtractArrays(arr2, arr1[i]);
			}
		}
		else{
			if(arr2[Math.min(i, arr2.length-1)].length == undefined){
				arr1[i] = subtractArrays(arr1[i], arr2);
			}
			else{
				arr1[i] = subtractArrays(arr1[i], arr2[Math.min(i, arr2.length-1)]);
			}
		}
	}
	
	return arr1;
}

function numberSubtract(num, arr){
	var result = [];
	if(arr[0].length != undefined){
		for(var i = 0; i < arr.length; i++){
			result.push(numberSubtract(num, arr[i]));
		}
		return result;
	}

	for(var i = 0; i < arr.length; i++){
		result.push(num - arr[i]);
	}
	return result;
}

function rand(rows, cols){
	var result = [];
	for(var i = 0; i < rows; i++){
		var arr = [];
		for(var j = 0; j < cols; j++){
			arr.push(2 * Math.random() - 1);
		}
		result.push(arr);
	}
	return result;
}

function ones(x1, x2=0){
	var result = [];

	for(var i = 0; i < x1; i++){
		if(x2==0){
			result.push(1);
			continue;
		}
		var arr = [];
		for(var j = 0; j < x2; j++){
			arr.push(1);
		}
		result.push(arr);
	}

	return result;
}

function zeros(shape){
	var result = [];
	if(shape.length == 1){
		for(var i = 0; i < shape[0]; i++){
			result.push(0);
		}
		return result;
	}

	for(var i = 0; i < shape[0]; i++){
		result.push(zeros(shape.slice(1)));
	}

	return result;
}

function transpose(arr){
	var result = [];

	var shape = arr.shape();
	for(var j = 0; j < shape[shape.length-1]; j++){
		for(var i = j; i < shape.product(); i += shape[shape.length-1]){
			result.push(getIth(arr, i));
		}
	}

	var tShape = [...shape];
	shape[0] = tShape[tShape.length-1];
	shape[shape.length-1] = tShape[0];
	return result.reshape(shape);

	// if(array[0].length == undefined){
	// 	return array;
	// }

	// for(var i = 0; i < array[0].length; i++){
	// 	var arr = [];
	// 	for(var j = 0; j < array.length; j++){
	// 		arr.push(array[j][i]);
	// 	}
	// 	result.push(arr);
	// }

	// return result;
}

function concatenate(arr1, arr2){
	var result = [];

	if(arr1[0].length == undefined){
		for(var i = 0; i < arr1.length; i++){
			result.push(arr1[i]);
		}
		for(var i = 0; i < arr2.length; i++){
			result.push(arr2[i]);
		}
		return result;
	}
	for(var i = 0; i < arr1.length; i++){
		var arr = [];
		for(var j = 0; j < arr1[i].length; j++){
			arr.push(arr1[i][j]);
		}
		for(var j = 0; j < arr2[i].length; j++){
			arr.push(arr2[i][j]);
		}
		result.push(arr);
	}

	return result;
}

function dot(a, b){
	var aNumRows = a.length, aNumCols = a[0].length,
		bNumRows = b.length, bNumCols = b[0].length,
		m = new Array(aNumRows);

	var dims = {
		cols: aNumCols == undefined ? 0 : aNumCols,
		rows: bNumCols == undefined ? 0 : bNumCols 
	}

	if(dims.cols == 0 && dims.rows == 0){
		return dotOneByOne(a, b);
	}

	if(dims.cols == 0 || dims.rows == 0){
		return dotTwoByOne(a, b);
	}
	for (var r = 0; r < aNumRows; ++r) {
		m[r] = new Array(bNumCols);
		for (var c = 0; c < bNumCols; ++c) {
			m[r][c] = 0;
			for (var i = 0; i < aNumCols; ++i) {
				m[r][c] += a[r][i] * b[i][c];
			}
		}
	}
	return m;
}

function dotOneByOne(a, b){
	if(a.length != b.length){
		throw new Error("Dimensions don't match: "+a.length+" != "+b.length);
	}
	var result = 0;
	for(var i = 0 ; i < a.length; i++){
		result += a[i] * b[i];
	}

	return result;
}

function dotTwoByOne(a, b){
	var result = [];
	if(a[0].length == undefined){
		var temp = a;
		a = b;
		b = temp;
	}

	if(a.length != b.length){
		throw new Error("Dimensions don't match: "+a[0].length+" != "+b.length);
	}

	for(var i = 0; i < a[0].length; i++){
		var sum = 0;
		for(var j = 0; j < a.length; j++){
			sum += a[j][i] * b[j];
		}
		result.push(sum);
	}

	return result;
}

function mult(a, b){
	if (a[0].length != b.length) {
		throw new Error("error: incompatible sizes");
	}

	var result = [];
	for (var i = 0; i < a.length; i++) {
			var row = [];
			for (var j = 0; j < b[0].length; j++) {
					var sum = 0;
					for (var k = 0; k < a[0].length; k++) {
							sum += a[i][k] * b[k][j];
					}
					row.push(sum);
			}
			result.push(row);
	}
	return result; 
}

function eye(num, arr=undefined){
	var result = [];
	if(arr == undefined){
		return eyeNum(num);
	}

	if(arr[0].length != undefined){
		result.push(eye(num, arr[0]));
		return result;
	}

	for(var i = 0; i < arr.length; i++){
		var row = [];
		for(var j = 0; j < num; j++){
			row.push(j == arr[i] ? 1 : 0);
		}
		result.push(row);
	}
	return result;
}

function eyeNum(num){
	var result = [];
	for(var i = 0; i < num; i++){
		var row = [];
		for(var j = 0; j < num; j++){
			row.push(j == i ? 1 : 0);
		}
		result.push(row);
	}
	return result;
}

function log(arr){
	var result = [];
	if(arr[0].length != undefined){
		for(var i = 0; i < arr.length; i++){
			result.push(log(arr[i]));
		}
		return result;
	}

	for(var i = 0; i < arr.length; i++){
		result.push(Math.log(arr[i]));
	}
	return result;
}

function numberToBinArray(num, max_len=4){
	var result = [];

	for (var i = 0; i < max_len; i++)
		result[max_len - 1 - i] = (num >> i) & 1;

	return result;
}

module.exports = {
	type: TYPE,
	parseDataset: parseDataset,
	concatenate: concatenate,
	transpose: transpose,
	softmax: softmax,
	ones: ones,
	zeros: zeros,
	tanh: tanh,
	tanh_derivative: tanh_derivative,
	sigmoid: sigmoid,
	sigmoid_derivative: sigmoid_derivative,
	rand: rand,
	eye: eye,
	log: log,
	mult: mult,
	numberToBinArray: numberToBinArray
};