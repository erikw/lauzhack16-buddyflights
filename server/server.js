// Imports
var viewHelloErik = require('./app/views/helloerik.js');
var express = require('express')
var bodyParser = require('body-parser');

var app = express()
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/1/helloerik', viewHelloErik.helloErik)

app.listen(8000)
