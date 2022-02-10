const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const Reportes = new Schema({
  Fecha: { type: String, require: true },
  Timestamp: { type: Number, require: true },
  Vendedor: { type: String, require: true },
  email: { type: String, require: true },
  _idVendedor: { type: String, require: true },
  _idUsuario: { type: String, require: true },
  Tipo: { type: String, require: true },
  Comentario: { type: String, require: true },
  Cliente: { type: String, require: true },
  Monto: { type: Number, require: true },
});

module.exports = mongoose.model( "Reportes", Reportes);
