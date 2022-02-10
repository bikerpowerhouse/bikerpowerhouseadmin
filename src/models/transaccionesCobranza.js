const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const transaccionesCobranza = new Schema({
    Timestamp: {type: Number, require: true},
    Tipo: {type: String, require: true},
    Monto: {type: String, require: true},
    Modalidad: {type: String, require: true},
    Fecha: {type: String, require: true},
    Transaccion: {type: String, require: true},
    Numero: {type: String, require: true},
});

module.exports = mongoose.model("Transacciones cobranza", transaccionesCobranza);