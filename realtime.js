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
		console.log("...conectado");
		io.set('authorization', function (data, accept) {
			if (data.session && data.session.user != undefined) {
				accept(null, true);
			} else {
				accept("Debe autentificarse", false);
			}
		});
		User.findOne({ _id: socket.request.session.user_id },
			function (err, doc) {
				if (doc) {
					doc.conected = "S";
					doc.password_conf = doc.password;
					doc.save(
						function (err) {
							if (err) {
								console.log(err)
							}
						}
					);
				}
			}
		);
		//io.sockets.connected[socket.id].emit("greeting", "usermae");
		//socket.emit('newclientconnect', { description: 'Hey, welcome!' });
		socket.on('disconnect', function () {
			User.findOne({ _id: socket.request.session.user_id },
				function (err, doc) {
					if (doc) {
						doc.date_desconected = new Date();
						doc.conected = "N";
						doc.password_conf = doc.password;
						doc.save(
							function (err) {
								if (err) {
									console.log(err)
								}
							}
						);
					}
				}
			);
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