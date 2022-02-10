const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const recibosVueltos = new Schema({
    Numero: {type: Number, require: true},
    Timestamp: {type: Number, require: true},
    Fecha: {type: String, require: true},
    Cliente: {type: String, require: true},
    Monto: {type: String, require: true},
});

module.exports = mongoose.model("Recibos vueltos", recibosVueltos);