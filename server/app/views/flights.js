var request = require('request');
var helpers = require('../helpers');
var sprintf = require("sprintf-js").sprintf;
var login = require('./login')
var axios = require('axios');

function get_skyscanner_key() {
  return process.env.SKYSCANNER_API_KEY;
}

function skyscannerBrowseData(result, from, to, departure, returnd, facebookId, friend) {
  var market = 'UK';
  var currency = 'EUR';
  var locale = 'GB-EN';
  console.log("calling skyscanner now")
  // TODO make intermediate destination  be e.g. 25% of original vacation time
  var url = sprintf('http://partners.api.skyscanner.net/apiservices/browsedates/v1.0/%s/%s/%s/%s/%s/%s/%s',
    market, currency, locale, from, to, departure, returnd);

  var params = {apiKey: get_skyscanner_key(), application: 'json'};

  var promise = axios.get(url, {params: params}, function (err, response, body) {
    if (err) {
      res.status(response.statusCode).send(JSON.stringify({error: "Got error message from SkyScanner:  " + err}, null, 3));
      return;
    }
    console.log("Got from SkyScanner response code: " + response.statusCode);
    body = JSON.parse(body);

    ret = {};


    if (body['Dates']['OutboundDates'].length > 0) {
      var outdate = body['Dates']['OutboundDates'][0];

      ret[friendId] = {};
      ret[friendId]['friend'] = {firstName: friendFName, lastName: friendLName, profilePic: profilePic};

      var toFriend = {}
      toFriend['price'] = outdate['Price'];
      toFriend['start'] = from;
      toFriend['destination'] = friendLocation;
      ret[friendId]['tripToFriend'] = toFriend


      var toDestination = {}
      ret[friendId]['tripToDestination'] = toDestination;
    }

    // TODO attach airport coordinates with tim's code
    // res.send(JSON.stringify(ret, null, 3));
  });
  result.push(promise)

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
  var returnd = req.body.return;
  var facebookId = req.body.facebookId;
  console.log("Flights API called with from=" + from + ", to=" + to + ", departure=" + departure + ", return=" +
    returnd + ", facebookId=" + facebookId);

  helpers.setHeaders(res)
  var errors = req.validationErrors();
  if (errors) {
    helpers.handleError(req, res)
    return;
  }

  login.handleFriendsInLocationOtherThanOrigin(facebookId, function (friends) {
    console.log("%s friends to scan", friends.length);
    var result = [];
    friends.forEach(function (friend) {
      skyscannerBrowseData(result, from, to, departure, returnd, facebookId, friend)
    });
    Promise.all(result, );
    console.log(result);
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
    helpers.handleError(req, res)
    return;
  }

  var url = 'http://partners.api.skyscanner.net/apiservices/autosuggest/v1.0/UK/GBP/GB-EN/';
  var propertiesObject = {
    query: query,
    apiKey: get_skyscanner_key(),
    application: 'json'
  };

  request.get({url: url, qs: propertiesObject}, function (err, response, body) {
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
