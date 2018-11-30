const express = require('express');
const bodyParser = require('body-parser');
const utils = require('./utils/utils');
const NeuralNetwork = require('./utils/neural-network');
const app = express();
const config = require('./config');


var dataset = utils.parseDataset(config.imageFile, utils.type.IMAGES);
dataset.labels = utils.parseDataset(config.labelsFile, utils.type.LABELS).data;

var nn = new NeuralNetwork(config.weightsFile);

var X = dataset.data;
var y = dataset.labels
// nn.fitByIndex(X, y, learning_rate=0.1, epochs=100);

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

app.post('/predict', function (req, res) {
	var arr = JSON.parse("["+req.body.image+"]");
	var img = utils.reshapeImage(arr, 28, 28);
	var predictions = nn.predict_single_data(img);
	var maxIndex = predictions.indexOf(Math.max(...predictions));
	res.end(""+maxIndex);
})

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
})