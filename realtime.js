module.exports = function (server, sessionMiddleware) {
	var io = require("socket.io")(server);
	var redis = require('redis');
	var redisClient = redis.createClient();
	//Modelos
	var Mensaje = require("./models/mensaje").Mensaje;
	var User = require("./models/usuario").Usuario;
	var Amistad = require("./models/contacto").Contacto;
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
		if (myMap.get(socket.request.session.user_id) != undefined) {
			myMap.get(socket.request.session.user_id).push(socket.id)
		} else {
			myMap.set(socket.request.session.user_id, [socket.id])
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
							} else {
								socket.broadcast.emit("newclientconnect", doc._id);
							}
						}
					);
				}
			}
		);
		
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
								} else {
									socket.broadcast.emit("newclientdesconnect", JSON.stringify({ id: doc._id, date: doc.date_desconected }));
								}
							}
						);
					}
				}
			);
		});
		
		socket.on('nuevoMsg', function (data) {
			data = JSON.parse(data);
			var dataMensaje = {
				msg: data.msg,
				fechaEnvio: data.date,
				emisor: socket.request.session.user_id,
				amistad: data.idCont
			};
			var mensaje = new Mensaje(dataMensaje);
			mensaje.save(function (err) {
				if (!err) {
					var chats = myMap.get(data.to);
					io.sockets.connected[chats].emit("nuevoMsg", JSON.stringify(mensaje));
				} else {
					console.log(err)
				}
			});
		});

		socket.on("filterSearch", function (data) {
			var dataSplit = data.trim().split(" ");
			var querryDin = {};
			querryDin['$or'] = [];
			for (let index = 0; index < dataSplit.length; index++) {
				const element = dataSplit[index];
				querryDin["$or"].push({ nombres: { $regex: element.trim() } });
			}
			User.find({ $and: [{ _id: { $ne: socket.request.session.user_id } }, querryDin] },
				function (err, users) {
					var simpleUsers = [];
					users.forEach(element => {
						var simpleUser = { _id: element._id, apellidos: element.apellidos, nombres: element.nombres };
						simpleUsers.push(simpleUser)
					});
					io.sockets.connected[socket.id].emit("filterSearchResult", JSON.stringify(simpleUsers));
				}).limit(10);
		});
		socket.on("openChat", function (id_to) {
			Amistad.findById(id_to).populate("emisor").populate("receptor").exec(function (err, amis) {
				Mensaje.find({ amistad: id_to }).populate("emisor").exec(function (err, mensajes) {
					var userTo = (amis.emisor._id == socket.request.session.user_id ? amis.receptor : amis.emisor);
					var simpleMsgs = [];
					mensajes.forEach(element => {
						var simpleMsg = { _id: element._id, amistad: element.amistad, fechaEnvio: element.fechaEnvio, msg: element.msg, emisor: { _id: element.emisor._id } };
						simpleMsgs.push(simpleMsg);
					});
					if (mensajes) {
						userTo = { _id: userTo._id, apellidos: userTo.apellidos, nombres: userTo.nombres }
						var data = { _id: amis._id, userTo: userTo, msgs: simpleMsgs }
						io.sockets.connected[socket.id].emit("createChat", JSON.stringify(data));
					}
				});
			});
		});

	});
	redisClient.on("message", function (channel, message) {
		if (channel === "mensaje") {
			io.emit("new imagen", message);
		} else if (channel == "chat") {
			io.emit("chat message", message);
		} else if (channel == "updateChatStatus") {
			io.emit("updateChatStatus", message);
		}
	});
	redisClient.subscribe("mensaje");
	redisClient.subscribe("chat");
	redisClient.subscribe("updateChatStatus");

}