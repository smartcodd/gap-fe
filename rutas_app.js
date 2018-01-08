var express = require("express");
var router = express.Router();
var Imagen = require("./models/imagenes").Imagen;
var Mensaje = require("./models/mensaje").Mensaje;
var User = require("./models/user").User;
var image_find_middleware = require("./middlewares/find_image");
var fs = require("fs");
var redis = require("redis");
var client = redis.createClient();
router.use(function (req, res, next) {
    Mensaje.find({}).populate("emisor").exec(function (err, mensajes) {
        res.locals.listMsg = mensajes;
        next();
    });
});
router.get("/", function (req, res) {
    Imagen.find({}).populate("creator").exec(function (err, imagenes) {
        if (err) {
            console.log(err);
        }
        res.render("app/home", { imagenes: imagenes });
    });
});
router.get("/imagenes/new", function (req, res) {
    res.render("app/imagenes/new")
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
        Imagen.find({ creator: res.locals.user._id }, function (err, imagenes) {
            if (err) {
                res.redirect("/app");
                return;
            } else {
                res.render("app/imagenes/index", { imagenes: imagenes });
            }
        });
    }).post(function (req, res) {
        var extension = req.files.archivo.name.split(".").pop();
        var data = { titulo: req.fields.title, creator: res.locals.user._id, extension: extension };
        var imagen = new Imagen(data);
        imagen.save(function (err) {
            if (!err) {
                var nombre = imagen._id + "." + req.files.archivo.name.split(".").pop();
                fs.rename(req.files.archivo.path, "public/imagenes/" + nombre)
                User.findById(imagen.creator, function (err, user) {
                    var imgJson = {
                        id: imagen._id,
                        titulo: imagen.titulo,
                        creator: user,
                        extension: imagen.extension
                    }
                    client.publish("mensaje", JSON.stringify(imgJson));
                });
                res.redirect("/app/imagenes/" + imagen._id)
            } else {
                res.render(err);
            }
        });
    });
module.exports = router;
