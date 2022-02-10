const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const Facturas = new Schema({
    Timestamp: {type: Number, require: true},
    Fecha: {type: String, require: true},
    Vencimiento: {type: String, require: true},
    Cambio: {type: Number, require: true},
    NumeroFactura: {type: Number, require: true},
    NumeroNota: {type: Number, require: true},
    NumeroControl: {type: String, require: true},
    NumeroOrden: {type: String, require: true},
    Cliente: {type: String, require: true},
    Documento: {type: String, require: true},
    Direccion: {type: String, require: true},
    Celular: {type: String, require: true},
    Zona:{type: String, require: true},
    DescuentoBS: {type:Number, require: true},
    BaseImponibleBS: {type:Number, require: true},
    IvaBS: {type:Number, require: true},
    TotalSinDescuentoBS: {type:Number, require: true},
    NetoUSD: {type: Number, require: true},
    NetoBS: {type: Number, require: true},
    CantidadTotal: {type: Number, require: true},
    Vendedor: {type: String, require: true},
    _idVendedor: {type: String, require: true},
    Estado : {type: String, default: "Por pagar"},
    Transporte: {type: String, require: true},
    PrecioTarifaUSD : {type: Number, require: true},
    PrecioTarifaBS : {type: String, require: true},
    EstadoTarifa : {type: String, default: "Por pagar"},
    Productos: [{
        Codigo: {type: String, require : true },
        Producto : {type: String, require: true},
        Descripcion : {type: String, require: true},
        Cantidad: {type: String, require:true}, 
        PrecioUnidadUSD: {type: String, require: true },
        PrecioUnidadBS: {type: String, require: true },
        PrecioTotalUSD: {type: String, require: true },
        PrecioTotalBS: {type: String, require: true },
    }],
});

module.exports = mongoose.model("Facturas", Facturas);