const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const estructuraCostos = new Schema({
    Fecha: {type: String, require: true},
    Timestamp: {type: Number, require: true},
    Numero: {type: Number, require: true},
    Productos: [
      {
        Codigo: { type: String, require: true },
        TipoProducto: { type: String, require: true },
        Descripcion: { type: String, require: true },
        PrecioVentaAnterior: { type: Number, require: true },
        PrecioVentaNuevo: { type: Number, require: true },
        PrecioFOBAnterior: { type: Number, require: true },
        PrecioFOBNuevo: { type: Number, require: true },
      },
    ],
});

module.exports = mongoose.model("Estructura Costos", estructuraCostos);