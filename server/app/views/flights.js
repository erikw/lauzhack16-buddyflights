var request = require('request');
var helpers = require('../helpers');
var sprintf = require("sprintf-js").sprintf;
var login = require('./login')
var axios = require('axios');
var models = require('../models/user');

function get_skyscanner_key() {
  return process.env.SKYSCANNER_API_KEY;
}

function skyscannerBrowseData(from, to, departure, returnd, friendRel) {
  var market = 'UK';
  var currency = 'EUR';
  var locale = 'GB-EN';
  var friendDeparture = '2016-12-17'  // TODO make intermediate destination  be e.g. 25% of original vacation time
  var url_base = sprintf('http://partners.api.skyscanner.net/apiservices/browsedates/v1.0/%s/%s/%s', market, currency, locale);
  var url_toFriend = sprintf(url_base + "/%s/%s/%s/%s", from, to, departure, returnd);
  var params = {apiKey: get_skyscanner_key(), application: 'json'};

  return axios.get(url_toFriend, {params: params}).then(function(resp) {
    if (resp.data.Dates.OutboundDates.length > 0) {
      // Only check one for now..
      var outdate = resp.data.Dates.OutboundDates[0];

      return new Promise(function(resolve, reject) {
        models.User.find({'facebookId': friendRel.toId}, function(error, friend) {
          friend = friend[0];
          if (error) {
            reject(error);
          } else {
            var ret = {};
            ret['friend'] = {first_name: friend.firstName, last_name: friend.lastName, profile_pic: friend.profilePicture};
            // TODO attach airport coordinates with tim's code
            ret['tripToFriend'] = {
              price: outdate['Price'],
              start: {name: from, location: {longitud: 12345, latitude: 7890}},
              destination: {name: friend.city, location: {longitud: 12345, latitude: 7890}},
            };

            //ret['tripToDestination'] = {} // TODO

            resolve(ret);
          }
        });
      }).then(function(result) {
        var url_toDest = sprintf(url_base + "/%s/%s/%s/%s", result.tripToFriend.destination.name, to, departure, returnd);
        return axios.get(url_toDest, {params: params}).then(function(resp) {
          if (resp.data.Dates.OutboundDates.length > 0) {
            var ret = {};
            // Only check one for now..
            var outdate = resp.data.Dates.OutboundDates[0];
            result['tripToDestination'] = {
              price: outdate['Price'],
              start: {name: result.tripToFriend.destination.name, location: {longitud: 12345, latitude: 7890}},
              destination: {name: to, location: {longitud: 12345, latitude: 7890}},
            };
            return result;
          }
        }).catch(function(error) {
          console.log(error);
        });
      }).catch(function(error){
          console.log(error);
      });
    }
  });
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

  login.handleFriendsInLocationOtherThanOrigin(facebookId, function(friends) {
    console.log("%s friends to scan", friends.length);
    var friendPromises = [];
    friends.forEach(function (friend) {
      friendPromises.push(skyscannerBrowseData(from, to, departure, returnd, friend));
    });
    Promise.all(friendPromises).then(values => {
     res.send(JSON.stringify(values, null, 3));
    }, function(error) {
     res.status(500).send("Error getting friends fligights");
    });
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
