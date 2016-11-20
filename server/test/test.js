/**
 * Created by dtaschik on 19/11/2016.
 */
var chai = require('chai');
var assert = require('chai').assert;
var expect = require('chai').expect;
var models = require('../app/models/user');
var login = require('../app/views/login');

// Let's start the test fun #ginpowered
describe('loginTests', function () {

  beforeEach(function () {
    // runs before each test in this block
    var tim = models.User({'facebookId': 42, city: 'Berlin', firstName: 'Tim', lastName: 'Specht'});
    var erik = models.User({'facebookId': 1000, city: 'Lund', firstName: 'Erik', lastName: 'Westrup'});
    var me = models.User({'facebookId': 1337, city: 'Berlin', firstName: 'Sarah', lastName: 'Unicorn'});

    var friends = [tim, erik];
    login.saveFriendsToDatabase(me.facebookId, friends);
  });

  it('test that the function returns all friends that live not ' +
    'at the origin of the caller', function () {
    //setup
    me = models.User.find({facebookId: 1337}).exec(function () {
      friends = login.handleFriendsInLocationOtherThanOriginme(me.facebookId);
      assert.isArray(friends);
      assert.oneOf(erik, friends, 'Not found in list');
      expect(friends.to.not.include(tim));
    })
  })
});

