const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
	res.render('index');
})

app.post('/', function (req, res) {
	fs.readFile('./public/data/temp.txt', 'utf8', function(err, contents) {
		if(err){
			console.log("Error:" + err);
		}
		else{
			console.log(contents);
		}
	});
	res.render('index');
  console.log(req.body);
})

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
})