/**
 * Created by dtaschik on 19/11/2016.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    id: String,
    facebookId: String,
    city: String,
});

module.exports = mongoose.model('User', UserSchema);
