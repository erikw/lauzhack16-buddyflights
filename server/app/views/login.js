var models = require('../models/user');
var uuid = require('node-uuid');
var helpers = require('../helpers');

function createUser(req, res) {
  // parse request body
  var facebookId = req.body.facebookId;
  var city = req.body.city;
  var airport = req.body.airport;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var profilePicture = req.body.profilePicture;

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
      var newUser = models.User({
        id: uuid.v4(),
        facebookId: facebookId,
        city: city,
        airport: airport,
        firstName: firstName,
        lastName: lastName,
        profilePicture: profilePicture
      });
      newUser.save(function (err) {
        if (err)
          helpers.handleError(req, res, err)
        res.json({message: 'User created!', object: newUser})
      })
    }
  });
}

function saveFriendsToDatabase(fromId, friendsArray) {
  console.log(fromId, friendsArray);
  friendsArray.forEach(function (facebookId) {
    var toId = facebookId;
    models.Relationship.find({fromId: fromId, toId: toId}, function(err, relationships) {
      if (relationships.length == 0){
        var newRelationship = models.Relationship({fromId: fromId, toId: toId});
        newRelationship.save(function (err) {
          if (err) {
            helpers.handleError(req, res, err);
          }
      });
    }
    console.log('Relationship created for %s with %s!', fromId, toId);
    });

    models.Relationship.find({fromId: toId, toId: fromId}, function(err, relationships) {
      if (relationships.length == 0){
        var newRelationship = models.Relationship({fromId: toId, toId: fromId});
        newRelationship.save(function (err) {
          if (err) {
            helpers.handleError(req, res, err);
          }
      });
    }
    console.log('Relationship created for %s with %s!', toId, fromId);
    });
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
    friends = handleFriendsInLocationOtherThanOrigin(facebookId, function(friends) {
      return friends
    });
  }
}

function handleFriendsInLocationOtherThanOrigin(facebookId, callback) {
  // do the logic
  models.User.find({'facebookId': facebookId}, function(err, user) {
    user = user[0];
    origin = user.city;
    models.Relationship.find({fromId: facebookId}, function(err, friends) {
      friends.forEach(function (friend) {
        models.User.find({facebookId: friend.toId}, function(err, user){
          if (err) {
            console.log(err);
          }
          friend = user[0];
          if (friend.city == origin) {
            var i = friends.indexOf(friend);
            friends.splice(i, 1);
          }
        });
      });
      callback(friends);
    });
  });
}

function login(req, res) {
  // Validation
  req.checkBody('facebookId', 'Invalid facebookId, must not be empty!').notEmpty();
  req.checkBody('city', 'Invalid City!').notEmpty();
  req.checkBody('airport', 'Invalid Airport!').notEmpty();
  req.checkBody('firstName', 'first name needs to be a string').optional().isAlpha();
  req.checkBody('lastName', 'last name needs to be a string').optional().isAlpha();
  req.checkBody('profilePicture', 'Not valid URL').optional();

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

// Export
module.exports = {
  login: login,
  saveFriendsToDatabase: saveFriendsToDatabase,
  handleFriendsInLocationOtherThanOrigin: handleFriendsInLocationOtherThanOrigin
};
