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

var data = utils.parseDataset('emnist-digits-train-images-idx3-ubyte', utils.type.IMAGES);
data.labels = utils.parseDataset('emnist-digits-train-labels-idx1-ubyte', utils.type.LABELS).data;
// var labels = utils.parseDataset('emnist-digits-train-labels-idx1-ubyte', utils.type.LABELS);

var nn = new NeuralNetwork([784, 50, 10, 10])
//var X = [data.data.slice((0 * 28 * 28), 1*28*28)].divide(255);
var X = data.data;
// var y = [0, 1, 1, 0];
var y = data.labels

nn.fitByIndex(X, y, learning_rate=0.1, epochs=100)

console.log("Final prediction")
for(var i = 0; i < 5; i++){
	console.log(data.labels[i], nn.predict_single_data(Array.prototype.slice.call(data.data, (i * 28 * 28), (i+1)*28*28).divide(255)));
}