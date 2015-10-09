/**
 * Created by hector on 08.10.15.
 */
'use strict';
var userId = 0;

var User = function(userName){
	var ws = null;
	var userId = userId++;

	return {
		get id(){return userId},
		get name(){return userName},
		get isConnected(){return ws !== null},
		set connection(socket){
			if(ws !== null)
				throw new Error('User already connected');
			ws = socket;
		},
		sendMessage: function(message){
			message = JSON.stringify(message);
			ws.send(message, function(err){});
		}
	}
};

exports.createUser = function(username){
	return User(username);
};