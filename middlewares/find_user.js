var User = require("../models/user").User;
module.exports=function(req,res,next){
    User.findById(req.params.id, function (err, user) {
        if(user!=null){
            res.locals.user_show=user;
            next();
        }else{
            res.redirect("/app");
        }
    });
    
}