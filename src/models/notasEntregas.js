const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const notaEntrega = new Schema({
    Timestamp: {type: Number, require: true},
    Fecha: {type: String, require: true},
    Vencimiento: {type: String, require: true},
    Numero: {type: Number, require: true},
    Factura: {type: String, default:"-" },
    NumeroOrden: {type: String, default:"-" },
    Control: {type: String, default:"-" },
    Cliente: {type: String, require: true},
    Descuento: {type: Number, require: true},
    BaseImponible: {type: Number, require: true},
    Iva: {type: Number, require: true},
    TotalSinDescuento: {type: Number, require: true},
    Documento: {type: String, require: true},
    Direccion: {type: String, require: true},
    Celular: {type: String, require: true},
    Zona:{type: String, require: true},
    Neto: {type: Number, require: true},
    Neto2: {type: Number, require: true},
    Saldo: {type: Number, require: true},
    CantidadTotal: {type: Number, require: true},
    Vendedor: {type: String, require: true},
    _idVendedor: {type: String, require: true},
    PorcentajeGanancia: {type: Number, require: true},
    GananciasVendedor: {type: Number, require: true},
    SaldoGananciasVendedor: {type: Number, require: true},
    Comentario : {type: String},
    EstadoComision : {type: String, default: "Por pagar"},
    Estado : {type: String, default: "Por pagar"},
    Transporte: {type: String, require: true},
    EstadoTarifa : {type: String, default: "Por pagar"},
    Productos: [{
        Codigo: {type: String, require : true },
        Producto : {type: String, require: true},
        Descripcion : {type: String, require: true},
        Cantidad: {type: String, require:true}, 
        PrecioUnidad: {type: String, require: true },
        PrecioTotal: {type: String, require: true },
        PrecioTotal2: {type: String, require: true },
    }],
    HistorialPago: [{
        Pago: {type: String, require: true },
        Comentario: {type: String, require: true },
        Recibo: {type: Number, require: true },
        Modalidad: {type: String, require: true },
        FechaPago: {type: String, require: true },
        user: {type: String, require: true}, 
        Timestamp:{type: Number, require: true}
    }],
});

module.exports = mongoose.model("Notas entrega", notaEntrega);