module.exports=function(req,res,next){
    if(!req.session.id_user){
        res.redirect("/login");
    }else{
        var User = require("../models/user").User;
        User.findById (req.session.user._id,
            function (err, doc) {
                if(err){
                    res.redirect("/login");
                }else{
                    res.locals.USER=doc;
                    next();
                }
            }
        );
        
    }
}