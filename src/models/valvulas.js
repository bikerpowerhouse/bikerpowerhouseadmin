const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const valvula = new Schema({
    Codigo: {type: String, require: true},
    TipoProducto: {type: String, default:"Valvula"},
    TipoVehiculo: {type: String, require: true},
    Bulto: {type: Number, require: true},
    Tipo: {type: String, require: true},
    MarcaProducto: {type: String, require: true},
    CantidadEstuche: {type: Number, require: true},
    Proveedor: {type: String, require: true},
    Alto: {type: Number, require: true},
    Largo: {type: Number, require: true},
    Ancho: {type: Number, require: true},
    Peso: {type: Number, require: true},
    PrecioFOB: {type: Number, require: true},
    PrecioVenta: {type: Number, require: true},
    Descripcion: {type: String, require: true},
    Vehiculo: [
        {
          Marca: { type: String, require: true },
          Modelo: { type: String, require: true },
          Anio: { type: String, require: true },
       
        },
      ],
});

module.exports = mongoose.model("Valvula", valvula);