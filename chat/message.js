/**
 * Created by hector on 08.10.15.
 */
'use strict';
var _ = require('underscore');

/**
 * If valid data return message object else return false
 * @param fromUser string
 * @param message string
 * @returns {*}|false
 */
exports.createMessage = function (fromUser, message) {
	if(!_.isString(message) || message.length < 0)
		return false;

	return {
		message: message,
		fromUser: fromUser,
		createTime: new Date()
	}
};

exports.createSystemMessage = function(message){
	return this.createMessage(null, message);
};