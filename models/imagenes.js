
var mongoose=require("mongoose");
var Schema= mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/gap");
var img_schema= new Schema({
    titulo:{type: String, require:true}
    
});
var Imagen=mongoose.model("Imagen",img_schema);
module.exports.Imagen=Imagen;