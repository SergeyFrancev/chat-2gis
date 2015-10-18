/**
 * Created by hector on 08.10.15.
 */
'use strict';
var util = require('util');
var events = require('events');
var User = require('./user.js');

var UserFactory = function(){};
util.inherits(UserFactory, events.EventEmitter);

var users = [];

UserFactory.prototype.createUser = function(socket, username){
	var res = validateUserName(username);
	if(res !== true){
		this.emit('invalid_username', socket, res);
		return;
	}

	var user = new User(socket, username);
	users.push(user);
	this.emit('add_user', user);
	return user;
};

UserFactory.prototype.deleteUser = function(user){
	if(!(user instanceof User))
		return;

	for(var i = 0; i < users.length; i++)
	{
		if(users[i].name == user.name)
		{
			var _user = users[i];
			users.splice(i, 1);
			this.emit('leave_user', _user);
			break;
		}
	}
};

Object.defineProperty(UserFactory.prototype, 'users', {
	get: function(){return users;}
});

module.exports = new UserFactory();

/**
 * If username incorrect or already exist return string description error else return TRUE
 * @param username
 * @returns bool|string
 */
var validateUserName = function(username){
	if((typeof username === 'string') && /^[a-z0-9_]{3,24}$/gi.test(username)){
		//Check user name exist
		for(var i = 0; i < users.length; i++){
			if(users[i].name == username)
				return 'User name already exist';
		}
		return true;
	}
	else
		return 'Incorrect user name';
};