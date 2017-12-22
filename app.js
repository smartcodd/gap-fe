var express = require("express");
var app = express();
var User = require("./models/user").User;
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
var redis = require("redis");
var client = redis.createClient();

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
app.get("/", function (req, res) {
    res.render("index", { usuario: "Freddy" });
});
app.get("/login", function (req, res) {
    res.render("login");
});
app.post("/chat",function (req, res) {
    client.publish("chat", req.body.chatm);
    res.render("index");
});
app.get("/signup", function (req, res) {
    User.find(function (err, doc) {
        res.render("signup");
    });

});
app.post("/users", function (req, res) {
    var user = new User({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        password_conf: req.body.password_confirmation,
    });
    user.save(function (err) {
        if (err) {
            res.send(String(err));
        } else {
            res.send("Recivimos tus datos...");
        }
    });


});
app.post("/sessions", function (req, res) {
    User.findOne({ email: req.body.email, password: req.body.password },
        function (err, doc) {
            if (doc) {
                req.session.user_id = doc._id;
                res.redirect("/app");
            } else {
                res.redirect("/signup");
            }
        }
    );

});
app.use("/app", session_middleware);
app.use("/app", router_app);
app.use("/chat", router_app);
server.listen(8080);