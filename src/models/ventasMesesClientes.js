const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const ventasClientesMeses = new Schema({
    Cliente: {type: String, require: true},
    _idCliente: {type: String, require: true},
    Anio: {type: Number, require: true},
    NumeroMes: {type: String, require: true},
    Mes: {type: String, require: true},
    CantidadTotal: {type: Number, require: true},
    MontoTotal: {type: Number, require: true},
    UtilidadesTotales : {type: Number, require: true},
});

module.exports = mongoose.model("Ventas cliente por meses", ventasClientesMeses);