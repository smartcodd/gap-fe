module.exports = function (server, sessionMiddleware) {
	var io = require("socket.io")(server);
	var redis = require('redis');
	var redisClient = redis.createClient();
	//Modelos
	var Mensaje = require("./models/mensaje").Mensaje;
	var User = require("./models/user").User;
	var Amistad = require("./models/amistad").Amistad;


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
								} else {
									socket.broadcast.emit("newclientdesconnect", JSON.stringify({ id: doc._id, date: doc.date_desconected }));
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
			var dataMensaje = {
				msg: data.msg,
				fechaEnvio: new Date(),
				emisor: socket.request.session.user_id,
				amistad: data.amigo
			};
			var mensaje = new Mensaje(dataMensaje);
			mensaje.save(function (err) {
				if (!err) {
					var chats = myMap.get(data.to);
					console.log(chats)
					socket.broadcast.emit("nuevoMsg", JSON.stringify(mensaje));
				} else {
					console.log(err)
				}
			});
		});

		socket.on("filterSearch", function (data) {
			var dataSplit = data.trim().split(" ");
			var querryDin = {}; // declare the query object
			querryDin['$or'] = []; // filter the search by any criteria given by the user
			for (let index = 0; index < dataSplit.length; index++) {
				const element = dataSplit[index];
				querryDin["$or"].push({ nombres: { $regex: element.trim() } });
			}
			User.find({ $and: [{ _id: { $ne: socket.request.session.user_id } }, querryDin] },
				function (err, users) {
					io.sockets.connected[socket.id].emit("filterSearchResult", JSON.stringify(users));
				}).limit(10);
		});
		socket.on("openChat", function (id_to) {
			if (socket.request.session.user_id && id_to) {
				if (!socket.request.session.user_id || !id_to) {
					res.redirect("/login");
				} else {
					Amistad.findOne(
						{
							$and: [
								{ $or: [{ emisor: socket.request.session.user_id }, { receptor: socket.request.session.user_id }] },
								{ $or: [{ emisor: id_to }, { receptor: id_to }] }
							]
						}
					).populate("receptor").populate("emisor").
						exec(function (err, amistades) {
							
							if (err)
								console.log(err);
							else {
								Mensaje.find({ amistad: amistades._id }).populate("emisor").exec(function (err, mensajes) {
									if (mensajes) {
										var userTo;
										if (amistades.emisor._id != socket.request.session.user_id) {
											userTo = amistades.emisor;
										} else if (amistades.receptor._id != socket.request.session.user_id) {
											userTo = amistades.receptor;
										}
										var msgs = mensajes;
										var data = { userTo: userTo, msgs: msgs, _id: amistades._id, tiene_ms: mensajes.length > 0 ? "S" : "N" }
										
										io.sockets.connected[socket.id].emit("createChat", JSON.stringify(data));
									}
								});

							}
						});
				}
			}
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