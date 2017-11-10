var express = require("express");
var router = express.Router();
var Imagen = require("./models/imagenes").Imagen;
router.get("/", function (req, res) {
    res.render("app/home");
});

router.get("/imagenes/new",function(req,res){
    res.render("app/imagenes/new")
});
router.route("/imagenes/:id").get(
    function (req, res) {
        Imagen.findById(req.params.id,function(err,img){
           console.log("Imagen Lectura");
            console.log(img);
            if(err){

            }else{
                res.render("app/imagenes/show",{imagen:img});
            }
        });
        
     }).put(function (req, res) { 

     }).delete(function (req, res) { 

     });
router.route("/imagenes").get(
    function (req, res) {
    }).post(function (req, res) { 
        var data={titulo:req.body.title};
        var imagen= new Imagen(data);
        console.log(imagen)
        imagen.save(function(err){
            if(!err){
                res.redirect("/app/imagenes/"+imagen._id)
            }else{
                res.render(err);
            }
        });
    });
module.exports = router;
