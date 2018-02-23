
var mongoose=require("mongoose");
var Schema= mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/gap");
var match_validacion=["^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$","Emial Incorrecto"]
var usuario_schema= new Schema({
    name:String,
    nombres:{type: String,required:true},
    apellidos:{type: String,required:true},
    password:{
        type: String,
        validate:{
            validator:function(p){
                return this.pass_c===p;
            },
            message:"Las contraseñas no coinciden"
        },
        minlength:5
    },
    age:{type:Number,min:[5,"El valor minimo es 5"],max:[100,"El valor máximo es 100"]},
    email:{type: String,required:"El correo es obligatorio"},
    date_of_birth:Date,
    sexo:{type:String,enum:{values:["Masculino","Femenino"],message:"El vaor no es correcto"}},
    conected:String,
    date_desconected:Date,
    tiempo_current:Number,
    profile_img: { data: String, contentType: String,name: String},
    countRequestFriends: Number
});
usuario_schema.virtual("password_conf").get(function(){
    return this.pass_c;
}).set(function(password){
    this.pass_c=password;
});
var Usuario=mongoose.model("Usuario",usuario_schema);
module.exports.Usuario=Usuario;