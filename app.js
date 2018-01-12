
var express = require("express");
var app = express();
//MODELOS
var User = require("./models/user").User;
var Mensaje = require("./models/mensaje").Mensaje;
var Amistad = require("./models/amistad").Amistad;

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
/*
app.use(formidable({
    encoding: 'utf-8',
    uploadDir: 'D:',
    multiples: false
}));
*/

app.set("view engine", "jade");
app.use(function (req, res, next) {
    Amistad.find({ emisor: req.session.user_id }).populate("receptor").populate("emisor").
        exec(function (err, amistades) {
            if (err)
                return handleError(err);
            res.locals.USER = req.session.user;
            res.locals.ID = req.session.user_id;
            res.locals.listFriends = amistades;
            next();
        });
    //{$ne: value}


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
    var id = req.session.user_id;
    req.session.user_id = undefined;
    req.session.user = undefined;
    User.findOne({ _id: id },
        function (err, doc) {
            if (doc) {
                doc.conected = "N";
                doc.date_desconected = new Date();
                doc.password_conf = doc.password;
                doc.save(
                    function (err) {
                        if (err) {
                            console.log(err)
                        } else {
                            res.redirect("/");
                        }
                    }
                );
            } else {
                res.redirect("/");
            }
        }
    );
});
app.post("/users", function (req, res) {
    var user = new User({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        password_conf: req.body.password_confirmation,
        conected: "S"
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
                doc.conected = "S";
                doc.password_conf = doc.password;
                doc.save(
                    function (err) {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            res.redirect("/");
                        }
                    }
                );
                // Load hash from your password DB.
            } else {
                res.redirect("/signup");
            }
        }
    );
});
app.use("/app", session_middleware);
app.use("/app", router_app);
server.listen(8080, "0.0.0.0");