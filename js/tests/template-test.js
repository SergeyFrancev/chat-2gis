/**
 * Created by hector on 08.10.15.
 */
describe('Template', function(){
	var template = chat.template;

	describe('format time', function(){
		it('return not empty string', function(){
			var res = template.formatTime(new Date().getTime());
			assert.isString(res);
			assert.notEqual(res, '');
		});

		it('format time not throw', function(){
			assert.doesNotThrow(function(){
				var res = template.formatTime('')
			});
		});
	});

	describe('get html', function(){
		it('replace placeholder', function(){
			var res = template.getHtml('systemMessage', {message: 'test123'});
			assert.match(res, /test123/);
		});

		it('replace all placeholder', function(){
			var res = template.getHtml('systemMessage', {});
			assert.notMatch(res, /[{|}]/);
		});

		it('if template not exist return undefined', function(){
			var res = template.getHtml('systemMessage123', {});
			assert.isUndefined(res);
		});
	});
});