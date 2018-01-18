
var express = require("express");
var app = express();

//SOCKET IO
var redis = require("redis");
var client = redis.createClient();
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
app.use("/app", session_middleware);
app.use("/app", router_app);
app.use(function (req, res, next) {
    if (req.session.user_id) {
        res.locals.USER = req.session.user;
        res.locals.ID = req.session.user_id;
    }
    next();
});
app.use(function (req, res, next) {
    console.log("login.........")
    if (req.session.user_id) {
        if (!req.session.user_id) {
            res.redirect("/login");
        } else {
            res.locals.USER = req.session.user;
            res.locals.ID = req.session.user_id;
            Amistad.find({ $or: [{ emisor: req.session.user_id }, { receptor: req.session.user_id }] }).populate("receptor").populate("emisor").
                exec(function (err, amistades) {
                    if (err)
                        console.log(err);
                    res.locals.listFriends = amistades;
                    next();
                });
        }
    }else{
        next();
    }
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
                res.redirect("/");
            } else {
                res.redirect("/signup");
            }
        }
    );
});
server.listen(8080, "0.0.0.0");