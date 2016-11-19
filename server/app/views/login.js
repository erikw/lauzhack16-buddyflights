var User = require('../models/user');

function login(req, res) {

  // Validation
  req.checkBody('facebookId', 'Invalid facebookId, must be numeric!').notEmpty();
  req.checkBody('city', 'Invalid City!').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {  // store the object in the model

    var newUser = User({facebookId: req.body.facebookId, city: req.body.city});
    newUser.save(function (err) {
      if (err)
        re.send(err)
      res.json({message: 'User created!'})
    })
  }
}

function profile(req, res){
  // Pull the user out of the DB
  User.findById(req.params.facebookId, function(err, user) {
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
