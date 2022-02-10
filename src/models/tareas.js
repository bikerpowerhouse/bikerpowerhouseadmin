const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const tareas = new Schema({
  Timestamp: {type: Number, require: true},
  user: {type: String, require: true},
  Nombres: { type: String, require: true },
  _idSolicitud: { type: String},
  Empresa: { type: String},
  Apellidos: { type: String, require: true },
  Documento: { type: String, require: true },
  TipoUsuario: { type: String, require: true },
  _idPersona: { type: String, require: true },
  FechaEntrega: { type: String, require: true },
  Fecha: { type: String, require: true },
  FechaPospuesta: { type: String, default:"-" },
  NotaEntrega: { type: String},
  Estado: { type: String, default:"Pendiente" },
  TipoTarea: {type: String, require: true},
  Descripcion: {type: String, require: true}

});

module.exports = mongoose.model("Tareas", tareas)