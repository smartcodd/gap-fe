
var mongoose=require("mongoose");
var Schema= mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/gap");
var match_validacion=["^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$","Emial Incorrecto"]
var user_schema= new Schema({
    name:String,
    username:{type: String,minlength:5,required:true},
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
    date_desconected:Date    
});
user_schema.virtual("password_conf").get(function(){
    return this.pass_c;
}).set(function(password){
    this.pass_c=password;
});
var User=mongoose.model("User",user_schema);
module.exports.User=User;