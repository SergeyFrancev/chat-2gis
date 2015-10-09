window.onload = function() {
	'use strict';
	var singInCont = document.getElementById('singin-container'),
		chatCont = document.getElementById('chat-container'),
		messageContainer = document.getElementById('messages-container'),
		userContainer = document.getElementById('user-container'),
		fieldMessage = document.getElementById('input'),
		sendBtn = document.getElementById('send');

	var Chat = chat.client;
	Chat.on('startChat', function(data){
		var messageList = data.messages;
		chatCont.classList.remove("hide");
		singInCont.classList.add("hide");
		while(messageList.length> 0)
			renderMessage(messageList.shift());
		showErrorLogin(false);
	});
	Chat.on('newMessage', function(data){
		renderMessage(data);
	});
	Chat.on('updateUserList', function(userList){
		userContainer.innerHTML = '';
		for(var i =0; i<userList.length; i++)
			userContainer.innerHTML = userContainer.innerHTML + chat.template.getHtml('user', userList[i]);
	});
	Chat.on('errorLogin', function(error){
		showErrorLogin(error.message);
	});
	Chat.on('errorConnection', function(error){
		renderMessage(error);
		fieldMessage.disabled = true;
		sendBtn.disabled = true;
	});
	var ChatClient = Chat.createChat({
		ip: '127.0.0.1',
		port: '8888'
	});

	var showErrorLogin = function(errorMessage){
		var cont = document.getElementById('error-container');
		if(errorMessage)
			cont.innerHTML = chat.template.getHtml('errorLogin', {message: errorMessage});
		else
			cont.innerHTML = '';
	};

	var renderMessage = function(data){
		var html = null;
		if(data.fromUser === null)
			html = chat.template.getHtml('systemMessage', data);
		else if(data.fromUser){
			data.time = chat.template.formatTime(data.createTime);
			html = chat.template.getHtml('userMessage', data);
		}
		else{
			html = chat.template.getHtml('errorMessage', data);
		}

		if(html !== null)
			messageContainer.innerHTML = messageContainer.innerHTML + html;
		messageContainer.scrollTop = messageContainer.clientHeight;
	};

	document.getElementById('singin-btn').addEventListener("click", function(){
		ChatClient.singInUser(document.getElementById('username').value);
	});

	sendBtn.addEventListener("click", function(){
		ChatClient.sendMessage(fieldMessage.value);
		fieldMessage.value = '';
	});
};