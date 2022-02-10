const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const notasDevolucio = new Schema({
    Fecha: {type: String, require : true},
    Timestamp: {type: Number, require : true},
    Recibo: {type: Number, require : true},
    Cliente : {type: String, require:true}, 
    TipoDeNota : {type: String, require:true}, 
    Estado: {type: String, default: "Procesada"},
    NotaEntrega: {type: Number, require: true},
    Vendedor : {type: String, require:true}, 
    _idVendedor : {type: String, require:true}, 
    Documento : {type: String, require:true}, 
    Direccion : {type: String, require:true}, 
    Celular : {type: Number, require:true},
    Titulo : {type: String, require: true},
    CantidadTotal : {type: Number, require: true},
    PrecioTotal : {type: Number, require: true},
    Productos: [{
        Codigo: {type: String, require : true },
        TipoProducto : {type: String, require: true},
        Descripcion : {type: String, require: true},
        Cantidad: {type: String, require:true}, 
        PrecioUnidad: {type: String, require: true },
        PrecioTotal: {type: String, require: true },
    }],

}); 

module.exports = mongoose.model("notasDevolucio", notasDevolucio);
