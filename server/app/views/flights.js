var request = require('request');
var helpers = require('../helpers');

function get_skyscanner_key() {
  return process.env.SKYSCANNER_API_KEY;
}

function flights(req, res) {
  req.checkBody('from', "Missing 'from'!").notEmpty();
  req.checkBody('to', "Missing 'to'!").notEmpty();
  req.checkBody('departure', "Missing 'to'!").notEmpty();

  var from = req.body.from;
  var to = req.body.to;
  var departure = req.body.departure;
  console.log("Flights API valled with from=" + from + ", to=" + to + ", departure=" + departure);

  var errors = req.validationErrors();
  if (errors) {
    helpers.handleError(req,res)
    return;
  }

  res.send(JSON.stringify({result: "Hello flight!"}, null, 3));
}

function airport_suggest(req, res) {
  req.checkBody('query', "Missing 'query'!").notEmpty();
  var query = req.body.query;
  console.log("Airport suggest API valled with query=" + query);

  res.setHeader('Content-Type', 'application/json');

  var errors = req.validationErrors();
  if (errors) {
    helpers.handleError(req,res)
    return;
  }

  // http://partners.api.skyscanner.net/apiservices/autosuggest/v1.0/UK/GBP/GB-EN/?query=london&apiKey=prtl6749387986743898559646983194&application=json
  var url = 'http://partners.api.skyscanner.net/apiservices/autosuggest/v1.0/UK/GBP/GB-EN/';
  var propertiesObject = {query: query,
                          apiKey: get_skyscanner_key(),
                          application: 'json'};

  request.get({url:url, qs:propertiesObject}, function(err, response, body) {
    if (err) {
      res.status(400).send(JSON.stringify({error: "Got error message from SkyScanner:  " + err}, null, 3));
      return;
    }
    console.log("Got from SkyScanner response code: " + response.statusCode);
    res.send(body);
  });
}

// Export
module.exports = {
  flights: flights,
  airport_suggest: airport_suggest,
};
