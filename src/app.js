//modules
// import '@babel/polyfill';
require("@babel/polyfill")
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const firebase = require('./firebase/firebase');

//express 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

//routes
app.get('/', function (req, res) {
	firebase.analytics()
	res.render('index');
});

app.get('/stars', (req, res) => {
	res.render('stars');
});

// firebase.analytics();

module.exports = app;