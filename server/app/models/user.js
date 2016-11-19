/**
 * Created by dtaschik on 19/11/2016.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    facebookId: String,
    long: Float32Array,
    lat: Float32Array,
    city: String
});

module.exports = mongoose.model('User', UserSchema);
