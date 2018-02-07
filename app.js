//FILES
const fileUpload = require('express-fileupload');

var express = require("express");
var app = express();

app.use(fileUpload());

//SOCKET IO
var redis = require("redis");
var client = redis.createClient();
//MODELOS
var User = require("./models/user").User;
var Mensaje = require("./models/mensaje").Mensaje;
var Amistad = require("./models/amistad").Amistad;
var Imagen = require("./models/imagenes").Imagen;

var session = require("express-session");
var cookieSession = require("cookie-session");
var expressSession = require("express-session");
var methodOverride = require("method-override");
var session_middleware = require("./middlewares/session.js");
var bodyParcer = require("body-parser")
var RedisStore = require("connect-redis")(expressSession);
var realtime = require("./realtime.js");
var http = require("http");
var server = http.Server(app);
var router_app = require("./rutas_app.js");
var sessionMiddleware = expressSession({
    store: new RedisStore({}),
    secret: "mi clave secreta"
});

realtime(server, sessionMiddleware);
app.use("/docs", express.static("public"));
app.use(bodyParcer.json());
app.use(methodOverride("_method"));
app.use(bodyParcer.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.set("view engine", "jade");
app.use("/app", session_middleware);
app.use("/app", router_app);
app.use(function (req, res, next) {
    /*User.find({ _id: { $ne: req.session.user_id } },
        function (err, doc) {
            doc.forEach(element => {
                var amistad = {
                    emisor: req.session.user_id,
                    receptor: element._id,
                    fechaInicio: new Date()
                };
                var amis = new Amistad(amistad);
                amis.save(function (err) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("creado.........")
                    }
                });

            });
        });*/
    if (req.session.user_id) {
        res.locals.USER = req.session.user;
        res.locals.ID = req.session.user_id;
    }
    Imagen.find({ tipo: "C" }).populate("creator").exec(function (err, imagenes) {
        console.log(imagenes)
        res.locals.listCarousel = imagenes;
        if (err) {
            console.log(err);
        }
        next();
    });
});

app.get("/", function (req, res) {
    res.render("index");
});
app.get("/login", function (req, res) {
    res.render("login");
});
app.get("/signup", function (req, res) {
    res.render("signup");
});
app.get("/logout", function (req, res) {
    req.session.user_id = undefined;
    req.session.user = undefined;
    res.redirect("/");
});
app.post("/register", function (req, res) {

    var user = new User({
        email: req.body.email,
        password: req.body.password,
        nickname: req.body.nickname,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        password_conf: req.body.password_confirmation,
        conected: "S",
        date_of_birth: req.body.fechaNacimiento
    });
    User.findOne({ email: req.body.email, password: req.body.password },
        function (err, doc) {
            if (doc) {
                res.render("index");
            } else {
                user.save(function (err) {
                    if (err) {
                        res.send(String(err));
                    } else {
                        req.session.user = user;
                        req.session.user_id = user._id;
                        res.render("index");
                    }
                });
            }
        }
    );
});
app.post("/sessions", function (req, res) {
    User.findOne({ email: req.body.email, password: req.body.password },
        function (err, doc) {
            if (doc) {
                req.session.user = doc;
                req.session.user_id = doc._id;
                res.redirect("/app");
            } else {
                res.redirect("/signup");
            }
        }
    );
});
server.listen(8080, "0.0.0.0");