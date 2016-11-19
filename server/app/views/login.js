var models = require('../models/user');

var uuid = require('node-uuid');
var helpers = require('../helpers');

function createUser(req, res) {
  // parse request body
  var facebookId = req.body.facebookId;
  var city = req.body.city;

  // ensure uniqueness of facebookId
  var count = 0;
  var query = models.User.find({facebookId: facebookId}).count();
  query.exec(function (err, result) {
    if (err) return handleError(err);
    count = result;

    if (count > 0) {
      helpers.handleError(req, res, 'User already existing!')
      return;
    } else {
      // store the object in the DB
      var newUser = models.User({id: uuid.v4(), facebookId: facebookId, city: city});
      newUser.save(function (err) {
        if (err)
          helpers.handleError(req, res, err)
        res.json({message: 'User created!'})
      })
    }
  });
}

function saveFriendsToDatabase(fromId, friendsArray){
  friendsArray.forEach(function (toId) {
    var toId = toId
    var newRelationship = models.Relationship({fromId: fromId, toId: toId})
    newRelationship.save(function (err) {
      if (err)
        helpers.handleError(req, res, err)
      console.log('Relationship created for %s with %s!', fromId, toId);
    })
  });
}

function addFriends(req, res) {
  var friends = req.body.friends;
  var fromId = req.body.facebookId;

  console.log("adding %s friends", friends.length)
  saveFriendsToDatabase(fromId, friends)

}

function friendsInLocationOtherThanOrigin(req, res) {
  req.checkBody('facebookId', 'Invalid facebookId, must not be empty!').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    helpers.handleError(req, res, errors);
    return;
  } else {
    var facebookId = req.body.facebookId;
    friends = Relationships.find({fromId: facebookId});

    friends.forEach(function(friend){
      friend = User.find({'facebookId': friend});
      if (friend.city == facebookId){
        var i = array.indexOf(friend);
        friends.splice(i, 1)
      }
    });
  return friends;
  }
}

function login(req, res) {
  // Validation
  req.checkBody('facebookId', 'Invalid facebookId, must not be empty!').notEmpty();
  req.checkBody('city', 'Invalid City!').notEmpty();
  req.checkBody('firstName', 'first name needs to be a string').isString();
  req.checkBody('lastName', 'last name needs to be a string').isString();

  // TODO do validation for list of facebookIds
  // req.checkBody('friends', 'This is not a friends list!')

  var errors = req.validationErrors();
  if (errors) {
    helpers.handleError(req, res, errors)
    return;
  } else {
    createUser(req, res, addFriends(req, res))
  }
}


function profile(req, res) {
  // Pull the user out of the DB
  User.findById(req.params.facebookId, function (err, user) {
    if (err)
      helpers.handleError(req, res, err)

    res.json(user);
  })
}

// Export
module.exports = {
  login: login,
  profile: profile
};
