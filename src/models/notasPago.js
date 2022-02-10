const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const notasPago = new Schema({
    Fecha: {type: String, require : true},
    Timestamp: {type: Number, require : true},
    Recibo: {type: Number, require : true},
    Estado: {type: String, default: "Procesada"},
    Facturas: [{
        NotaEntrega: {type: String, require : true},
        Monto: {type: String, require : true},
        Modalidad: {type: String, require : true},
        Comentario: {type: String, require : true},
        
    }],
    Transaccion: {type: String},
    Monto: {type: Number, require : true},
    Modalidad: {type: String, require : true},
    Comentario: {type: String, require : true},
    Cliente : {type: String, require:true}, 
    Documento : {type: String, require:true}, 
    Direccion : {type: String, require:true}, 
    Celular : {type: Number, require:true},
    PendienteAPagar : {type: Number, require: true}
}); 

module.exports = mongoose.model("notasPago", notasPago);
