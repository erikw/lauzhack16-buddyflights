/**
 * Created by dtaschik on 19/11/2016.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// TODO graph model to know who is friends with who
var UserSchema   = new Schema({
    id: String,
    facebookId: String,
    city: String,
    long: String,
    lat: String,
});

module.exports = mongoose.model('User', UserSchema);
