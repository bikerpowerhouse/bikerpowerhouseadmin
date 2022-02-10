const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const comisiones = new Schema({
    Timestamp: {type: Number, require: true},
    Fecha: {type: String, require: true},
    NumeroComision: {type: Number, require: true},
    NumeroFactura: {type: Number, require: true},
    PrecioFactura: {type: Number, require: true},
    PorcentajeGanancia: {type: Number, require: true},
    Comision : {type: Number, require: true},
    _idVendedor : {type: String, require: true},
    Nombres : {type: String, require: true},
    Apellidos : {type: String, require: true},
    Zona : {type: String, require: true},
    Cliente: {type: String, require: true},
    Estado: {type: String, default: "Pendiente"},
    SaldoComision: {type: Number, require: true},
    
});

module.exports = mongoose.model("Comisiones", comisiones);