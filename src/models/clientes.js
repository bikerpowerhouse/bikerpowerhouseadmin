const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const clientes = new Schema({
  Nombres: { type: String },
  Apellidos: { type: String },
  Cedula: { type: String },
  Empresa: { type: String, require: true },
  RIF: { type: String, require: true },
  Direccion: { type: String, require: true },
  CodigoCeular :{ type: String, require: true},
  Celular: { type: Number, require: true },
  MaximoCredito: { type: Number, require: true },
  CodigoTelefono: { type: String},
  Telefono: { type: Number}, 
  email: { type: String, require: true }, 
  Zona: { type: String, require: true },
  CodigoPostal: { type: Number, require: true },
  Vendedor: { type: String, require: true },
  SaldoFavor: { type: Number, default: 0 },
  _idVendedor: { type: String, require: true },
  HistorialSaldoFavor : [{
    Modalidad : {type: String, require: true},
    Numero : {type: String, require: true},
    Monto: {type: Number, require: true}
  }]
});

module.exports = mongoose.model("Clientes", clientes);
