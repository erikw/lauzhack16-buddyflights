var User = require('../models/user');
var uuid = require('node-uuid');
var helpers = require('../helpers');


function login(req, res) {
  // Validation
  req.checkBody('facebookId', 'Invalid facebookId, must be numeric!').notEmpty();
  req.checkBody('city', 'Invalid City!').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {

    // parse request body

    var facebookId = req.body.facebookId;
    var city = req.body.city;

    // ensure uniqueness of facebookId
    var count = 0;
    var query = User.find({facebookId: facebookId}).count();

    query.exec(function (err, result) {
      if (err) return handleError(err);
      count = result;

      if (count > 0) {
        helpers.handleError(req,res, 'User already existing!')
        return;
      } else {
        // store the object in the DB
        var newUser = User({id: uuid.v4(), facebookId: facebookId, city: city});
        newUser.save(function (err) {
          if (err)
            helpers.handleError(req,res, err)
          res.json({message: 'User created!'})
        })
      }
    });
  }
}

function profile(req, res) {
  // Pull the user out of the DB
  User.findById(req.params.facebookId, function (err, user) {
    if (err)
      res.send(err);

    res.json(user);
  })
}

// Export
module.exports = {
  login: login,
  profile: profile
};
