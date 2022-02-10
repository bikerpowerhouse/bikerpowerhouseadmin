const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const bujias = new Schema({
    Codigo: {type: String, require: true},
    CodigoStock: {type: String, require: true},
    Serie: {type: String, require: true},
    Referencia1: {type: String, require: true},
    Referencia2: {type: String, require: true},
    TipoProducto: {type: String, default:"Bujia"},
    TipoVehiculo: {type: String, require: true},
    Bulto: {type: Number, require: true},
    Nombre: {type: String, require: true},
    Proveedor: {type: String, require: true},
    Alto: {type: Number, require: true},
    Largo: {type: Number, require: true},
    Ancho: {type: Number, require: true},
    MarcaProducto: {type: String, require: true},
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

module.exports = mongoose.model("Bujias", bujias);