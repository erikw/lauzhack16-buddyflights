var request = require('request');
var helpers = require('../helpers');
var sprintf = require("sprintf-js").sprintf;
var login = require('./login')
var axios = require('axios');
var models = require('../models/user');
var GoogleLocations = require('google-locations');

function get_skyscanner_key() {
  return process.env.SKYSCANNER_API_KEY;
}

function get_location_key() {
  return process.env.GOOGLE_LOCATION_API_KEY;
}


function make_location_promise(result, tripKey, destKey) {
  return new Promise(function(resolve, reject) {
    var search = result[tripKey][destKey]['name'];
    console.log("SearcH: " + search);
    var locations = new GoogleLocations(get_location_key());
    locations.autocomplete({input: search}, function(err, response) {
      console.log(err);
      console.log(response);
      locations.details({placeid: response.predictions[0].place_id}, function(err, response) {
        loc = response.result.geometry.location;
        result[tripKey][destKey]['location']['longitude'] = loc.lng;
        result[tripKey][destKey]['location']['latitude'] = loc.lat;
        resolve(result);
      });
     });
  });
}

function date2unix(date) {
  return new Date(date).getTime() / 1000;
}

function get_friend_departure_date(departure, returnd) {
  dep_s = date2unix(departure);
  ret_s = date2unix(returnd);
  diff_s = ret_s - dep_s;
  diff_friend_s = Math.round(diff_s * 0.4);
  friend_dep_s = dep_s + diff_friend_s;

  return new Date(friend_dep_s * 1000).toISOString().slice(0,10);
}

function skyscannerBrowseData(from, from_human, to, to_human, departure, returnd, friendRel) {
  var market = 'UK';
  var currency = 'EUR';
  var locale = 'GB-EN';
  var friendDeparture = get_friend_departure_date(departure, returnd);
  var url_base = sprintf('http://partners.api.skyscanner.net/apiservices/browsedates/v1.0/%s/%s/%s', market, currency, locale);
  var url_toFriend = sprintf(url_base + "/%s/%s/%s/%s", from, to, departure, friendDeparture);
  var params = {apiKey: get_skyscanner_key(), application: 'json'};

  return axios.get(url_toFriend, {params: params}).then(function(resp) {
    if (resp.data.Dates.OutboundDates.length > 0) {
      // Only check one for now..
      var outdate = resp.data.Dates.OutboundDates[0];

      return new Promise(function(resolve, reject) {
        models.User.find({'facebookId': friendRel.toId}, function(error, friend) {
          if (error) {
            console.log(error);
          }
          friend = friend[0];
          if (error) {
            reject(error);
          } else {
            var ret = {};
            ret['friend'] = {first_name: friend.firstName, last_name: friend.lastName, profile_pic: friend.profilePicture};


            ret['tripToFriend'] = {
              price: outdate['Price'],
              departureDate: departure,
              start: {name: from_human, location: {}},
              destination: {name: friend.city, airport: friend.airport, location: {}},
            };

            resolve(ret);
          }
        });
      }).then(function(result) {
        return make_location_promise(result, "tripToFriend", "start");
      }).then(function(result) {
        return make_location_promise(result, "tripToFriend", "destination");
      }).then(function(result) {
        var url_toDest = sprintf(url_base + "/%s/%s/%s/%s", result.tripToFriend.destination.airport, to, friendDeparture, returnd);
        return axios.get(url_toDest, {params: params}).then(function(resp) {
          if (resp.data.Dates.OutboundDates.length > 0) {
            var ret = {};
            // Only check one for now..
            var outdate = resp.data.Dates.OutboundDates[0];
            result['tripToDestination'] = {
              price: outdate['Price'],
              departureDate: friendDeparture,
              start: {name: result.tripToFriend.destination.airport, location: {}},
              destination: {name: to_human, location: {}},
            };
            return result;
          }
        }).catch(function(error) {
          console.log(error);
        });
      }).then(function(result) {
        return make_location_promise(result, "tripToDestination", "start");
      }).then(function(result) {
        return make_location_promise(result, "tripToDestination", "destination");
    }).catch(function(error) {
          console.log(error);
      });

    }
  });
}


function flights(req, res) {
  req.checkBody('from', "Missing 'from'!").notEmpty();
  req.checkBody('from_human', "Missing 'from_human'!").notEmpty();
  req.checkBody('to', "Missing 'to'!").notEmpty();
  req.checkBody('to_human', "Missing 'to_human'!").notEmpty();
  req.checkBody('departure', "Missing 'departure'!").notEmpty();
  req.checkBody('return', "Missing 'return'!").notEmpty();
  req.checkBody('facebookId', "Missing 'facebookId'!").notEmpty();

  var from = req.body.from;
  var from_human = req.body.from_human;
  var to = req.body.to;
  var to_human = req.body.to_human;
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
      friendPromises.push(skyscannerBrowseData(from, from_human, to, to_human, departure, returnd, friend));
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
