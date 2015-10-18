/**
 * Created by hector on 18.10.15.
 */
'use strict';
var util = require('util');

var User = function(socket, userName){
	this._socket = socket;
	this._username = userName;
};
util.inherits(User, Object);

User.prototype.sendJSON = function(data){
	data = JSON.stringify(data);
	this._socket.send(data, function(err){});
};

Object.defineProperty(User.prototype, 'name', {
	get: function(){
		return this._username;
	}
});

module.exports = User;