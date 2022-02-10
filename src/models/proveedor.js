const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const proveedor = new Schema({
  Empresa: { type: String, require: true },
  Nombres: { type: String, require: true },
  Apellidos: { type: String, require: true },
  PaginaWeb: { type: String},
  Direccion: { type: String },
  CodigoPostal: { type: Number },
  Celular: { type: String, require: true },
  Telefono: { type: String},
  CodigoTelefono: { type: String},
  CodigoCeular: { type: String},
  email: { type: String},
});

module.exports = mongoose.model("Proveedor", proveedor);