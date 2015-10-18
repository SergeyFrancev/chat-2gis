/**
 * Created by hector on 08.10.15.
 */
'use strict';
var UserFactory = require('./userFactory.js');
var MessageFactory = require('./message.js');
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
	var users = UserFactory.users;
	for(var i = 0; i < users.length; i++)
		users[i].sendJSON(data);
};

var addUser = function(user){
	user.sendJSON({
		event: 'success-login',
		user: {name: user.name},
		messages: messages
	});
	var message = MessageFactory.createSystemMessage('В чат вошел ' + user.name);
	sendChatMessage(message);
	sendUpdateUserList();
};

var disconnectUser = function(user){
	var message = MessageFactory.createSystemMessage(user.name + ' покинул чат');
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
	var users = UserFactory.users;
	for(var i = 0; i < users.length; i++)
		listUser.push({username: users[i].name});
	return listUser;
};

UserFactory.on('add_user', addUser);
UserFactory.on('leave_user', disconnectUser);
UserFactory.on('invalid_username', function(socket, message){
	socket.send(JSON.stringify({
		event: 'error-login',
		error: message
	}));
});

var onMessageWS = function(user, data){
	switch(data.event){
	case 'sendMessage': // On user send message
		data.message = data.message || '';
		var mes = MessageFactory.createMessage(user.name, data.message);
		if(mes !== false)
			sendChatMessage(mes);
		break;
	}
};

exports.connectUser = function(ws){
	var user = false;

	ws.on('message', function(data){
		try{
			data = JSON.parse(data);
		}
		catch(e){
			return;
		}

		if(!user && data.event == 'singInUser'){
			var username = data.username || '';
			user = UserFactory.createUser(ws, username);
		}
		else if(user)
			onMessageWS(user, data);
	});

	ws.on('close', function(){
		UserFactory.deleteUser(user);
	});
};