window.onload = function(){
	'use strict';
	var messageContainer = document.getElementById('messages-container'),
		userContainer = document.getElementById('user-container'),
		fieldMessage = document.getElementById('input'),
		sendBtn = document.getElementById('send'),
		userName = document.getElementById('username'),
		singInBtn = document.getElementById('singin-btn'),
		isAuth = false;

	var Chat = new ChatApp.chatClient();
	Chat.on('startChat', function(data){
		isAuth = true;
		var messageList = data.messages,
			chatCont = document.getElementById('chat-container'),
			singInCont = document.getElementById('singin-container');

		chatCont.classList.remove("hide");
		singInCont.classList.add("hide");

		//Render messages
		while(messageList.length > 0)
			renderMessage(messageList.shift());

		//Hide error login message
		showErrorLogin(false);
		userName.value = '';
	});
	Chat.on('newMessage', function(data){
		renderMessage(data);
	});
	Chat.on('updateUserList', function(userList){
		userContainer.innerHTML = '';
		for(var i = 0; i < userList.length; i++)
			userContainer.innerHTML = userContainer.innerHTML + ChatApp.template.getHtml('user', userList[i]);
	});

	//Chat.on('errorLogin', function(error){
	//	showErrorLogin(error.message);
	//});

	//Call after socket close connection
	Chat.on('error', function(error){
		if(isAuth)
			renderMessage(error);
		else
			showErrorLogin(error.message);

		if(error.type == 'connection')
		{
			fieldMessage.disabled = true;
			sendBtn.disabled = true;
			singInBtn.disabled = true;
			userName.disabled = true;
		}
	});

	var showErrorLogin = function(errorMessage){
		var errCont = document.getElementById('error-container');
		if(errorMessage)
			errCont.innerHTML = ChatApp.template.getHtml('errorLogin', {message: errorMessage});
		else
			errCont.innerHTML = '';
	};

	//Render message in chat window
	var renderMessage = function(data){
		var html = null;
		if(data.fromUser === null)
			html = ChatApp.template.getHtml('systemMessage', data);
		else if(data.fromUser){
			data.time = ChatApp.template.formatTime(data.createTime);
			html = ChatApp.template.getHtml('userMessage', data);
		}
		else{
			html = ChatApp.template.getHtml('errorMessage', data);
		}

		if(html !== null){
			messageContainer.innerHTML = messageContainer.innerHTML + html;
			messageContainer.scrollTop = messageContainer.clientHeight;
		}
	};

	Chat.connect('127.0.0.1', '8888');

	singInBtn.addEventListener("click", function(){
		Chat.singInUser(userName.value);
	});

	sendBtn.addEventListener("click", function(){
		Chat.sendMessage(fieldMessage.value);
		fieldMessage.value = '';
	});
};