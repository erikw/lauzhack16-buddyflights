// Imports
var express = require('express');
var bodyParser = require('body-parser');
var viewHelloErik = require('./app/views/helloerik.js');
var viewFlight = require('./app/views/flights.js');

// Config webserver
var port = 8000;
var app = express();
// configure app to use bodyParser() this will let us get the data from a POST.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get('/1/helloerik', viewHelloErik.helloErik);
app.get('/1/flights', viewFlight.flights);

// database setup
var mongoose   = require('mongoose');
mongoose.connect('mongodb://mongo:27017/lauzhack'); // connect to our database

// run the server
app.listen(8000);
console.log('Server started on port ' + port);
