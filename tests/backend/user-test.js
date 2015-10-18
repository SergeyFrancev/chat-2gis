/**
 * Created by hector on 08.10.15.
 */
var UserFactory = require('../../chat/userFactory.js');
var expect = require('chai').expect;
var assert = require('chai').assert;

describe('User Factory', function(){
	var user,
		ws = {};
	it('create user', function(){
		expect(function(){
			user = UserFactory.createUser(ws, 'test');
		}).to.not.throw();
	});

	it('emit event "add_user" on success create user', function(){
		var res = false;
		UserFactory.on('add_user', function(){res = true});
		UserFactory.createUser(ws, 'ololo');
		assert.equal(res, true);
	});

	it('emit event "invalid_username" on success incorrect user name', function(){
		var res = false;
		UserFactory.on('invalid_username', function(){res = true});
		UserFactory.createUser(ws, '***((');
		assert.equal(res, true);
	});

	it('emit event "invalid_username" on username exist', function(){
		var res = false;
		UserFactory.on('invalid_username', function(){res = true});
		UserFactory.createUser(ws, 'test');
		assert.equal(res, true);
	});

	it('emit event "leave_user" on drop user', function(){
		var res = false;
		UserFactory.on('leave_user', function(){res = true});
		UserFactory.deleteUser(user);
		assert.equal(res, true);
	});

	it('factory has property users is ARRAY', function(){
		assert.property(UserFactory, 'users');
		assert.isArray(UserFactory.users);
	});

	it('Count users should by 1', function(){
		assert.lengthOf(UserFactory.users, 1);//ololo
	});
});