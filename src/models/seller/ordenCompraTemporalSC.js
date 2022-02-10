const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
const { Schema } = mongoose;

const ordenCompraTemporalSC = new Schema({
  Numero: { type: Number, require: true },
  Fecha: { type: String, require: true },
  Cliente: { type: String, require: true },
  Vendedor: { type: String, require: true },
  DiasCredito: { type: Number,require: true },
  _idUsuarioVendedor: { type: String, require: true },
  SolicitadoPor: { type: String, require: true },
  MetrosCubicos: { type: Number, require: true },
  Peso: { type: Number, require: true },
  CantidadTotal: { type: Number, require: true },
  PrecioTotal: { type: Number, require: true },
  Productos: [
    {
      Codigo: { type: String, require: true },
      Cantidad: { type: String, require: true },
      PrecioFOBUnitario: { type: String, require: true },
      PrecioFOBTotal: { type: String, require: true },
      MetrosCubicosUnidad: { type: String, require: true },
      MetrosCubicosTotal: { type: String, require: true },
      PesoUnidad: { type: String, require: true },
      PesoTotal: { type: String, require: true },
      Descripcion: { type: String, require: true },
      TipoProducto: { type: String, require: true },
    },
  ],
});

module.exports = mongoose.model(
  "Orden compra temporal SC",
  ordenCompraTemporalSC
);
