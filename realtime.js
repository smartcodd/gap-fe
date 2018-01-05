module.exports = function (server, sessionMiddleware) {
	var io = require("socket.io")(server);
	var redis = require('redis');
	var redisClient = redis.createClient();
	io.use(function (socket, next) {
		sessionMiddleware(socket.request, socket.request.res, next);
	});
	io.on('connection', function (socket) {
		console.log('a user connected');
		socket.on('disconnect', function () {
			console.log('user disconnected');
		});
		socket.on('chat message', function(msg){
			console.log('...2.-Recive el servidor y emite a todos excepto al emisor: ' + msg);
			io.emit('chat message', msg);
			socket.broadcast.emit('chat message',msg+" ... menos el emisor");
		});
		
			
		
	});
	redisClient.on("message", function (channel, message) {
		if (channel === "mensaje") {
			io.emit("new imagen", message);
		}else if(channel=="chat"){
			io.emit("chat message", message);
		}
	});
	redisClient.subscribe("mensaje");
	redisClient.subscribe("chat");


}