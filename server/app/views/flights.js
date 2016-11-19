var request = require('request');
var helpers = require('../helpers');
var sprintf = require("sprintf-js").sprintf;


function get_skyscanner_key() {
  return process.env.SKYSCANNER_API_KEY;
}

function flights(req, res) {
  req.checkBody('from', "Missing 'from'!").notEmpty();
  req.checkBody('to', "Missing 'to'!").notEmpty();
  req.checkBody('departure', "Missing 'to'!").notEmpty();
  req.checkBody('return', "Missing 'return'!").notEmpty();
  req.checkBody('facebookId', "Missing 'facebookId'!").notEmpty();

  var from = req.body.from;
  var to = req.body.to;
  var departure = req.body.departure;
  var returnd = req.body.departure;
  var facebookId = req.body.facebookId;
  console.log("Flights API called with from=" + from + ", to=" + to + ", departure=" + departure + ", return=" +
              returnd + ", facebookId=" + facebookId);

  helpers.setHeaders(res)
  var errors = req.validationErrors();
  if (errors) {
    helpers.handleError(req,res)
    return;
  }

  var market = 'UK';
  var currency = 'EUR';
  var locale = 'GB-EN';
  // TODO make intermediate destination  be e.g. 25% of original vacation time
  var url = sprintf('http://partners.api.skyscanner.net/apiservices/browsedates/v1.0/%s/%s/%s/%s/%s/%s/%s',
                    market, currency, locale, from, to, departure, returnd);

  var propertiesObject = {apiKey: get_skyscanner_key(), application: 'json'};

  request.get({url:url, qs:propertiesObject}, function(err, response, body) {
    if (err) {
      res.status(response.statusCode).send(JSON.stringify({error: "Got error message from SkyScanner:  " + err}, null, 3));
      return;
    }
    console.log("Got from SkyScanner response code: " + response.statusCode);
    res.send(body);
  });
}

function airport_suggest(req, res) {
  req.checkBody('query', "Missing 'query'!").notEmpty();
  var query = req.body.query;
  console.log("Airport suggest API called with query=" + query);

  res.setHeader('Content-Type', 'application/json');

  helpers.setHeaders(res)
  var errors = req.validationErrors();
  if (errors) {
    helpers.handleError(req,res)
    return;
  }

  var url = 'http://partners.api.skyscanner.net/apiservices/autosuggest/v1.0/UK/GBP/GB-EN/';
  var propertiesObject = {query: query,
                          apiKey: get_skyscanner_key(),
                          application: 'json'};

  request.get({url:url, qs:propertiesObject}, function(err, response, body) {
    if (err) {
      res.status(response.statusCode).send(JSON.stringify({error: "Got error message from SkyScanner:  " + err}, null, 3));
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
