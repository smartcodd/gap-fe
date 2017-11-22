var express = require("express");


var app = express();
var User = require("./models/user").User;
var session = require("express-session");
var cookieSession = require("cookie-session");
var methodOverride = require("method-override");
var router_app = require("./rutas_app.js");
var session_middleware = require("./middlewares/session.js");

var bodyParcer = require("body-parser")
app.use("/docs", express.static("public"));
app.use(bodyParcer.json());
app.use(methodOverride("_method"));
app.use(bodyParcer.urlencoded({ extended: true }));
app.use(cookieSession({
    name: "session",
    keys: ["llave-1", "llave-2"]
}));

app.set("view engine", "jade");
app.get("/", function (req, res) {
    console.log(req.session.user_id);
    console.log(req.sessionID);
    res.render("index", { usuario: "Freddy" });
});
app.get("/login", function (req, res) {

    res.render("login");
});
app.get("/signup", function (req, res) {
    User.find(function (err, doc) {
        console.log(doc);
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
    console.log(user.password_conf)
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
            console.log(doc);
            console.log(req.session);
            console.log(err);
            if (doc) {
                req.session.user_id = doc._id;
                console.log(doc);
                console.log(req.session)
                res.redirect("/app");
            } else {
                res.redirect("/signup");
            }
        }
    );

});
app.use("/app", session_middleware);
app.use("/app", router_app);
app.listen(8080);