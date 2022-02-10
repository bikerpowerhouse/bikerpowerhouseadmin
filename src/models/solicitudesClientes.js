const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const SolicitudesClientes = new Schema({
  Fecha: { type: String, require: true },
  Nombres: { type: String, require: true },
  Apellidos: { type: String, require: true },
  Cedula: { type: String, require: true },
  Empresa: { type: String, require: true },
  RIF: { type: String, require: true },
  Direccion: { type: String, require: true },
  Celular: { type: Number, require: true },
  CodigoCeular: { type: Number, require: true },
  MaximoCredito: { type: Number, require: true },
  CodigoTelefono: { type: Number}, 
  Telefono: { type: Number}, 
  email: { type: String, require: true }, 
  Zona: { type: String, require: true },
  CodigoPostal: { type: Number, require: true },
  Vendedor: { type: String, require: true },
  SaldoFavor: { type: Number, default: 0 },
  _idVendedor: { type: String, require: true },
});

module.exports = mongoose.model("SolicitudesClientes", SolicitudesClientes);
