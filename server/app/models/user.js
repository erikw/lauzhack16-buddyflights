/**
 * Created by dtaschik on 19/11/2016.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    id: {type: String,  unique: true},
    facebookId: {type: String,  unique: true},
    city: String,
    airport: String,
    firstName: String,
    lastName: String,
    profilePicture: String
});

var RelationShipSchema = new Schema({
  fromId: String,
  toId: String
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  Relationship: mongoose.model('Relationship', RelationShipSchema)
};
