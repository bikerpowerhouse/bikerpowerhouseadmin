const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const baterias = new Schema({
    TipoProducto: {type: String, default:"Batería"},
    Codigo: {type: String, require: true},
    Referencia: {type: String},
    Proveedor: {type: String, require: true},
    Serie: {type: String, require: true},
    Bulto: {type: Number, require: true},
    TipoVehiculo: {type: String, require: true},
    Voltaje: {type: Number, require: true},
    Capacidad10h: {type: Number},
    Capacidad20h: {type: Number},
    CCA: {type: Number},
    Carga: {type: Number},
    Polaridad: {type: String, require: true},
    Alto: {type: Number, require: true},
    Largo: {type: Number, require: true},
    Ancho: {type: Number, require: true},
    Peso: {type: Number, require: true},
    MarcaProducto: {type: String, require: true},
    PrecioFOB: {type: Number, require: true},
    PrecioVenta: {type: Number, require: true},
    Cantidad: {type: Number, require: true},
    Descripcion: {type: String, require: true},
    Vehiculo: [
        {
          Marca: { type: String, require: true },
          Modelo: { type: String, require: true },
          Anio: { type: String, require: true },
        },
      ],
});

module.exports = mongoose.model("Baterias", baterias);