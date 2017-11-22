var express = require("express");
var router = express.Router();
var Imagen = require("./models/imagenes").Imagen;
router.get("/", function (req, res) {
    res.render("app/home");
});

router.get("/imagenes/new", function (req, res) {
    res.render("app/imagenes/new")
});
router.get("/imaganes/:id/edit", function (req, res) {
    Imagen.findById(req.params.id, function (err, imagen) {
        if (!err) {
            res.render("app/imagenes/edit", { imagen: imagen })
        }
    });
    
});
router.route("/imagenes/:id").get(
    function (req, res) {
        Imagen.findById(req.params.id, function (err, img) {
            if (!err) {
                res.render("app/imagenes/show", { imagen: img });
            }
        });

    }).put(function (req, res) {
        Imagen.findById(req.params.id, function (err, img) {
            if (!err) {
                img.titulo=req.body.title ;
                img.save(
                    function(err){
                        if(!err){
                            res.render("app/imagenes/show", { imagen: img });
                        }
                    }
                );
                
            }
        });
    }).delete(function (req, res) {
        Imagen.findByIdAndRemove({_id:req.params.id},function(err){
            if(!err){
                res.redirect("/app/imagenes");
            }else{
                console.log(err);
                res.redirect("/app/imagenes/"+req.params.id);
            }
        });
    });
router.route("/imagenes").get(
    function (req, res) {
        Imagen.find({}, function (err, imagenes) {
            if (err) {
                res.redirect("/app");
                return;
            } else {
                res.render("app/imagenes/index", { imagenes: imagenes });
            }
        });
    }).post(function (req, res) {
        var data = { titulo: req.body.title };
        var imagen = new Imagen(data);
        imagen.save(function (err) {
            if (!err) {
                res.redirect("/app/imagenes/" + imagen._id)
            } else {
                res.render(err);
            }
        });
    });
module.exports = router;
