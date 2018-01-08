var Imagen = require("../models/imagenes").Imagen;
var check_user = require("./image_permission");
module.exports=function(req,res,next){
    Imagen.findById(req.params.id).populate("creator").exec( function (err, imagen) {
        if(imagen!=null && check_user(imagen,req,res)){
            res.locals.imagen=imagen;
            next();
        }else{
            res.redirect("/app");
        }
    });
    
}