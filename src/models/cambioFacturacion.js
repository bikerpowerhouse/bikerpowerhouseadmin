const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const cambioFacturacion = new Schema({
    Cambio: {type: Number, require: true},
    Estado: {type: String, default:"Desactualizado"},
    FechaActualizacion : {type: String, require: true},
    NumeroActualizacionDiaria : {type: String, require: true}
});

module.exports = mongoose.model("Cambio facturacion", cambioFacturacion);