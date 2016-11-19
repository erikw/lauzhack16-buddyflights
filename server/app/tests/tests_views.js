/**
 * Created by dtaschik on 19/11/2016.
 */
var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var models = require('../models/user');

var friendsInLocationOtherThanOrigin = require('./../views/login');


// Let's start the test fun #ginpowered
describe('loginTests', function () {
  beforeEach(function() {
		this.request = sinon.stub(http, 'request');
	});

	afterEach(function() {
		http.request.restore();
	});


  beforeEach(function () {
    // runs before each test in this block
    tim = User({'facebookId': 42, city: 'Berlin, firstName: 'Tim',
      lastName: 'Specht'})
    erik = User({'facebookId': 1000, city: 'Lund', firstName: 'Erik',
      lastName: 'Westrup'})
    me = User({'facebookId': 1337, city: 'Berlin', firstName: 'Sarah',
      lastName: 'Unicorn'})

    saveFriendsToDatabase(me.facebookId, [tim, erik])
    })
  });

  it('test that the function returns all friends that live not ' +
    'at the origin of the caller', function () {
    //setup
    expect(cartSummary.getSubtotal()).to.equal(0);
  });
});
