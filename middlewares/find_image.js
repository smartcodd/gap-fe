var Imagen = require("../models/imagenes").Imagen;

module.exports=function(req,res,next){
    Imagen.findById(req.params.id, function (err, imagen) {
        if(imagen!=null){
            console.log("Encontre iamen: "+imagen.titulo);
            res.locals.imagen=imagen;
            next();
        }else{
            res.redirect("/app");
        }
    });
}