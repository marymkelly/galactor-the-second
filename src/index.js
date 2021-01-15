//modules
import '@babel/polyfill';
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

//express 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

//routes
app.get('/', function (req, res) {
	res.render('index');
});

app.get('/stars', (req, res) => {
	res.render('stars');
});

module.exports = app;