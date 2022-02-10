const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const productos = new Schema({
    Codigo: {type: String, require: true},
    Referencia: {type: String, require: true},
    PrecioFOB: {type: Number, require: true},
    PrecioVenta: {type: Number, require: true},
    Cantidad: {type: Number, require: true},
    MarcaProducto: {type: String, require: true},
    Proveedor: {type: String, require: true},
    Descripcion: {type: String, require: true},
    Bulto: {type: Number, require: true},
    TipoVehiculo: {type: String, require: true},
    TipoProducto: {type: String, require: true},
    CantidadVendida: {type: Number, default: 0},
    CantidadTransito: {type: Number, default: 0},
    CantidadProduccion: {type: Number, default: 0},
    Alto: {type: Number, require: true},
    Largo: {type: Number, require: true},
    Ancho: {type: Number, require: true},
    Peso: {type: Number, require: true},
    HistorialMovimiento: [
        {
          FechaMovimiento: { type: String, require: true },
          CantidadAnterior: { type: Number, require: true },
          CantidadMovida: { type: Number, require: true },
          CantidadNueva: { type: Number, require: true },
          Comentario: { type: String, require: true },
          Timestamp: { type: Number, require: true },
          TipoMovimiento: { type: String, require: true },
        },
      ],
});

module.exports = mongoose.model("Productos", productos);