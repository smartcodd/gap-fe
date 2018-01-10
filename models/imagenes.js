
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
try {
    mongoose.connect("mongodb://localhost:27017/gap");
    var img_schema = new Schema({
        titulo: { type: String, require: true },
        creator: { type: Schema.Types.ObjectId, ref: "User" },
        extension: { type: String, require: true }
    });
    var Imagen = mongoose.model("Imagen", img_schema);
    module.exports.Imagen = Imagen;
} catch (error) {
    console.log(error);
}
