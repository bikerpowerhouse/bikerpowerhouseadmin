const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const vendedores = new Schema({
  Nombres: { type: String, require: true },
  Apellidos: { type: String, require: true },
  Cedula: { type: String, require: true },
  Zona: { type: String, require: true },
  Celular: { type: String, require: true },
  CodigoCeular: { type: String, require: true },
  Usuario: { type: String, require: true },
  Direccion: { type: String, require: true },
  Porcentaje: { type: Number, require: true },
  Telefono: { type: Number }, 
  email: { type: String, require: true }, 
  CodigoPostal: { type: Number, require: true },
  SaldoEnPosesion : {type: Number, default: 0}

});

module.exports = mongoose.model("vendedores", vendedores);
