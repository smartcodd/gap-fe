module.exports=function(req,res,next){
    if(!req.session.user_id){
        res.redirect("/login");
    }else{
        var User = require("../models/user").User;
        User.findById (req.session.user_id,
            function (err, doc) {
                if(err){
                    res.redirect("/login");
                }else{
                    res.locals={user:doc};
                    next();
                }
            }
        );
        
    }
}