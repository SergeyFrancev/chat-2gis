/**
 * Created by hector on 08.10.15.
 */
var http = require('http');
var staticServer = require('node-static');
var fileServer = new staticServer.Server('.');
var WebSocketServer = require('ws');

var chat = require('./server/chat.js');

http.createServer(function(req, res){
	fileServer.serve(req, res);
}).listen(8080);

var webSocketServer = new WebSocketServer.Server({port: 8888});

webSocketServer.on('connection', function(ws){
	chat.connectUser(ws);
});