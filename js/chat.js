/**
 * Created by hector on 08.10.15.
 */
var chat = chat || {};
chat.client = (function(){
	'use strict';
	var socket = false,
		eventsList = {};

	var onMessageSocket = function(event){
		var data = JSON.parse(event.data);
		switch (data.event){
		case 'success-login':
			fireEvent('startChat', {messages: data.messages});
			break;
		case 'error-login':
			fireEvent('errorLogin', {message: data.error});
			break;
		case 'new-message':
			fireEvent('newMessage', data.message);
			break;
		case 'update-user-list':
			fireEvent('updateUserList', data.users);
			break;
		}
	};

	var onOpenSocket = function(){
	};

	var onCloseSocket = function(){
		fireEvent('errorConnection', {message: 'Server close socket'});
		socket = false;
	};

	var onErrorSocket = function(){
		fireEvent('errorConnection', {message: 'Server error'});
		socket = false;
	};

	var fireEvent = function(){
		var eventName = arguments[0],
			args = [], i;
		if(typeof eventsList[eventName] == 'undefined')
			return;

		for(i=1; i<arguments.length; i++)
			args.push(arguments[i]);

		for(i=0; i<eventsList[eventName].length; i++)
			eventsList[eventName][i].apply(this, args);
	};

	var methods = {
		createChat: function(conf){
			if(socket !== false)
				return;

			var ip = conf.ip || '127.0.0.1';
			var port = conf.port || '8888';

			socket = new WebSocket("ws://"+ip+":"+port);
			socket.onmessage = onMessageSocket;
			socket.onopen = onOpenSocket;
			socket.onclose = onCloseSocket;
			socket.onerror = onErrorSocket;

			var sendMessage = function(data){
				if(socket !== false)
					socket.send(JSON.stringify(data))
			};
			return {
				singInUser: function(username){
					sendMessage({
						event: 'singInUser',
						username: username
					});
				},
				sendMessage: function(message){
					sendMessage({
						event: 'sendMessage',
						message: message
					});
				}
			}
		},
		on: function(event, callback){
			if(typeof eventsList[event] == 'undefined')
				eventsList[event] = [];
			eventsList[event].push(callback);
		}
	};

	return methods;
})();