var Imagen = require("../models/imagenes").Imagen;

module.exports=function(image,req,res){
    if(typeof image.creator=="undefined"){
        return false;
    }
    if(req.method==="GET" && req.path.indexOf("edi")<0){
        return false;
    }
    if(image.creator._id.toString()===res.locals.ID.toString()){
        return true;
    }
    return false;
}