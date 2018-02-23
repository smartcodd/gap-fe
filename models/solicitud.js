
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/gap");
var msg_scsolicitud_schemahema = new Schema({
    solicitante: { type: Schema.Types.ObjectId, ref: "Usuario" },
    usuario: { type: Schema.Types.ObjectId, ref: "Usuario" },
    fechaEnvio: { type: Date, require: true },
    status: String
});
var Solicitud = mongoose.model("Solicitud", solicitud_schema);
module.exports.Solicitud = Solicitud;