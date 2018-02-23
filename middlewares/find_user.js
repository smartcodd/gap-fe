var Usuario = require("../models/usuario").Usuario;
module.exports=function(req,res,next){
    Usuario.findById(req.params.id, function (err, user) {
        if(user!=null){
            res.locals.user_show=user;
            next();
        }else{
            res.redirect("/app");
        }
    });
    
}