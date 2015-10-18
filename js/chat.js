/**
 * Created by hector on 08.10.15.
 */
'use strict';
var ChatApp = ChatApp || {};
(function(){
	var ChatClient = function(){
		ChatApp.eventEmitter.apply(this);
		this._socket = false;
		this._ip = null;
		this._port = null;
	};
	ChatClient.prototype = Object.create(ChatApp.eventEmitter.prototype);
	ChatClient.constructor = ChatClient;

	ChatClient.prototype.connect = function(ip, port){
		if(this._socket){
			console.error("Chat client already connected");
			return false;
		}
		this._ip = ip || '127.0.0.1';
		this._port = port || '8888';

		this._socket = new WebSocket("ws://" + this._ip + ":" + this._port);
		this._socket.onmessage = this.onMessageWS.bind(this);
		this._socket.onopen = this.onOpenWS.bind(this);
		this._socket.onclose = this.onCloseWS.bind(this);
		this._socket.onerror = this.onErrorWS.bind(this);
		return this;
	};

	ChatClient.prototype.disconnect = function(){
		if(!this._socket)
			return;

		this._socket.close();
		this._socket = false;
	};

	ChatClient.prototype.sendJSON = function(data){
		if(this._socket !== false)
			this._socket.send(JSON.stringify(data))
	};

	ChatClient.prototype.sendMessage = function(message){
		this.sendJSON({
			event: 'sendMessage',
			message: message
		});
	};

	ChatClient.prototype.singInUser = function(username){
		this.sendJSON({
			event: 'singInUser',
			username: username
		});
	};

	ChatClient.prototype.onMessageWS = function(event){
		var data = JSON.parse(event.data);
		switch(data.event){
		case 'success-login':
			this.fire('startChat', {messages: data.messages});
			break;
		case 'error-login':
			this.fire('error', {message: data.error, type: 'auth'});
			break;
		case 'new-message':
			this.fire('newMessage', data.message);
			break;
		case 'update-user-list':
			this.fire('updateUserList', data.users);
			break;
		}
	};
	ChatClient.prototype.onOpenWS = function(){};
	ChatClient.prototype.onCloseWS = function(){
		this._socket = false;
		this.fire('error', {message: 'Server close socket', type: 'connection'});
	};
	ChatClient.prototype.onErrorWS = function(){
		this._socket = false;
		this.fire('error', {message: 'Server error', type: 'connection'});
	};

	Object.defineProperty(ChatClient.prototype, 'port', {
		set: function(value){
			this.disconnect();
			this._port = value;
			this.connect(this._ip, this._port);
		},
		get: function(){
			return this._port;
		}
	});

	ChatApp.chatClient = ChatClient;
})();
