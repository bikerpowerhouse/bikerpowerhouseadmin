const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const notasComisiones = new Schema({
    Numero: {type: Number, require: true},
    Timestamp: {type: Number, require: true},
    Transaccion: {type: String,default: "-"},
    Modalidad: {type: String, require: true},
    Fecha: {type: String, require: true},
    Vendedor: {type: String, require: true},
    Cedula: {type: String, require: true},
    Direccion: {type: String, require: true},
    Documento: {type: String, require: true},
    Celular: {type: String, require: true},
    _idVendedor: {type: String, require: true},
    CantidadTotalDocumentos: {type: Number, require: true},
    Monto: {type: Number, require: true},
    Facturas: [{
        CalculoComision: {type: Number, require: true},
        Saldo: {type: Number, require: true},
        Apagar: {type: Number, require: true},
        Pendiente: {type: Number, require: true},
        Estados: {type: String, require: true},
    }]
});

module.exports = mongoose.model("Notas comisiones", notasComisiones);