const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const guardapolvos = new Schema({
    Codigo: {type: String, require: true},
    TipoProducto: {type: String, default:"Guardapolvo"},
    MarcaProducto: {type: String, require: true},
    TipoVehiculo: {type: String, require: true},
    Bulto: {type: Number, require: true},
    Nombre: {type: String, require: true},
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

module.exports = mongoose.model("Guardapolvos", guardapolvos);