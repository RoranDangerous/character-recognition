const express = require('express');
const bodyParser = require('body-parser');
var nn = require('./utils/neural-network');
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

//parseDataset('emnist-digits-train-labels-idx1-ubyte', TYPE.LABELS);
//parseDataset('emnist-digits-train-images-idx3-ubyte', TYPE.IMAGES);