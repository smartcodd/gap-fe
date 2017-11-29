var Imagen = require("../models/imagenes").Imagen;
var check_user = require("./image_permission");

module.exports=function(req,res,next){
    console.log("..............")
    Imagen.findById(req.params.id).populate("creator").exec( function (err, imagen) {
        if(imagen!=null && check_user(imagen,req,res)){
            console.log("1")
            res.locals.imagen=imagen;
            next();
        }else{
            console.log("2")
            res.redirect("/app");
        }
    });
}