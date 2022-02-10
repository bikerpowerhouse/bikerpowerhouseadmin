const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const ventasAmortiguadoresGeneral = new Schema({
    CantidadTotal: {type: Number, require: true},
    MontoTotal: {type: Number, require: true},
    UtilidadesTotales : {type: Number, require: true},
});

module.exports = mongoose.model("Ventas amortiguadores", ventasAmortiguadoresGeneral);