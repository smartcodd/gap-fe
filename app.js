
var express = require("express");
var app = express();
var User = require("./models/user").User;
var Mensaje = require("./models/mensaje").Mensaje;
var session = require("express-session");
var cookieSession = require("cookie-session");
var expressSession = require("express-session");
var methodOverride = require("method-override");

var session_middleware = require("./middlewares/session.js");
var bodyParcer = require("body-parser")
var formidable = require("express-formidable");
var RedisStore = require("connect-redis")(expressSession);
var realtime = require("./realtime.js");
var http = require("http");
var server = http.Server(app);
var router_app = require("./rutas_app.js");
var bcrypt = require('bcrypt');
var BCRYPT_SALT_ROUNDS = 12;
var sessionMiddleware = expressSession({
    store: new RedisStore({}),
    secret: "mi clave secreta"
});
var redis = require("redis");
var client = redis.createClient();

realtime(server, sessionMiddleware);
app.use("/docs", express.static("public"));
app.use(bodyParcer.json());
app.use(methodOverride("_method"));
app.use(bodyParcer.urlencoded({ extended: true }));

app.use(sessionMiddleware);

app.use(formidable({
    encoding: 'utf-8',
    uploadDir: 'F:',
    multiples: false
}));

app.set("view engine", "jade");

app.use(function (req, res, next) {

    User.find({}, function (err, users) {
        res.locals.ID = req.session.user_id;
        res.locals.listUsers = users;
        Mensaje.find({}).populate("emisor").exec(function (err, mensajes) {
            res.locals.listMsg = mensajes;
            console.log(mensajes)
            //Metodo que elimina los msg
            /*
            mensajes.forEach(function (element) {
                console.log(element);
                Mensaje.findByIdAndRemove({ _id: element._id }, function (err) {
                    console.log("eliminado...")
                });
            });
            */
            next();
        });

    });

});
app.get("/", function (req, res) {
    res.render("index");
});
app.get("/login", function (req, res) {
    res.render("login");
});
app.get("/signup", function (req, res) {
    User.find(function (err, doc) {
        res.render("signup");
    });
});
app.get("/logout", function (req, res) {
    User.findOne({ _id: req.session.user_id },
        function (err, doc) {
            console.log(doc)
            if (doc) {
                doc.conected = "N";
                doc.password_conf = doc.password;
                doc.save(
                    function (err) {
                        if (err)
                            console.log(err)
                    }
                );
            } else {
                res.redirect("/signup");
            }
        }
    );

    req.session.user_id = "";
    res.render("index");
});
app.post("/users", function (req, res) {
    bcrypt.genSalt(BCRYPT_SALT_ROUNDS, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            var user = new User({
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
                password_conf: req.body.password_confirmation,
                hashedPassword: hash,
                conected: "S"
            });
            user.save(function (err) {
                if (err) {
                    res.send(String(err));
                } else {
                    req.session.user_id = user._id;
                    res.render("index");
                }
            });
        });
    });


});
app.post("/sessions", function (req, res) {
    User.findOne({ email: req.body.email, password: req.body.password },
        function (err, doc) {
            if (doc) {
                // Load hash from your password DB.
                bcrypt.compare(req.body.password, doc.hashedPassword, function (err, resp) {
                    if (err) {
                        res.redirect("/signup");
                    } else if (resp) {
                        req.session.user_id = doc._id;
                        doc.conected = "S";
                        doc.password_conf = doc.password;
                        doc.save(
                            function (err) {
                                if (err)
                                    console.log(err)
                            }
                        );
                        res.redirect("/app");
                    } else {
                        res.redirect("/signup");
                    }

                });
            } else {
                res.redirect("/signup");
            }
        }
    );
});
app.use("/app", session_middleware);
app.use("/app", router_app);
server.listen(8080, "0.0.0.0");