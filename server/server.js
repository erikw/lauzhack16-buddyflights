// Imports
var util = require('util');
var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var cors  = require('cors');

var viewHelloErik = require('./app/views/helloerik.js');
var viewFlight = require('./app/views/flights.js');
var viewLogin = require('./app/views/login.js');


// Config webserver
var port = 8000;
var app = express();
// configure app to use bodyParser() this will let us get the data from a POST.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cors());

// Routes
app.get('/1/helloerik', viewHelloErik.helloErik);
app.post('/1/login', viewLogin.login);
app.post('/1/flights', viewFlight.flights);
app.post('/1/airport_suggest', viewFlight.airport_suggest);

// database setup
var mongoose   = require('mongoose');
mongoose.connect('mongodb://mongo:27017/test'); // connect to our database

// Run the server
app.listen(8000);
console.log('Server started on port ' + port);
