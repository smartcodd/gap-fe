
var mongoose=require("mongoose");
var Schema= mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/gap");
var msg_schema= new Schema({
    msg:{type: String, require:true},
    ipOrigen:{type: String, require:false},
    emisor:{type:Schema.Types.ObjectId, ref:"User"},
    fechaEnvio:{type: Date, require:true}
});
var Mensaje=mongoose.model("Mensaje",msg_schema);
module.exports.Mensaje=Mensaje;