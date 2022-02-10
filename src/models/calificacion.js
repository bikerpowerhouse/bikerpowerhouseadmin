const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const calificacion = new Schema({
  user: {type: String, require: true},
  Empresa: { type: String, require: true },
  Nombres: { type: String, require: true },
  Apellidos: { type: String, require: true },
  Documento: { type: String, require: true },
  TipoUsuario: { type: String, require: true },
  _idPersona: { type: String },
  CalificacionActual: { type: Number, default: 10 },
  HistorialCalificaciones : [{
      Puntos: {type: Number,require: true  },
      Calificacion: {type: Number, require: true  },
      Motivo: {type: String, require: true },
      Fecha: {type: String, require: true },
      Timestamp: {type: String, require: true },
  }]
});

module.exports = mongoose.model("Calificacion", calificacion);
