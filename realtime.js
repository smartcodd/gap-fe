module.exports = function (server, sessionMiddleware) {
	var io = require("socket.io")(server);
	var redis = require('redis');
	var redisClient = redis.createClient();
	var Mensaje = require("./models/mensaje").Mensaje;
	var User = require("./models/user").User;
	var userConected = [];
	var myMap = new Map();
	io.use(function (socket, next) {
		sessionMiddleware(socket.request, socket.request.res, next);
	});

	io.on('connection', function (socket) {
		io.set('authorization', function (data, accept) {
			if (data.session && data.session.user != undefined) {
				accept(null, true);
			}else{
				accept("Debe autentificarse", false);
			}
		});
		console.log(".....se conecta....");
		console.log(socket.request.session.id_user)
		console.log("Socket id:" + socket.id);
		console.log("Usuarios Conectados:");
		myMap.set(socket.id, socket.request.session.id_user);
		for (var [key, value] of myMap) {
			console.log(key + " = " + value)
		}
		//io.sockets.connected[socket.id].emit("greeting", "usermae");
		//socket.emit('newclientconnect', { description: 'Hey, welcome!' });
		socket.on('disconnect', function () {
			console.log(".....se desconecta....");
			console.log("Socket id:" + socket.id);
			console.log("Usuarios Conectados:");
			var eliminado=myMap.delete(socket.id);
			console.log(eliminado)
			for (var [key, value] of myMap) {
				console.log(key + " = " + value)
			}
			
		});

		socket.on('nuevoMsg', function (data) {
			data = JSON.parse(data);
			var dataMensaje = { msg: data.msg, fechaEnvio: new Date(), emisor: data.user_id };
			var mensaje = new Mensaje(dataMensaje);
			mensaje.save(function (err) {
				if (!err) {
					socket.broadcast.emit("nuevoMsg", JSON.stringify(mensaje));
				} else {
					console.log(err)
				}
			});
		});
		socket.on('login', function (msg) {
			users.push({
				id: socket.id,
				login: msg
			});
			console.log(users)
		});

		redisClient.on("message", function (channel, message) {
			if (channel === "mensaje") {
				io.emit("new imagen", message);
			} else if (channel == "chat") {
				io.emit("chat message", message);
			} else if (channel == "login") {
				var msg = {
					id_: message,
					id_socket: socket.id
				}
				io.emit("login", JSON.stringify(msg));
			}
		});
		redisClient.subscribe("mensaje");
		redisClient.subscribe("chat");
		redisClient.subscribe("login");
	});

}