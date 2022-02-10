const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const solicitudesEgresos = new Schema({
    Fecha: {type: String, require : true},
    Timestamp: {type: Number, require : true},
    Vendedor: {type: String, require : true},
    Metodo: {type: String},
    Referencia : {type: String},
    _idVendedor: {type: String, require : true},
    NumeroSolicitud: {type: Number, require : true},
    Estado: {type: String, default: "Enviada"},
    MontoTotal: {type: Number, require : true},
    Egresos: [{
        Monto: {type: Number, require : true},
        Comentario: {type: String, require : true},
    }]
}); 

module.exports = mongoose.model("solicitudesEgresos", solicitudesEgresos);
