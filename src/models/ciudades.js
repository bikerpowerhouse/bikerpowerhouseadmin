const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const ciudades = new Schema({
    Nombre: {type: String, require: true},
});

module.exports = mongoose.model("ciudades", ciudades);