const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const marcas = new Schema({
    Nombre: {type: String, require: true},
});

module.exports = mongoose.model("marcas", marcas);