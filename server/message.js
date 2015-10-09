/**
 * Created by hector on 08.10.15.
 */
'use strict';
exports.createMessage = function (fromUser, message) {
	return {
		message: message,
		fromUser: fromUser,
		createTime: new Date()
	}
};

exports.createSystemMessage = function(message){
	return this.createMessage(null, message);
};