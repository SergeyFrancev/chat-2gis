/**
 * Created by hector on 08.10.15.
 */
var User = require('../server/user.js');
var expect = require('chai').expect;
var assert = require('chai').assert;

describe('User', function(){
	var user;
	it('create user', function(){
		expect(function(){
			user = User.createUser('test');
		}).to.not.throw('good function');
	});

	it('user have property id', function(){
		assert.property(user, 'id');
	});

	it('user unique id', function(){
		var newUse = User.createUser('test2');
		assert.notEqual(newUse.id, user.id, 'id is not unique');
	});
});