/**
 * Created by hector on 08.10.15.
 */
describe('Event emitter', function(){
	var Emitter = new ChatApp.eventEmitter(),
		testValue = 0;

	describe('Base methods', function(){
		it('bind event', function(){
			assert.isFunction(Emitter.on);
			assert.doesNotThrow(function(){
				Emitter.on('testAction', function(data){
					testValue++;
				});
			});
		});
		it('fire event', function(){
			Emitter.fire('testAction');
			assert.equal(testValue, 1);
		});
	});

	describe('Test extends function', function(){
		var TestObj = function(){
			ChatApp.eventEmitter.apply(this, arguments);
		};
		TestObj.prototype = Object.create(ChatApp.eventEmitter.prototype);
		TestObj.constructor = TestObj;

		TestObj.prototype.testMethod = function(){
			this.fire('testAction');
		};
		var t = new TestObj();
		var tmp = 0;

		it('extend fire', function(){
			var oldValue = testValue;
			assert.isFunction(t.on);
			assert.isFunction(t.fire);
			t.on('testAction', function(){
				testValue++;
				tmp = 1;
			});
			t.testMethod();
			assert.equal(testValue, oldValue + 1);
		});

		it('extend fire parent call', function(){
			t.testMethod();
			assert.equal(tmp, 1);
		});
	});
});