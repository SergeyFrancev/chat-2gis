/**
 * Created by hector on 08.10.15.
 */
var http = require('http');
var staticServer = require('node-static');
var file = new staticServer.Server('.');
var WebSocketServer = new require('ws');
var chat = new require('./server/chat.js');
var url = require('url');
var querystring = require('querystring');

http.createServer(function(req, res){
	//var urlData = url.parse(req.url);
	if(req.method == 'POST'){
		parsePostBody(req, function(data){
			data = chat.addUser(data.username);
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(data));
			//res.close();
		});
	}else{
		file.serve(req, res);
	}
}).listen(8080);

var webSocketServer = new WebSocketServer.Server({port: 8888});

webSocketServer.on('connection', function(ws){
	chat.connectUser(ws);
});

var parsePostBody = function(req, callback){
	var queryData = "";
	if(typeof callback !== 'function') return null;

	req.on('data', function(data){
		queryData += data;
		if(queryData.length > 1e6){
			queryData = "";
			req.connection.destroy();
		}
	});

	req.on('end', function(){
		callback(querystring.parse(queryData));
	});
};