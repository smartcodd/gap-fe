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
			} else {
				accept("Debe autentificarse", false);
			}
		});
		if(myMap.get(socket.request.session.user_id)!=undefined){
			myMap.get(socket.request.session.user_id).push(socket.id)
		}else{
			myMap.set(socket.request.session.user_id,[socket.id])
		}
		User.findOne({ _id: socket.request.session.user_id },
			function (err, doc) {
				if (doc) {
					doc.conected = "S";
					doc.password_conf = doc.password;
					doc.save(
						function (err) {
							if (err) {
								console.log(err)
							}else{
								socket.broadcast.emit("newclientconnect", doc._id);
							}
						}
					);
				}
			}
		);
		//io.sockets.connected[socket.id].emit("greeting", "usermae");
		//socket.emit('newclientconnect', { description: 'Hey, welcome!' });
		socket.on('disconnect', function () {
			var index = myMap.get(socket.request.session.user_id).indexOf(socket.id);
			myMap.get(socket.request.session.user_id).splice(index, 1);
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
								}else{
									socket.broadcast.emit("newclientdesconnect", JSON.stringify({id:doc._id,date:doc.date_desconected}));
								}
							}
						);
					}
				}
			);
		});
		socket.on('newChat', function (data) {
			var id_user_to = data;
			User.findOne({ _id: id_user_to },
				function (err, doc) {
					if (doc) {
						doc.date_desconected = new Date();
						doc.conected = "N";
						doc.password_conf = doc.password;
						doc.save(
							function (err) {
								if (err) {
									console.log(err)
								} else {
									io.sockets.connected[socket.id].emit("newChat", "usermae");
								}
							}
						);
					}
				}
			);

		});
		socket.on('nuevoMsg', function (data) {
			data = JSON.parse(data);
			var dataMensaje = { msg: data.msg, fechaEnvio: new Date(), emisor: socket.request.session.user };
			var mensaje = new Mensaje(dataMensaje);
			mensaje.save(function (err) {
				if (!err) {
					socket.broadcast.emit("nuevoMsg", JSON.stringify(mensaje));
				} else {
					console.log(err)
				}
			});
		});


		redisClient.on("message", function (channel, message) {
			if (channel === "mensaje") {
				io.emit("new imagen", message);
			} else if (channel == "chat") {
				io.emit("chat message", message);
			}
		});
		redisClient.subscribe("mensaje");
		redisClient.subscribe("chat");
	});

}