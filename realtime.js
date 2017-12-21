module.exports = function (server, sessionMiddleware) {
	var io = require("socket.io")(server);
	var redis = require('redis');
	var redisClient = redis.createClient();
	io.use(function (socket, next) {
		sessionMiddleware(socket.request, socket.request.res, next);
	});
	redisClient.on("message", function (channel, message) {
		if (channel === "mensaje") {
			io.emit("new imagen", message);
		}
	});
	redisClient.subscribe("mensaje");


}