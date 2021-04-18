//modules
require("@babel/polyfill")
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
//express 
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');

//routes
app.get('/', function (req, res) {
	res.render('index');
});

app.get('/about', function (req, res) {
	res.render('about');
});

app.get('*', (req, res) => {
	res.redirect('/');
});

module.exports = app;