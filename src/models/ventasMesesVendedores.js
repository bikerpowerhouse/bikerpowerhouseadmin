const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const ventasVendedoresMeses = new Schema({
    Vendedor: {type: String, require: true},
    _idVendedor: {type: String, require: true},
    Anio: {type: Number, require: true},
    NumeroMes: {type: String, require: true},
    Mes: {type: String, require: true},
    CantidadTotal: {type: Number, require: true},
    MontoTotal: {type: Number, require: true},
    UtilidadesTotales : {type: Number, require: true},
});

module.exports = mongoose.model("Ventas vendedores por meses", ventasVendedoresMeses);