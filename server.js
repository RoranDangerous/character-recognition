const express = require('express');
const bodyParser = require('body-parser');
var utils = require('./utils/utils');
var NeuralNetwork = require('./utils/neural-network');
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

var dataSize = 50;
var dataset = utils.parseDataset('emnist-digits-train-images-idx3-ubyte', utils.type.IMAGES, dataSize);
dataset.labels = utils.parseDataset('emnist-digits-train-labels-idx1-ubyte', utils.type.LABELS, dataSize).data;

// var arr = [0,0,0,0,0,0,0,0,0,0]
// for(var i = 0; i < 50; i++){
// 	arr[dataset.labels[i]]++;
// }

// for(var i = 0; i < arr.length; i++){
// 	console.log(i+": "+arr[i])
// }
var nn = new NeuralNetwork();
nn.fit(dataset.data, dataset.labels)

// var nn = new NeuralNetwork([784, 50, 10, 10])
// var X = data.data;
// var y = data.labels

// nn.fitByIndex(X, y, learning_rate=0.1, epochs=100)

// console.log("Final prediction")
// for(var i = 0; i < 5; i++){
// 	console.log(data.labels[i], nn.predict_single_data(Array.prototype.slice.call(data.data, (i * 28 * 28), (i+1)*28*28).divide(255)));
// }