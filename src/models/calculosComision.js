const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const calculoComision = new Schema({
    Timestamp: {type: Number, require: true},
    Numero: {type: String, require: true},
    Fecha: {type: String, require: true},
    Vendedor: {type: String, require: true},
    Cedula: {type: Number, require: true},
    Direccion: {type: String, require: true},
    _idVendedor: {type: String, require: true},
    Neto: {type: Number, require: true},
    CantidadNotas: {type: Number, require: true},
    Saldo: {type: Number, require: true},
    Estado: {type: String, default: "Por pagar"},
    Notas: [{
        NotaEntrega: {type: Number, require: true},
        Comision: {type: Number, require: true},
    }],
    HistorialPago: [{
        Pago: {type: String, require: true },
        Comentario: {type: String, require: true },
        Recibo: {type: Number, require: true },
        Modalidad: {type: String, require: true },
        FechaPago: {type: String, require: true },
        user: {type: String, require: true}, 
        Timestamp:{type: Number, require: true}
    }],
});

module.exports = mongoose.model("Calculo comision", calculoComision);