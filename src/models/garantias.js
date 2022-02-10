const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const garantias = new Schema({
  Timestamp: {type: Number, require: true},
  Fecha: {type: String, require: true},
  Codigo: { type: String, require: true },
  TipoProducto: { type: String, require: true},
  Cantidad: { type: Number, require: true },
  Valor: { type: Number, require: true },
  Cliente: { type: String, require: true },
  Vendedor: { type: String, require: true },
  _idVendedor: { type: String, require: true },
  Estado: { type: String, default:"Pendiente" },
});

module.exports = mongoose.model("Garantias", garantias)