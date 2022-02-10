const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const ventasClientesGeneral = new Schema({
    Cliente: {type: String, require: true},
    _idCliente: {type: String, require: true},
    CantidadTotal: {type: Number, require: true},
    MontoTotal: {type: Number, require: true},
    UtilidadesTotales : {type: Number, require: true},
});

module.exports = mongoose.model("Ventas cliente general", ventasClientesGeneral);