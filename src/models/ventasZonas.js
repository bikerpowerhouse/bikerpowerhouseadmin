const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const ventasGeneralZona = new Schema({
    CantidadTotal: {type: Number, require: true},
    MontoTotal: {type: Number, require: true},
    UtilidadesTotales : {type: Number, require: true},
    Zona : {type: String, require: true},
});

module.exports = mongoose.model("Ventas general por zona", ventasGeneralZona);