const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const usersCollection = new Schema({
  Nombres: { type: String, require: true },
  Apellidos: { type: String, require: true },
  Cedula: { type: String, require: true },
  Empresa: { type: String, require: true },
  Usuario: { type: String, require: true },
  TipoUsuario: { type: String, require: true },
  Role: [{ type: String, require: true }],
  email: { type: String, require: true },
  password: { type: String, require: true },
  date: { type: String, require: true },
  Empresa: { type: String, default:"" },
  
});


//encriptando contraseña

usersCollection.methods.encryptPassword = async (password) =>{
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
};


usersCollection.methods.comparePassword= function (password) {
  return bcrypt.compareSync(password, this.password); 
} 


module.exports = mongoose.model("usersCollection", usersCollection);