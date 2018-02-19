
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/gap");
var msg_schema = new Schema({
    emisor: { type: Schema.Types.ObjectId, ref: "User" },
    receptor: { type: Schema.Types.ObjectId, ref: "User" },
    fechaInicio: { type: Date },
    fechaEnvio: { type: Date, require: true },
    newMsg: Number,
    msgs: [{ type: Schema.Types.ObjectId, ref: 'Mensaje' }],
    status: String
});
var Amistad = mongoose.model("Amistad", msg_schema);
module.exports.Amistad = Amistad;