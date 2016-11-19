var User = require('../models/user');

function login(req, res) {

  // Validation
  req.checkBody('facebookId', 'Invalid facebookId, must be numeric!').notEmpty();
  req.checkBody('city', 'Invalid City!').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {

    // no validation errors let's continue

    var facebookId = req.body.facebookId;
    var city = req.body.city;

    // ensure uniqueness
    var count = 0;
    var query = User.find({facebookId: facebookId}).count();

    query.exec(function (err, result) {
      if (err) return handleError(err);
      count = result;

      if (count > 0) {
        res.status(400);
        res.send('User already existing!');
        return;
      } else {
        // store the object in the DB
        var newUser = User({facebookId: facebookId, city: city});
        newUser.save(function (err) {
          if (err)
            re.send(err);
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
