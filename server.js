const express = require('express');
const bodyParser = require('body-parser');
const utils = require('./utils/utils');
const NeuralNetwork = require('./utils/neural-network');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
	res.render('index');
})

app.post('/', function (req, res) {
	res.render('index');
	console.log(req.body);
})

// app.listen(3000, function () {
// 	console.log('Example app listening on port 3000!');
// })

var dataset = utils.parseDataset('emnist-digits-train-images-idx3-ubyte', utils.type.IMAGES);
dataset.labels = utils.parseDataset('emnist-digits-train-labels-idx1-ubyte', utils.type.LABELS).data;
var filePath = "./weights";
// var labels = utils.parseDataset('emnist-digits-train-labels-idx1-ubyte', utils.type.LABELS);

var nn = new NeuralNetwork([784, 64, 10])
//var X = [data.data.slice((0 * 28 * 28), 1*28*28)].divide(255);
var X = dataset.data;
// var y = [0, 1, 1, 0];
var y = dataset.labels


// nn.fitByIndex(X, y, learning_rate=0.1, epochs=100);
// utils.saveToFile(filePath, JSON.stringify(nn.weights));
utils.loadFromFile(filePath, (data) => {
	nn.weights = JSON.parse(data);
	console.log("Final prediction")
	for(var i = 0; i < 10; i++){
		console.log(dataset.labels[i], nn.predict_single_data(Array.prototype.slice.call(dataset.data, (i * 28 * 28), (i+1)*28*28).divide(255)).join(", "));
	}
});