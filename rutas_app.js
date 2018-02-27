var express = require("express");
var router = express.Router();
var Imagen = require("./models/imagen").Imagen;
var Mensaje = require("./models/mensaje").Mensaje;
var Amistad = require("./models/contacto").Contacto;
var User = require("./models/usuario").Usuario;
var image_find_middleware = require("./middlewares/find_image");
var user_find_middleware = require("./middlewares/find_user");
var fs = require("fs");
var redis = require("redis");
var client = redis.createClient();
var cronjob = require('cron-job');
var job = function (options) {//only one parameters 
    if (options.event === "loadUser") {
        User.find({ conected: "N" }, function (err, users) {
            users.forEach(function (element) {
                var tiempoActual = new Date();
                if (element.date_desconected) {
                    element.tiempo_current = tiempoActual.getTime() - element.date_desconected.getTime();
                }
                client.publish("updateChatStatus", JSON.stringify(element));
            });
        });
    }
};

//do it after 5s,and do it every 3s 
var first_time = cronjob.date_util.getNowTimestamp();//timestamp,unit is seconds 
var timegap = 10;//seconds 
var options = {//method's parameters 
    event: 'loadUser'
};
cronjob.startJobEveryTimegap(first_time + 5, timegap, job, options);

router.use(function (req, res, next) {
    if (req.session.user_id != undefined) {
        if (!req.session.user_id) {
            res.redirect("/login");
        } else {
            res.locals.USER = req.session.user;
            res.locals.ID = req.session.user_id;
            Amistad.find({ $and: [{ $or: [{ emisor: req.session.user_id }, { receptor: req.session.user_id }] }, { status: "ACEPTADO" }] }).populate("receptor").populate("emisor").
                exec(function (err, amistades) {
                    if (err)
                        console.log(err);
                    var simpleAmistades = [];
                    amistades.forEach(element => {
                        var simpleAmistad = {
                            _id: element._id,
                            emisor: {
                                _id: element.emisor._id,
                                nombres: element.emisor.nombres,
                                apellidos: element.emisor.apellidos,
                                conected: element.emisor.conected,
                                date_desconected: element.emisor.date_desconected,
                            },
                            receptor: {
                                _id: element.receptor._id,
                                nombres: element.receptor.nombres,
                                apellidos: element.receptor.apellidos,
                                conected: element.receptor.conected,
                                date_desconected: element.receptor.date_desconected,
                            },
                            fechaInicio: element.fechaInicio,
                            fechaEnvio: element.fechaEnvio,
                            newMsg: element.newMsg,
                            status: String
                        };
                        simpleAmistades.push(simpleAmistad);
                    });
                    res.locals.listFriends = simpleAmistades;
                    Amistad.find({ $and: [{ receptor: req.session.user_id }, { status: "SOLICITADO" }] }).populate("emisor").
                        exec(function (err, solicitudes) {
                            if (err)
                                console.log(err);
                            res.locals.listSolicitudes = solicitudes;
                            next();
                        });
                });
        }
    } else {
        res.redirect("/login");
    }
    //{$ne: value}
    /*
    User.find({}, function (err, users) {
        res.locals.USER = req.session.user;
        res.locals.ID =req.session.user_id;
        res.locals.listUsers = users;
        Mensaje.find({}).populate("emisor").exec(function (err, mensajes) {
            res.locals.listMsg = mensajes;
            //Metodo que elimina los msg
           
            mensajes.forEach(function (element) {
                console.log(element);
                Mensaje.findByIdAndRemove({ _id: element._id }, function (err) {
                    console.log("eliminado...")
                });
            });
          
            next();
        });

    });*/
});
router.get("/", function (req, res) {
    Imagen.find({ tipo: "U" }).populate("creator").exec(function (err, imagenes) {
        if (err) {
            console.log(err);
        }
        res.render("app/home", { imagenes: imagenes });
    });

});
router.get("/imagenes/new", function (req, res) {
    res.render("app/imagenes/new")
});

router.get("/imagenes/new_carousel", function (req, res) {
    res.render("app/imagenes/new_carousel")
});
router.all("/imagenes/:id*", image_find_middleware);
router.get("/imagenes/:id/edit", function (req, res) {
    res.render("app/imagenes/edit");
});
router.route("/imagenes/:id").get(
    function (req, res) {
        client.publish("mensaje", imagen.toString())
        res.render("app/imagenes/show");
    }).put(function (req, res) {
        res.locals.imagen.titulo = req.body.title;
        res.locals.imagen.save(
            function (err) {
                if (!err) {
                    res.render("app/imagenes/show");
                } else {
                    res.render("app/imagenes/" + req.params.id + "/edit");
                }
            }
        );
    }).delete(function (req, res) {
        Imagen.findByIdAndRemove({ _id: res.locals.imagen._id }, function (err) {
            if (!err) {
                res.redirect("/app/imagenes");
            } else {
                res.redirect("/app/imagenes/" + req.params.id);
            }
        });
    });




router.route("/imagenes").get(
    function (req, res) {
        Imagen.find({ creator: res.locals.USER._id, tipo: "U" }, function (err, imagenes) {
            if (err) {
                res.redirect("/app");
                return;
            } else {

                res.render("app/imagenes/index", { imagenes: imagenes });
            }
        });
    }).post(function (req, res) {
        let fileArchivo = req.files.archivo;
        var extension = req.files.archivo.name.split(".").pop();
        var data = { titulo: req.body.title, creator: req.session.user_id, extension: extension, tipo: "U" };
        var imagen = new Imagen(data);
        imagen.save(function (err) {
            if (!err) {
                var nombre = imagen._id + "." + req.files.archivo.name.split(".").pop();
                fileArchivo.mv("public/imagenes/" + nombre, function (err) {
                    if (err)
                        return res.status(500).send(err);
                    else
                        User.findById(imagen.creator, function (err, user) {
                            var imgJson = {
                                id: imagen._id,
                                titulo: imagen.titulo,
                                creator: user,
                                extension: imagen.extension,
                                tipo: imagen.tipo
                            }
                            client.publish("mensaje", JSON.stringify(imgJson));
                            res.redirect("/app/imagenes/" + imagen._id)
                        });
                });
            } else {
                res.render(err);
            }
        });
    });
router.route("/carousel").get(
    function (req, res) {
        Imagen.find({ creator: res.locals.USER._id }, function (err, imagenes) {
            if (err) {
                res.redirect("/app");
                return;
            } else {

                res.render("app/imagenes/index", { imagenes: imagenes });
            }
        });
    }).post(function (req, res) {
        let fileArchivo = req.files.archivo;
        var extension = req.files.archivo.name.split(".").pop();
        var data = { titulo: req.body.title, creator: req.session.user_id, extension: extension, tipo: "C" };
        var imagen = new Imagen(data);
        imagen.save(function (err) {
            if (!err) {
                var nombre = imagen._id + "." + req.files.archivo.name.split(".").pop();
                fileArchivo.mv("public/imagenes/" + nombre, function (err) {
                    if (err)
                        return res.status(500).send(err);
                    else
                        User.findById(imagen.creator, function (err, user) {
                            var imgJson = {
                                id: imagen._id,
                                titulo: imagen.titulo,
                                creator: user,
                                extension: imagen.extension,
                                tipo: imagen.tipo
                            }
                            res.redirect("/app/carousel/" + imagen._id)
                        });
                });
            } else {
                res.render(err);
            }
        });
    });

router.all("/user/:id*", user_find_middleware);
router.get("/user/:id", function (req, res) {
    res.render("app/usuario/user_show");
});
router.get("/user/:id/view_sol", function (req, res) {
    res.render("app/usuario/user_show", { isAcept: true })
});

router.get("/user/:id/acept", function (req, res) {
    Amistad.findOne({ $and: [{ emisor: res.locals.user_show._id }, { receptor: req.session.user_id }, { status: "SOLICITADO" }] }, function (err, amistad) {
        amistad.status = "ACEPTADO";
        amistad.save(function (err) {
            if (err) {
                console.log(err);
                res.redirect("/app");
            } else {
                User.findById(req.session.user_id, function (err, user) {
                    if (err) {
                        console.log(err);
                    } else {
                        user.password_conf = user.password;
                        user.countRequestFriends = user.countRequestFriends - 1;
                        user.save(function (err) { if (err) { console.log(err) } });
                        res.locals.USER = user;
                    }
                    res.redirect("/app");
                });
            }
        });
    });
});

router.get("/user/:id/contact", function (req, res) {

    Amistad.findOne({ $and: [{ $or: [{ emisor: res.locals.user_show._id }, { receptor: res.locals.user_show._id }] }, { $or: [{ emisor: req.session.user_id }, { receptor: req.session.user_id }] }] }, function (err, amistad) {
        if (err)
            console.log(err)
        if (amistad) {
            res.redirect("/app");
        } else {
            var amistad = {
                emisor: req.session.user_id,
                receptor: res.locals.user_show._id,
                fechaEnvio: new Date(),
                status: "SOLICITADO"
            };
            var amis = new Amistad(amistad);
            amis.save(function (err) {
                if (err) {
                    console.log(err);
                    res.redirect("/app");
                } else {
                    User.findById(res.locals.user_show._id, function (err, user) {
                        if (err) {
                            console.log(err);
                        } else {
                            user.password_conf = user.password;
                            user.countRequestFriends = user.countRequestFriends + 1;
                            user.save(function (err) { if (err) { console.log(err) } });
                        }
                        res.redirect("/app");
                    });
                }
            });
        }
    });
});
module.exports = router;
