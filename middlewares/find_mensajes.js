var Mensaje = require("../models/mensaje").Mensaje;
module.exports=function(req,res,next){
    Mensaje.find({}).populate("emisor").exec(function (err, mensajes) {
        next();
    });
}