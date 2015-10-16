/**
 * Created by hector on 16.10.15.
 */
'use strict';
ChatApp = ChatApp || {};
(function(){
	var EventEmitter = function(){
		this.__eventsList = {};
	};
	EventEmitter.prototype = Object.create(Object.prototype);
	EventEmitter.constructor = EventEmitter;

	EventEmitter.prototype.on = function(eventName, callback){
		if(typeof this.__eventsList[eventName] == 'undefined')
			this.__eventsList[eventName] = [];
		this.__eventsList[eventName].push(callback);
	};

	EventEmitter.prototype.fire = function(){
		var eventName = arguments[0],
			args = [], i;
		if(typeof this.__eventsList[eventName] === 'undefined')
			return;

		for(i = 1; i < arguments.length; i++)
			args.push(arguments[i]);

		for(i = 0; i < this.__eventsList[eventName].length; i++)
			this.__eventsList[eventName][i].apply(this, args);
	};

	EventEmitter.prototype.dispatch = function(eventName){
		if(typeof this.__eventsList[eventName] !== 'undefined')
			delete this.__eventsList[eventName];
	};

	ChatApp.eventEmitter = EventEmitter;
})();
