/**
 * Created by hector on 08.10.15.
 */
var chat = chat || {};
chat.template = (function(){
	'use strict';

	var templates = {
		userMessage: '<p style="display: flex">[{time}] - <b>{fromUser}:</b> {message}</p>',
		systemMessage: '<div class="text-center"><em>{message}</em></div>',
		errorMessage: '<div class="alert alert-danger text-center"><em>{message}</em></div>',
		user: '<div data-userid="{id}"><b>{username}</b></div>',
		errorLogin: '<div class="alert alert-danger" role="alert">{message}</div>'
	};

	return {
		getHtml: function(templateName, data){
			if(typeof templates[templateName] == 'undefined')
				return;

			var str = templates[templateName];
			for(var prop in data)
				str = str.replace(new RegExp('{'+prop+'}'), data[prop]);
			str = str.replace(/{.+}/, '');

			return str;
		},
		formatTime: function(dataTime){
			try{
				var DT = new Date(dataTime);
			}
			catch(e){
				return '';
			}

			var out = '';
			['getHours', 'getMinutes', 'getSeconds'].forEach(function(fn, index){
				if(index != 0)
					out += ':';
				var val = DT[fn]() + '';
				if(val.length < 2)
					val = '0'+val;
				out += val;
			});

			return out;
		}
	};
})();