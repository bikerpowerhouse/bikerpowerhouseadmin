const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const solicitudesPago = new Schema({
    Fecha: {type: String, require : true},
    Timestamp: {type: Number, require : true},
    SolicitadoPor: {type: String, require : true},
    Vendedor: {type: String, require : true},
    _idVendedor: {type: String, require : true},
    NumeroSolicitud: {type: Number, require : true},
    Estado: {type: String, default: "Enviada"},
    Transaccion: {type: String},
    Monto: {type: Number, require : true},
    Modalidad: {type: String, require : true},
    Comentario: {type: String, require : true},
    Cliente : {type: String, require:true}, 
    Documento : {type: String, require:true}, 
    Direccion : {type: String, require:true}, 
    Celular : {type: Number, require:true},
}); 

module.exports = mongoose.model("solicitudesPago", solicitudesPago);
