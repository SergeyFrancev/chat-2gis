/**
 * Created by hector on 08.10.15.
 */
'use strict';
var UserFactory = require('./user.js');
var MessageFactory = require('./message.js');
var users = [];
var messages = [];

/**
 * Send new message in chat window
 * @param message
 */
var sendChatMessage = function(message){
	messages.push(message);
	sendBroadcast({
		event: 'new-message',
		message: message
	});
};

/**
 * Send message all online users
 * @param data
 */
var sendBroadcast = function(data){
	for(var i = 0; i < users.length; i++){
		if(users[i].isConnected)
			users[i].sendMessage(data);
	}
};

/**
 * Add user to list
 * @param user
 */
var addUser = function(user){
	users.push(user);
	var message = MessageFactory.createSystemMessage('В чат вошел ' + user.name);
	sendChatMessage(message);
	sendUpdateUserList();
};

var sendUpdateUserList = function(){
	sendBroadcast({
		event: 'update-user-list',
		users: getUserList()
	});
};

var getUserList = function(){
	var listUser = [];
	for(var i = 0; i < users.length; i++)
		listUser.push({username: users[i].name});
	return listUser;
};

var disconnectUser = function(user){
	var index = null;
	for(var i = 0; i < users.length; i++){
		if(users[i].name == user.name){
			index = i;
			break;
		}
	}
	var message = MessageFactory.createSystemMessage(users[index].name + ' покинул чат');
	//Remove user from users list
	users.splice(index, 1);
	sendChatMessage(message);
	sendUpdateUserList();
};

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

/**
 * Is user name valid return add user and return object else return false
 * @param ws WebSocket
 * @param data Object
 * @returns false|object
 */
var singInUser = function(ws, data){
	var username = data.username;
	var res = validateUserName(username);
	if(res !== true){
		ws.send(JSON.stringify({
			event: 'error-login',
			error: res
		}));
		return false;
	}

	try{
		var user = UserFactory.createUser(username);
		user.connection = ws;
		user.sendMessage({
			event: 'success-login',
			user: {name: username},
			messages: messages
		});
		addUser(user);
	}
	catch(e){
		ws.send(JSON.stringify({
			event: 'error-login',
			error: 'Server error'
		}));
	}
	return user;
};

exports.connectUser = function(ws){
	var user = false;

	ws.on('message', function(data){
		data = JSON.parse(data);
		switch(data.event){
		case 'singInUser': //On user sing in
			user = singInUser(ws, data);
			break;

		case 'sendMessage': // On user send message
			if(user === false || (data.message + '').length < 1)
				return;
			var mes = MessageFactory.createMessage(user.name, data.message);
			sendChatMessage(mes);
			break;
		}
	});

	ws.on('close', function(){
		if(user === false)
			return;
		disconnectUser(user);
	});
};