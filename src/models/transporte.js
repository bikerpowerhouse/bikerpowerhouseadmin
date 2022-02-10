const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const transporte = new Schema({
    Empresa: {type: String, require: true},
    Direccion: {type: String},
    CodigoTelefono: {type: String, require: true},
    CodigoCelular: {type: String, require: true},
    Celular: {type: String, require: true},
    Telefono: {type: String, default:""},
    email: {type: String},
    Tarifario: [
        {
          Ciudad: { type: String, require: true },
          Porcentaje: { type: Number, require: true },
       
        },
      ],
});

module.exports = mongoose.model("Transporte", transporte);