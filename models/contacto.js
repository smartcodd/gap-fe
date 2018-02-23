
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/gap");
var msg_contacto = new Schema({
    emisor: { type: Schema.Types.ObjectId, ref: "Usuario" },
    receptor: { type: Schema.Types.ObjectId, ref: "Usuario" },
    fechaInicio: { type: Date },
    fechaEnvio: { type: Date, require: true },
    newMsg: Number,
    msgs: [{ type: Schema.Types.ObjectId, ref: "Mensaje" }],
    status: String
});
var Contacto = mongoose.model("Contacto", msg_contacto);
module.exports.Contacto = Contacto;