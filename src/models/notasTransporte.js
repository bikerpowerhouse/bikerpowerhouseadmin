const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const notaTransporte = new Schema({
    Timestamp: {type: Number, require: true},
    Fecha: {type: String, require: true},
    EmpresaTransporte: {type: String, require: true},
    NumeroFactura: {type: Number, require: true},
    NumeroNota: {type: Number, require: true},
    CambioBolivares: {type: Number, require: true},
    PrecioTotalFactura : {type: Number, require: true},
    PrecioTotalFacturaBS : {type: Number, require: true},
    Estado: {type: String, default: "Pendiente"},
    Zona : {type: String, require: true},
    Tarifa : {type: String, require: true},
    PrecioPagar : {type: Number, require: true},
});

module.exports = mongoose.model("Notas transporte", notaTransporte);