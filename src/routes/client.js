const router = require("express").Router();
const path = require("path");
const passport = require('passport');
const productosDB = require('../models/productos');
const clientesDB = require('../models/clientes')
const ordenCompraTemporalSCDB = require('../models//seller/ordenCompraTemporalSC')
const ordenComprasClientesDB = require('../models//seller/ordenesCompra')
const facturasDB = require('../models/facturas')
const notasEntregaDB = require('../models/notasEntregas')
const calificacionDB = require('../models/calificacion')
const usersDB = require('../models/users')
const tareasDB = require('../models/tareas')
const garantiasDB = require('../models/garantias')
const vendedoresDB = require('../models/vendedores')
const solicitudesDevolucionesDB = require('../models/solicitudes-de-devoluciones')
const solicitudesPagoDB = require('../models/solicitudes-de-pago')
const recibosVueltosDB = require('../models/recibosVuelto')
const { isAuthenticatedClient } = require("../helpers/auth");


router.get('/home-client', isAuthenticatedClient, async (req, res) => {
    let cliente = await clientesDB.findOne({email: req.user.email})
    let nombres = `${req.user.Nombres} ${req.user.Apellidos}`
    let Fecha = new Date();
    let dia;
    let mes;
    let año = Fecha.getFullYear();
    if (Fecha.getDate() < 10) {
      dia = `0${Fecha.getDate()}`;
    } else {
      dia = Fecha.getDate();
    }
    if (Fecha.getMonth() + 1 < 10) {
      mes = `0${Fecha.getMonth() + 1}`;
    } else {
      mes = Fecha.getMonth() + 1;
    }
    Fecha = `${año}-${mes}-${dia}`;
    
    let Fecha2 = new Date();
    function sumarDias(fecha, dias){
        fecha.setDate(fecha.getDate() + dias);
        return fecha;
    }
    Fecha2 = sumarDias(Fecha2, 7)
    let dia2;
    let mes2;
    let año2 = Fecha2.getFullYear();
    if (Fecha2.getDate() < 10) {
      dia2 = `0${Fecha2.getDate()}`;
    } else {
      dia2 = Fecha2.getDate();
    }
    if (Fecha2.getMonth() + 1 < 10) {
      mes2 = `0${Fecha2.getMonth() + 1}`;
    } else {
      mes2 = Fecha2.getMonth() + 1;
    }
    Fecha2 = `${año2}-${mes2}-${dia2}`;
    let tareas = await tareasDB.find({$and: [{Estado:"Pendiente"},{user: req.user.email}]}).sort({}).sort({Timestamp:-1})
    let notasEntregaVencida = await notasEntregaDB.find({$and :  [{Estado: "Por pagar"},{Cliente:cliente.Empresa},{Vencimiento: {$lte: Fecha}}]})
    let notasEntregaProximasVencer = await notasEntregaDB.find({$and : [{Estado: "Por pagar"},{Cliente:cliente.Empresa},{Vencimiento: {$gte: Fecha}}, {Vencimiento: {$lte: Fecha2}}]})
    
    tareas = tareas.map((data) => {
        return{
            TipoTarea: data.TipoTarea,
            FechaPospuesta: data.FechaPospuesta,
            FechaEntrega: data.FechaEntrega,
            Descripcion: data.Descripcion,
            Empresa: data.Empresa,
        }
    })
    notasEntregaVencida = notasEntregaVencida.map((data) => {
        return{
            Numero : data.Numero,
            Vencimiento: data.Vencimiento,
            Cliente: data.Cliente,
            Vendedor: data.Vendedor,
            Neto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Neto),
            Saldo: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Saldo)
        }
    })
    notasEntregaProximasVencer = notasEntregaProximasVencer.map((data) => {
        return{
            Numero : data.Numero,
            Vencimiento: data.Vencimiento,
            Cliente: data.Cliente,
            Vendedor: data.Vendedor,
            Neto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Neto),
            Saldo: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Saldo)
        }
    })
    res.render('client/home-client',{
        layout:"client.hbs",
        notasEntregaProximasVencer,
        tareas, 
        nombres,
        notasEntregaVencida
    })
})


router.get('/realizar-compra-cliente', isAuthenticatedClient, async (req, res) => {{
    let productos = await productosDB.find().sort({"TipoProducto": 1})
    let tiposProductos = []
    for(i=0; i< productos.length; i++ ){
        let validacion = tiposProductos.find((data) => data == productos[i].TipoProducto)
        if(!validacion){
            tiposProductos.push(productos[i].TipoProducto)
        }
    }
    res.render('client/realizar-compra',{
        layout:"client.hbs",
        tiposProductos
    })
}})

router.post('/enviar-productos-orden-compra-client', isAuthenticatedClient, async (req, res) => {
    let {Codigo, TipoProducto, PrecioFOBUnitario, Cantidad, PrecioFOBTotal, MetrosCubicosUnidad, 
        MetrosCubicosTotal, PesoUnidad, PesoTotal, Descripcion} = req.body
    let email = req.user.email
    let Cliente = await clientesDB.findOne({email: email})
    let Fecha = new Date();
    let dia;
    let mes;
    let año = Fecha.getFullYear();
    if (Fecha.getDate() < 10) {
      dia = `0${Fecha.getDate()}`;
    } else {
      dia = Fecha.getDate();
    }
    if (Fecha.getMonth() + 1 < 10) {
      mes = `0${Fecha.getMonth() + 1}`;
    } else {
      mes = Fecha.getMonth() + 1;
    }
    Fecha = `${año}-${mes}-${dia}`;
    let ordenCompraTemporalSC = await ordenCompraTemporalSCDB.find({$and: [{SolicitadoPor: req.user.TipoUsuario},{Cliente:Cliente.Empresa}]})
    if(ordenCompraTemporalSC.length == 0){
        let validacionNumero = await ordenCompraTemporalSCDB.find().sort({"Numero" : -1})
        let Numero = 0
        if(validacionNumero.length == 0){
            Numero = 5000001
        }else{
            Numero = +validacionNumero[0].Numero + 1
        }
        let data = {
            Codigo, 
            TipoProducto, 
            PrecioFOBUnitario, 
            Cantidad, 
            PrecioFOBTotal, 
            MetrosCubicosUnidad, 
            MetrosCubicosTotal, 
            PesoUnidad, 
            PesoTotal, 
            Descripcion
        }
        let nuevaOrdenCompraSC = new ordenCompraTemporalSCDB({
            Numero: Numero,
            Fecha: Fecha,
            Cliente: Cliente.Empresa,
            Vendedor: Cliente.Vendedor,
            DiasCredito: Cliente.MaximoCredito,
            _idUsuarioVendedor : Cliente._idVendedor,
            SolicitadoPor : req.user.TipoUsuario,
            MetrosCubicos: 0,
            Peso: 0,
            CantidadTotal: Cantidad,
            PrecioTotal: PrecioFOBTotal,
        })
        await nuevaOrdenCompraSC.save()


        await ordenCompraTemporalSCDB.findOneAndUpdate({Numero:Numero},{
            $push : {Productos: data}
        })
        let ok = "ok"
        res.send(JSON.stringify(ok))

        
    }else{
        let validacion = ordenCompraTemporalSC[0].Productos.find((data) => data.Codigo == Codigo)
        if(validacion){
            let error = "El código a agregar ya se encuentra en la lista. Por favor, valide e intente de nuevo"
            res.send(JSON.stringify(error))
        }else{
            let MetrosCubicos = +ordenCompraTemporalSC[0].MetrosCubicos + +MetrosCubicosTotal
            let Peso = +ordenCompraTemporalSC[0].Peso + +PesoTotal
            let CantidadTotal = +ordenCompraTemporalSC[0].CantidadTotal + +Cantidad
            let PrecioTotal = +ordenCompraTemporalSC[0].PrecioTotal + +PrecioFOBTotal
            let data = {
                Codigo, 
                TipoProducto, 
                PrecioFOBUnitario, 
                Cantidad, 
                PrecioFOBTotal, 
                MetrosCubicosUnidad, 
                MetrosCubicosTotal, 
                PesoUnidad, 
                PesoTotal, 
                Descripcion
            }
            await ordenCompraTemporalSCDB.findByIdAndUpdate(ordenCompraTemporalSC[0]._id,{
                MetrosCubicos: MetrosCubicos,
                Peso: Peso,
                CantidadTotal: CantidadTotal,
                PrecioTotal: PrecioTotal,
                $push : {Productos: data}
            })
            let ok = "ok"
            res.send(JSON.stringify(ok))
        }
    }
})


router.get('/ver-lista-compra-cliente', isAuthenticatedClient, async (req, res) => {
    let cliente = await clientesDB.findOne({email: req.user.email})
    //enviar error
    let ordenCompraTemporalSC = await ordenCompraTemporalSCDB.find({Cliente: cliente.Empresa}).sort({"Cliente": 1})
    if(ordenCompraTemporalSC.length == 0){
        req.flash("error", "No ha agregado productos a la lista. Por favor, valide e intente de nuevo.")
        res.redirect('/realizar-compra-cliente')
    }else{
        let Productos = ordenCompraTemporalSC[0].Productos.map((data) => {
            return{
                Codigo: data.Codigo,
                Cantidad: data.Cantidad,
                PrecioFOBUnitario: data.PrecioFOBUnitario,
                PrecioFOBTotal: data.PrecioFOBTotal,
                MetrosCubicosUnidad: data.MetrosCubicosUnidad,
                MetrosCubicosTotal: data.MetrosCubicosTotal,
                PesoUnidad: data.PesoUnidad,
                PesoTotal: data.PesoTotal,
                Descripcion: data.Descripcion,
                TipoProducto: data.TipoProducto,
            }
        })
        let _id = ordenCompraTemporalSC[0]._id
        let PrecioTotal = ordenCompraTemporalSC[0].PrecioTotal
        let PrecioTotalDolares = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(ordenCompraTemporalSC[0].PrecioTotal)
        let CantidadTotal = ordenCompraTemporalSC[0].CantidadTotal
        
        res.render('client/ver-lista-compras',{
            PrecioTotal,
            CantidadTotal,
            PrecioTotalDolares,
            _id,
            Productos,
            layout:"client.hbs"
        })

    }
})



router.post('/cambiando-cantidad-orden-temporal-client', isAuthenticatedClient,async (req, res) => {
    let {MetrosCubicos, Peso, CantidadTotal, PrecioTotal, Producto}= req.body
    let Cliente = await clientesDB.findOne({email: req.user.email})
    Cliente = Cliente.Empresa
    let ordenCompraTemporalSC = await ordenCompraTemporalSCDB.find({Cliente: Cliente})
    let MetrosCubicosActualizados = (+ordenCompraTemporalSC[0].MetrosCubicos + MetrosCubicos).toFixed(10)
    let PesoActualizados = (+ordenCompraTemporalSC[0].Peso + Peso).toFixed(2)
    let CantidadTotalActualizados = +ordenCompraTemporalSC[0].CantidadTotal + CantidadTotal
    let PrecioTotalActualizados = (+ordenCompraTemporalSC[0].PrecioTotal + PrecioTotal).toFixed(2)
    let ProductosActualizados = ordenCompraTemporalSC[0].Productos.filter((data) => data.Codigo != Producto.Codigo)
    ProductosActualizados.push(Producto)
     
    await ordenCompraTemporalSCDB.findByIdAndUpdate(ordenCompraTemporalSC[0]._id,{
        MetrosCubicos: MetrosCubicosActualizados, 
        Peso: PesoActualizados, 
        CantidadTotal: CantidadTotalActualizados, 
        PrecioTotal: PrecioTotalActualizados, 
        Productos: ProductosActualizados, 
    })

    res.send(JSON.stringify("ok"))
})

router.post('/eliminar-codigo-orden-temporal-client', isAuthenticatedClient ,async (req, res) => {
    let {Codigo} = req.body
    let Cliente = await clientesDB.findOne({email: req.user.email})
    Cliente = Cliente.Empresa
    let ordenCompraTemporalSC = await ordenCompraTemporalSCDB.find({Cliente: Cliente})
    let Producto = ordenCompraTemporalSC[0].Productos.find((data) => data.Codigo == Codigo)
    let MetrosCubicosActualizados = (+ordenCompraTemporalSC[0].MetrosCubicos - +Producto.MetrosCubicosTotal).toFixed(10)
    let PesoActualizados = (+ordenCompraTemporalSC[0].Peso - +Producto.PesoTotal).toFixed(2)
    let CantidadTotalActualizados = +ordenCompraTemporalSC[0].CantidadTotal - +Producto.Cantidad
    let PrecioTotalActualizados = (+ordenCompraTemporalSC[0].PrecioTotal - +Producto.PrecioFOBTotal).toFixed(2)
    let ProductosActualizados = ordenCompraTemporalSC[0].Productos.filter((data) => data.Codigo != Codigo)
    if(ProductosActualizados.length == 0){
        await ordenCompraTemporalSCDB.findByIdAndDelete(ordenCompraTemporalSC[0]._id) 
        res.send(JSON.stringify("ok"))

    }else{
        await ordenCompraTemporalSCDB.findByIdAndUpdate(ordenCompraTemporalSC[0]._id,{
            MetrosCubicos: MetrosCubicosActualizados, 
            Peso: PesoActualizados, 
            CantidadTotal: CantidadTotalActualizados, 
            PrecioTotal: PrecioTotalActualizados, 
            Productos: ProductosActualizados, 
        })
        res.send(JSON.stringify("ok"))

    }
})


router.get('/generar-orden-compra-client/:id', isAuthenticatedClient, async (req, res) => {
    let Timestamp = Date.now();
    let Fecha = new Date();
    let dia;
    let mes;
    let año = Fecha.getFullYear();
    let ordenComprasClientes = await ordenComprasClientesDB.find().sort({"Numero": -1})
    let ordenCompraTemporalSC = await ordenCompraTemporalSCDB.find({_id: req.params.id})
    if (Fecha.getDate() < 10) {
      dia = `0${Fecha.getDate()}`;
    } else {
      dia = Fecha.getDate();
    }
    if (Fecha.getMonth() + 1 < 10) {
      mes = `0${Fecha.getMonth() + 1}`;
    } else {
      mes = Fecha.getMonth() + 1;
    }
    Fecha = `${año}-${mes}-${dia}`;

    let Numero = 0
    if(ordenComprasClientes.length == 0){
        Numero = 5000001
    }else{
        Numero = +ordenComprasClientes[0].Numero + 1
    }
    let nuevaOrdenCliente = new ordenComprasClientesDB({
        Numero: Numero,
        Fecha: Fecha,
        Timestamp: Timestamp,
        Cliente: ordenCompraTemporalSC[0].Cliente,
        Vendedor: ordenCompraTemporalSC[0].Vendedor,
        DiasCredito: ordenCompraTemporalSC[0].DiasCredito,
        _idUsuarioVendedor: ordenCompraTemporalSC[0]._idUsuarioVendedor,
        SolicitadoPor: ordenCompraTemporalSC[0].SolicitadoPor,
        MetrosCubicos: ordenCompraTemporalSC[0].MetrosCubicos,
        Peso: ordenCompraTemporalSC[0].Peso,
        CantidadTotal: ordenCompraTemporalSC[0].CantidadTotal,
        PrecioTotal: ordenCompraTemporalSC[0].PrecioTotal,
        Productos: ordenCompraTemporalSC[0].Productos
    })
    await nuevaOrdenCliente.save()
    await ordenCompraTemporalSCDB.findByIdAndDelete(ordenCompraTemporalSC[0]._id)

    req.flash("success", `Orden de compra #${Numero} generada correctamente`)
    res.redirect('/realizar-compra-cliente')

})


router.get('/ordenes-de-compras-cliente', isAuthenticatedClient, async (req, res) => {
    let Cliente = await clientesDB.findOne({email: req.user.email})
    let ordenes = await ordenComprasClientesDB.find({Cliente: Cliente.Empresa})
    let ordenesAtendidas = await ordenComprasClientesDB.find({$and : [{Estado: {$ne: "En proceso"}}, {Cliente: Cliente.Empresa}]})
    let montoOrdenesAtendidas = 0
    let montoOrdenesGeneradas = 0
    let ordenesGeneradas = ordenes.length

    for(i=0; i< ordenesAtendidas.length; i++){
        montoOrdenesAtendidas += +ordenesAtendidas[i].PrecioTotal
    }
    for(i=0; i< ordenes.length; i++){
        montoOrdenesGeneradas += +ordenes[i].PrecioTotal
    }
    montoOrdenesAtendidas = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(montoOrdenesAtendidas.toFixed(2))
    montoOrdenesGeneradas = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(montoOrdenesGeneradas.toFixed(2))
    ordenesAtendidas = ordenesAtendidas.length


    ordenes = ordenes.map((data) => {
        return{
            Numero: data.Numero,
            Fecha: data.Fecha,
            Cliente: data.Cliente,
            Vendedor: data.Vendedor,
            _idUsuarioVendedor: data._idUsuarioVendedor,
            SolicitadoPor: data.SolicitadoPor,
            MetrosCubicos: data.MetrosCubicos,
            Peso: data.Peso,
            Factura: data.Factura,
            CantidadTotal: data.CantidadTotal,
            Estado: data.Estado,
            PrecioTotal:  new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotal),
            Productos: data.Productos.map((data2) => {
                return{
                    Codigo: data2.Codigo,
                    Cantidad: data2.Cantidad,
                    PrecioFOBUnitario: data2.PrecioFOBUnitario,
                    PrecioFOBTotal: data2.PrecioFOBTotal,
                    MetrosCubicosUnidad: data2.MetrosCubicosUnidad,
                    MetrosCubicosTotal: data2.MetrosCubicosTotal,
                    PesoUnidad: data2.PesoUnidad,
                    PesoTotal: data2.PesoTotal,
                    Descripcion: data2.Descripcion,
                    TipoProducto: data2.TipoProducto,
                }
            }),
        }
    })

    res.render('client/estado-cuenta/ver-ordenes-compra',{
        ordenes,
        montoOrdenesAtendidas,
        montoOrdenesGeneradas,
        ordenesAtendidas,
        ordenesGeneradas,
        layout:"client.hbs"
    })

} )


router.post('/solicitar-ordenes-compras-cliente', isAuthenticatedClient,async (req, res) => {
    let {Estado} = req.body
    let Cliente = await clientesDB.findOne({email: req.user.email})
    let ordenes = await ordenComprasClientesDB.find({$and : [{Cliente: Cliente.Empresa}, {Estado:Estado}]})
    let montoOrdenesAtendidas = 0
    let montoOrdenesGeneradas = 0
    let ordenesAtendidas = 0 
    let ordenesGeneradas = ordenes.length
    if(Estado == "Facturada" || Estado == "Procesada"){
        ordenesAtendidas = ordenes.length
    }
    for(i=0; i< ordenes.length; i++){
        montoOrdenesGeneradas += +ordenes[i].PrecioTotal
        if(Estado == "Facturada" || Estado == "Procesada"){
            montoOrdenesAtendidas += +ordenes[i].PrecioTotal
        }
    }
    montoOrdenesAtendidas = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(montoOrdenesAtendidas.toFixed(2))
    montoOrdenesGeneradas = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(montoOrdenesGeneradas.toFixed(2))

    ordenes = ordenes.map((data) => {
        return{
            Numero: data.Numero,
            Fecha: data.Fecha,
            Cliente: data.Cliente,
            Vendedor: data.Vendedor,
            _idUsuarioVendedor: data._idUsuarioVendedor,
            SolicitadoPor: data.SolicitadoPor,
            MetrosCubicos: data.MetrosCubicos,
            Peso: data.Peso,
            Factura: data.Factura,
            CantidadTotal: data.CantidadTotal,
            Estado: data.Estado,
            PrecioTotal:  new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotal),
            Productos: data.Productos.map((data2) => {
                return{
                    Codigo: data2.Codigo,
                    Cantidad: data2.Cantidad,
                    PrecioFOBUnitario: data2.PrecioFOBUnitario,
                    PrecioFOBTotal: data2.PrecioFOBTotal,
                    MetrosCubicosUnidad: data2.MetrosCubicosUnidad,
                    MetrosCubicosTotal: data2.MetrosCubicosTotal,
                    PesoUnidad: data2.PesoUnidad,
                    PesoTotal: data2.PesoTotal,
                    Descripcion: data2.Descripcion,
                    TipoProducto: data2.TipoProducto,
                }
            }),
        }
    })
    let data = {
        ordenes,
        montoOrdenesAtendidas,
        montoOrdenesGeneradas,
        ordenesAtendidas,
        ordenesGeneradas,
    }
    res.send(JSON.stringify(data))
})

router.get('/cuentas-pendientes-cliente', isAuthenticatedClient ,async (req, res) => {
    let Cliente = await clientesDB.findOne({email: req.user.email})
    let solicitudesDevolucion = await solicitudesDevolucionesDB.find({$and: [{Estado: "Aceptado en proceso"}, {Cliente: Cliente.Empresa}]})
    let solicitudes = solicitudesDevolucion.length
    let notasEntrega = await notasEntregaDB.find({$and:[{Cliente: Cliente.Empresa}, {Estado:"Por pagar"}]}).sort({"Timestamp": -1})
    let facturasGeneral = []
    let documentosPendientes = notasEntrega.length
    let montoSolicitud = 0
    let documentosVencidos = 0
    let montoDocumentosPendientes = 0
    let montoDocumentosVencidos = 0
    let Fecha = new Date();
    let dia;
    let mes;
    let año = Fecha.getFullYear();
    if (Fecha.getDate() < 10) {
      dia = `0${Fecha.getDate()}`;
    } else {
      dia = Fecha.getDate();
    }
    if (Fecha.getMonth() + 1 < 10) {
      mes = `0${Fecha.getMonth() + 1}`;
    } else {
      mes = Fecha.getMonth() + 1;
    }
    Fecha = `${año}-${mes}-${dia}`;

    for(i=0; i< solicitudesDevolucion.length; i++){
        montoSolicitud+= +solicitudesDevolucion[i].PrecioTotal
    }
    for(i=0; i< notasEntrega.length; i++){
        montoDocumentosPendientes = +montoDocumentosPendientes + +notasEntrega[i].Saldo
        if(notasEntrega[i].Vencimiento < Fecha){
            notasEntrega[i].clase = "text-danger"
            documentosVencidos++
            montoDocumentosVencidos = +montoDocumentosVencidos + +notasEntrega[i].Saldo
        }else{
            notasEntrega[i].clase = "text-dark"
        }
        notasEntrega[i].link = `/ver-nota-entrega/${notasEntrega[i].Numero}`
        notasEntrega[i].Tipo = "Nota de entrega" 
        facturasGeneral.push(notasEntrega[i])
    }
    let montoPorPagar = (+montoDocumentosPendientes - +montoSolicitud).toFixed(2)
    facturasGeneral.sort(function (a, b) {
        if (+a.Timestamp > +b.Timestamp) {
          return -1;
        }
        if (+a.Timestamp < +b.Timestamp) {
          return 1;
        }
        return 0;
    });
    facturasGeneral = facturasGeneral.map((data) => {
        return{
            Timestamp: data.Timestamp,
            Fecha: data.Fecha,
            Vencimiento: data.Vencimiento,
            Numero: data.Numero,
            Cliente: data.Cliente,
            Documento: data.Documento,
            Direccion: data.Direccion,
            Tipo: data.Tipo,
            clase: data.clase,
            Celular: data.Celular,
            Zona: data.Zona,
            Neto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Neto),
            Neto2: data.Neto2,
            Saldo: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Saldo),
            CantidadTotal: data.CantidadTotal,
            link: data.link,
            Vendedor: data.Vendedor,
            _idVendedor: data._idVendedor,
            PorcentajeGanancia: data.PorcentajeGanancia,
            GananciasVendedor: data.GananciasVendedor,
            EstadoComision: data.EstadoComision,
            Estado: data.Estado,
            Transporte: data.Transporte,
            EstadoTarifa: data.EstadoTarifa,
        }
    })


    montoPorPagar = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(montoPorPagar)
    montoDocumentosPendientes = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(montoDocumentosPendientes)
    montoDocumentosVencidos = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(montoDocumentosVencidos)

    res.render('client/estado-cuenta/cuentas-pendientes-cliente',{
        layout:"client.hbs",
        facturasGeneral,
        documentosPendientes,
        montoPorPagar,
        solicitudes,
        montoDocumentosPendientes,
        montoDocumentosVencidos,
        documentosVencidos,
    })
})


router.get('/ver-historial-pagos-client/:id', isAuthenticatedClient, async (req, res) => {
    let notaEntrega  = await notasEntregaDB.findOne({Numero:req.params.id})
    if(!notaEntrega){
        let factura = await facturasDB.findOne({Numero: req.params.id})
        let historialPagos = factura.HistorialPago 
        historialPagos = historialPagos.map((data) => {
            return{
                Pago: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Pago),
                Comentario: data.Comentario,
                Recibo: data.Recibo,
                Modalidad: data.Modalidad,
                FechaPago: data.FechaPago,
                user: data.user,
                Timestamp: data.Timestamp,
            }
        })
        historialPagos.sort(function (a, b) {
            if (+a.Timestamp > +b.Timestamp) {
              return -1;
            }
            if (+a.Timestamp < +b.Timestamp) {
              return 1;
            }
            return 0;
        });
        let data = {
            Numero: req.params.id,
            historialPagos: historialPagos
        }
        res.render('seller/estado-cuenta/historial-de-pagos',{
            layout: "client.hbs",
            data
        })
    }else{
        let historialPagos = notaEntrega.HistorialPago 
        historialPagos = historialPagos.map((data) => {
            return{
                Pago: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Pago),
                Comentario: data.Comentario,
                Recibo: data.Recibo,
                Modalidad: data.Modalidad,
                FechaPago: data.FechaPago,
                user: data.user,
                Timestamp: data.Timestamp,
            }
        })
        historialPagos.sort(function (a, b) {
            if (+a.Timestamp > +b.Timestamp) {
              return -1;
            }
            if (+a.Timestamp < +b.Timestamp) {
              return 1;
            }
            return 0;
        });
        let data = {
            Numero: req.params.id,
            historialPagos: historialPagos
        }
        res.render('seller/estado-cuenta/historial-de-pagos',{
            layout: "client.hbs",
            data
        })
    }
})


router.get('/calificacion-cliente', isAuthenticatedClient, async (req, res) => {
    let calificacion = await calificacionDB.findOne({user: req.user.email})
    let cliente = await clientesDB.findOne({email: req.user.email})
    if(!calificacion){
        let nuevaCalificacion = new calificacionDB({
            user: cliente.email ,
            Nombres: cliente.Nombres ,
            Apellidos: cliente.Apellidos ,
            Documento: cliente.Cedula ,
            TipoUsuario: "Cliente",
            _idPersona: cliente._id ,
        })
        await nuevaCalificacion.save()
        calificacion = await calificacionDB.findOne({user: req.user.email})
        let _id = calificacion._id
        let historiaCalificaciones = calificacion.HistorialCalificaciones.map((data) => {
            return{
                Puntos: data.Puntos,
                Calificacion: data.Calificacion,
                Motivo: data.Motivo,
                Fecha: data.Fecha,
                Timestamp: data.Timestamp,
            }
        })
        historiaCalificaciones.sort(function (a, b) {
            if (+a.Timestamp > +b.Timestamp) {
              return -1;
            }
            if (+a.Timestamp < +b.Timestamp) {
              return 1;
            }
            return 0;
        });

            
        res.render('client/estado-cuenta/calificacion',{
            layout:"client.hbs",
            _id,
            historiaCalificaciones
        })
    
    }else{

        let _id = calificacion._id
        let historiaCalificaciones = calificacion.HistorialCalificaciones.map((data) => {
            return{
                Puntos: data.Puntos,
                Calificacion: data.Calificacion,
                Motivo: data.Motivo,
                Fecha: data.Fecha,
                Timestamp: data.Timestamp,
            }
        })
        historiaCalificaciones.sort(function (a, b) {
            if (+a.Timestamp > +b.Timestamp) {
              return -1;
            }
            if (+a.Timestamp < +b.Timestamp) {
              return 1;
            }
            return 0;
        });
    
        res.render('client/estado-cuenta/calificacion',{
            layout:"client.hbs",
            _id,
            historiaCalificaciones
        })
    }

})

router.get('/perfil-cliente', isAuthenticatedClient, async (req, res) => {
    let usuario = await usersDB.findOne({email: req.user.email})
    usuario = {
        Nombres: usuario.Empresa,
        email: usuario.email,
        password: usuario.password,
        _id: usuario._id
    }
    res.render('client/perfil',{
        layout:"client.hbs",
        usuario
    })

})

router.post('/actualizar-datos-usuario-cliente/:id', isAuthenticatedClient, async (req, res) => {
    let {email, emailConfirm, password, passwordConfirm} = req.body
    if(email != emailConfirm){
        req.flash("error", "Los correos ingresados no coinciden. Por favor, valide e intente de nuevo")
        res.redirect('/perfil-cliente')
        return
    }
    if(password != passwordConfirm){
        req.flash("error", "Las contraseñas ingresadas no coinciden. Por favor, valide e intente de nuevo")
        res.redirect('/perfil-cliente')
        return
    }
    let validacionUsuario = await usersDB.findById(req.params.id)
    if(validacionUsuario.password == password){
        await usersDB.findByIdAndUpdate(validacionUsuario._id,{
            email: email
        })
        req.flash("success", "Usuario actualizado correctamente")
        res.redirect('/perfil-cliente')

    }else{
        let nuevoUsuario = new usersDB({
            password,
        })
        nuevoUsuario.password = await nuevoUsuario.encryptPassword(password);
        await usersDB.findByIdAndUpdate(validacionUsuario._id,{
            email: email,
            password: nuevoUsuario.password,
        })
        req.flash("success", "Usuario actualizado correctamente")
        res.redirect('/perfil-cliente')
    }
} )


router.get('/tareas-cliente', isAuthenticatedClient ,async (req, res) => {
    let email = req.user.email 
    let tareas = await tareasDB.find({$and: [{user: email}, {Estado: "Pendiente"}]}).sort({"Timestamp":-1})
    tareas = tareas.map((data) => {
        return{
            Timestamp: data.Timestamp,
            user: data.user,
            Nombres: data.Nombres,
            Empresa: data.Empresa,
            Apellidos: data.Apellidos,
            Documento: data.Documento,
            TipoUsuario: data.TipoUsuario,
            _idPersona: data._idPersona,
            FechaEntrega: data.FechaEntrega,
            Fecha: data.Fecha,
            FechaPospuesta: data.FechaPospuesta,
            Estado: data.Estado,
            Descripcion: data.Descripcion,
        }
    })
    res.render('client/tareas',{
        layout:"client.hbs",
        tareas
    })
})

router.get('/nueva-tarea-personal-cliente', isAuthenticatedClient, async (req, res) => {
    res.render('client/nueva-tarea',{
        layout:"client.hbs"
    })
})

router.post('/nueva-tarea-personal-cliente', isAuthenticatedClient, async (req, res) => {
    let {FechaEstimada, Descripcion}= req.body
    let Timestamp = Date.now();
    let Fecha = new Date();
    let dia;
    let mes;
    let año = Fecha.getFullYear();
    if (Fecha.getDate() < 10) {
      dia = `0${Fecha.getDate()}`;
    } else {
      dia = Fecha.getDate();
    }
    if (Fecha.getMonth() + 1 < 10) {
      mes = `0${Fecha.getMonth() + 1}`;
    } else {
      mes = Fecha.getMonth() + 1;
    }
    Fecha = `${año}-${mes}-${dia}`;
    let usuario = req.user.email
    let datosUsuario  
    if(usuario.TipoUsuario == "Vendedor"){
        let vendedor = await vendedoresDB.findOne({email: usuario})
        datosUsuario = {
            Nombres: vendedor.Nombres, 
            Apellidos: vendedor.Apellidos,
            Empresa: `${vendedor.Nombres} ${vendedor.Apellidos}`,
            Cedula: vendedor.Cedula,    
            _id: vendedor._id,
        }
    }
    if(usuario.TipoUsuario == "Cliente"){
        let cliente = await clientesDB.findOne({email: usuario})
        datosUsuario = {
            Nombres: cliente.Nombres, 
            Apellidos: cliente.Apellidos, 
            Empresa: cliente.Empresa, 
            Cedula: cliente.RIF,
            _id: cliente._id           
        }
        
    }
    if(usuario.TipoUsuario != "Cliente" && usuario.TipoUsuario != "Vendedor"){
        let user = await usersDB.findOne({email: usuario})
        datosUsuario = {
            Nombres: user.Nombres, 
            Apellidos: user.Apellidos, 
            Empresa: `${user.Nombres} ${user.Apellidos}`, 
            Cedula: user.Cedula,   
            _id: user._id         
        }
    }

    let nuevaTarea = new tareasDB({
        Timestamp: Timestamp,
        user: usuario,
        TipoTarea: "Personalizada",
        Empresa: datosUsuario.Empresa,
        Nombres: datosUsuario.Nombres,
        Apellidos:  datosUsuario.Apellidos,
        Documento:  datosUsuario.Cedula,
        TipoUsuario: "Administrativo",
        _idPersona: datosUsuario._id,
        FechaEntrega: FechaEstimada,
        Fecha:Fecha ,
        Descripcion: Descripcion,
    })
    await nuevaTarea.save()

    req.flash("success","Tarea generada correctamente")
    res.redirect('/nueva-tarea-personal-cliente')
})

router.get('/solicitar-devolucion-cliente', isAuthenticatedClient ,async (req, res) => {
    let clientes = await clientesDB.findOne({email: req.user.email})
    let solicitudesDevoluciones = await solicitudesDevolucionesDB.find({Cliente: clientes.Empresa}).sort({"Timestamp":-1})
    solicitudesDevoluciones = solicitudesDevoluciones.map((data) => {
        return{
            Fecha: data.Fecha,
            Timestamp: data.Timestamp,
            Cliente: data.Cliente,
            Vendedor: data.Vendedor,
            _idVendedor: data._idVendedor,
            CantidadTotal: data.CantidadTotal,
            PrecioTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotal),
            Estado: data.Estado,
            _id: data._id,
        }
    })

    res.render('client/solicitar-devolucion',{
        layout:"client.hbs",
        solicitudesDevoluciones 
    })
})


router.get('/realizar-solicitud-devolucion', isAuthenticatedClient, async (req, res) => {
    let codigos = []
    let cliente = await clientesDB.findOne({email: req.user.email})
    let notasEntrega = await notasEntregaDB.find({Cliente: cliente.Empresa}).sort({"Timestamp":-1})
    for(i=0; i< notasEntrega.length; i++){
        for(x=0; x < notasEntrega[i].Productos.length; x++){
            let validacion = codigos.find((data) => data == notasEntrega[i].Productos[x].Codigo)
            if(!validacion){
                codigos.push(notasEntrega[i].Productos[x].Codigo)
            }
        }
    }
    res.render('client/realizar-devolucion',{
        layout:"client.hbs",
        codigos
    })
})


router.post('/solciitar-codigos-generar-devolucion-cliente', isAuthenticatedClient, async (req, res) => {
    let codigos = []
    let cliente = await clientesDB.findOne({email: req.user.email})
    let notasEntrega = await notasEntregaDB.find({Cliente: cliente.Empresa}).sort({"Timestamp":-1})
    for(i=0; i< notasEntrega.length; i++){
        for(x=0; x < notasEntrega[i].Productos.length; x++){
            let validacion = codigos.find((data) => data == notasEntrega[i].Productos[x].Codigo)
            if(!validacion){
                codigos.push(notasEntrega[i].Productos[x].Codigo)
            }
        }
    }
    let infoCodigos = []
    for(i=0; i< codigos.length; i++){
        let producto = await productosDB.findOne({Codigo: codigos[i]})
        infoCodigos.push(producto)
    }
    res.send(JSON.stringify(infoCodigos))
})

router.post('/registrar-solicitud-devolucion-cliente', isAuthenticatedClient ,async (req, res) => {
    let {CantidadTotal, PrecioTotal, Productos} = req.body
    let cliente = await clientesDB.findOne({email: req.user.email})
    let Timestamp = Date.now();
    let Fecha = new Date();
    let dia;
    let mes;
    let año = Fecha.getFullYear();
    if (Fecha.getDate() < 10) {
      dia = `0${Fecha.getDate()}`;
    } else {
      dia = Fecha.getDate();
    }
    if (Fecha.getMonth() + 1 < 10) {
      mes = `0${Fecha.getMonth() + 1}`;
    } else {
      mes = Fecha.getMonth() + 1;
    }
    Fecha = `${año}-${mes}-${dia}`;


    let nuevaSolicitudDevolucion = new solicitudesDevolucionesDB({
        Fecha: Fecha,
        Timestamp: Timestamp,
        Cliente: cliente.Empresa,
        Vendedor: cliente.Vendedor,
        _idVendedor: cliente._idVendedor,
        CantidadTotal: CantidadTotal,
        PrecioTotal: PrecioTotal,
        Productos: Productos,
    })

    await nuevaSolicitudDevolucion.save()
    res.send(JSON.stringify("ok"))
    
})

router.get('/solicitar-garantia-cliente', isAuthenticatedClient,async (req, res) => {
    let cliente = await clientesDB.findOne({email: req.user.email})
    cliente = cliente.Empresa
    let garantias = await garantiasDB.find({Cliente: cliente}).sort({"Timestamp":-1})
    garantias = garantias.map((data) => {
        return{
            Timestamp: data.Timestamp,
            Fecha: data.Fecha,
            Codigo: data.Codigo,
            TipoProducto: data.TipoProducto,
            Cantidad: data.Cantidad,
            Valor: data.Valor,
            Cliente: data.Cliente,
            Vendedor: data.Vendedor,
            _idVendedor: data._idVendedor,
            Estado: data.Estado,
        }
    })
    res.render('client/solicitar-garantia',{
        layout:"client.hbs",
        garantias
    })
})


router.get('/realizar-solicitud-garantia-cliente', isAuthenticatedClient,async (req, res) => {
    let productos = await productosDB.find().sort({Codigo: 1})
    productos = productos.map((data) => {
        return{
            Codigo: data.Codigo
        }
    })
    res.render('client/realizar-solicitud-garantia',{
        layout:"client.hbs",
        productos
    })
})


router.post('/realizar-solicitud-garantia-cliente', isAuthenticatedClient, async (req, res) => {
    let {Codigo, Cantidad} = req.body
    let Timestamp = Date.now();
    let Fecha = new Date();
    let dia;
    let mes;
    let año = Fecha.getFullYear();
    if (Fecha.getDate() < 10) {
      dia = `0${Fecha.getDate()}`;
    } else {
      dia = Fecha.getDate();
    }
    if (Fecha.getMonth() + 1 < 10) {
      mes = `0${Fecha.getMonth() + 1}`;
    } else {
      mes = Fecha.getMonth() + 1;
    }
    Fecha = `${año}-${mes}-${dia}`;
    let cliente = await clientesDB.findOne({email: req.user.email})
    let vendedor = await vendedoresDB.findById(cliente._idVendedor)
    vendedor = `${vendedor.Nombres} ${vendedor.Apellidos}`
    let producto = await productosDB.findOne({Codigo:Codigo})
    let Valor = +producto.PrecioVenta * +Cantidad 

    let nuevaGarantia = new garantiasDB({
        Timestamp: Timestamp,
        Fecha: Fecha,
        Codigo: Codigo,
        TipoProducto: producto.TipoProducto,
        Cantidad: Cantidad,
        Valor: Valor,
        Cliente: cliente.Empresa,
        Vendedor: vendedor,
        _idVendedor: cliente._idVendedor,
    })
    await nuevaGarantia.save()
    req.flash("success", "Garantía enviada correctamente.")
    res.redirect('/realizar-solicitud-garantia-cliente')
})

router.get('/lista-de-productos-cliente',  isAuthenticatedClient ,async (req, res) => {
    res.render('seller/lista-productos',{
        layout:"client.hbs"
    })
}) 

router.get('/reportar-pago-cliente', isAuthenticatedClient, async (req, res) => {
    let Cliente = await clientesDB.findOne({email: req.user.email})
    let SaldoFavor = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(Cliente.SaldoFavor) 
    let solicitudesPago = await solicitudesPagoDB.find({Cliente: Cliente.Empresa}).sort({Timestamp: -1, Estado: 1})
    solicitudesPago = solicitudesPago.map((data) => {
        return{
            _id: data._id,
            Fecha: data.Fecha,
            Timestamp: data.Timestamp,
            SolicitadoPor: data.SolicitadoPor,
            Vendedor: data.Vendedor,
            _idVendedor: data._idVendedor,
            NumeroSolicitud: data.NumeroSolicitud,
            Estado: data.Estado,
            Transaccion: data.Transaccion,
            Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Monto),
            Modalidad: data.Modalidad,
            Comentario: data.Comentario,
            Cliente: data.Cliente,
            Documento: data.Documento,
            Direccion: data.Direccion,
            Celular: data.Celular,
        }
    })
    res.render('client/reportar-pago',{
        layout:"client.hbs",
        solicitudesPago,
        SaldoFavor
    })
})

router.get('/reportar-ingreso-cliente', isAuthenticatedClient, async (req, res) => {
    let Cliente = await clientesDB.findOne({email: req.user.email})
    let notasEntrega = await notasEntregaDB.find({$and: [{Estado:"Por pagar"},{Cliente: Cliente.Empresa}]}).sort({Numero: 1})
    Cliente = Cliente.Empresa
    notasEntrega = notasEntrega.map((data) => {
        return{
            Numero: data.Numero,
            Saldo: data.Saldo
        }
    })
    let pendienteAPagar = 0
    for(i=0; i < notasEntrega.length; i++){
        pendienteAPagar += +notasEntrega[i].Saldo
    }
    pendienteAPagar = pendienteAPagar.toFixed(2)
    pendienteAPagar = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(pendienteAPagar)
    res.render('client/realizar-pago',{
        layout:"client.hbs",
        Cliente,
        pendienteAPagar,
        notasEntrega
    })
})

router.post('/solicitar-monto-nota-entregas-cliente', isAuthenticatedClient, async (req, res) => {
    let {notaEntrega} = req.body
    let saldo = await notasEntregaDB.findOne({Numero:notaEntrega})
    saldo = saldo.Saldo
    res.send(JSON.stringify(saldo))

})

router.post('/registrar-nueva-solicitud-de-ingreso-client', isAuthenticatedClient ,async (req, res) => {
    let {Cliente, Modalidad, Transaccion, Monto, Comentario} = req.body
    let Timestamp = Date.now();
    let Fecha = new Date();
    let dia;
    let mes;
    let año = Fecha.getFullYear();
    if (Fecha.getDate() < 10) {
      dia = `0${Fecha.getDate()}`;
    } else {
      dia = Fecha.getDate();
    }
    if (Fecha.getMonth() + 1 < 10) {
      mes = `0${Fecha.getMonth() + 1}`;
    } else {
      mes = Fecha.getMonth() + 1;
    }
    Fecha = `${año}-${mes}-${dia}`;
    let datosCliente = await clientesDB.findOne({Empresa: Cliente})
    let solicitudesPago = await solicitudesPagoDB.find().sort({NumeroSolicitud: -1})
    let NumeroSolicitud = 0
    if(solicitudesPago.length == 0){
        NumeroSolicitud = 300000001
    }else{
        NumeroSolicitud = +solicitudesPago[0].NumeroSolicitud + 1
    }
    let nuevaSolicitud = new solicitudesPagoDB({
        Fecha: Fecha, 
        Timestamp: Timestamp, 
        SolicitadoPor: "Cliente", 
        Vendedor: datosCliente.Vendedor, 
        _idVendedor: datosCliente._idVendedor, 
        NumeroSolicitud: NumeroSolicitud, 
        Estado: "Pendiente", 
        Transaccion: Transaccion, 
        Monto: Monto, 
        Modalidad: Modalidad, 
        Comentario: Comentario, 
        Cliente: Cliente, 
        Documento: datosCliente.Documento, 
        Direccion: datosCliente.Direccion, 
        Celular: datosCliente.Celular, 
    })
    await nuevaSolicitud.save()
    req.flash("success", "Solicitud de pago enviada correctamente")
    res.redirect('/reportar-ingreso-cliente')
})

router.get('/ver-recibo-de-vueltos-clientes', isAuthenticatedClient ,async (req, res) => {
    let cliente = await clientesDB.findOne({email:req.user.email})
    let recibosVueltos = await recibosVueltosDB.find({Cliente: cliente.Empresa})
    recibosVueltos = recibosVueltos.map((data) => {
        return{
            Numero: data.Numero,
            Timestamp: data.Timestamp,
            Fecha: data.Fecha,
            Cliente: data.Cliente,
            Monto:  new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Monto),
        }
    })
    res.render('client/recibo-de-vuelto',{
        layout:"client.hbs",
        recibosVueltos
    })
})


router.get('/todas-las-compras', isAuthenticatedClient, async (req, res) => {
    let cliente = await clientesDB.findOne({email: req.user.email})
    let notas = await notasEntregaDB.find({Cliente: cliente.Empresa})
    let notasTotales = notas.length
    let netoTotal = 0
    let saldoTotal = 0
    for(i=0; i< notas.length; i++){
        netoTotal += +notas[i].Neto
        saldoTotal += +notas[i].Saldo
    }
    netoTotal = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotal) 
    saldoTotal = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(saldoTotal) 

    notas = notas.map((data) => {
        return{
            Timestamp: data.Timestamp,
            Fecha: data.Fecha,
            Vencimiento: data.Vencimiento,
            Numero: data.Numero,
            Factura: data.Factura,
            FacturaAsociada: data.FacturaAsociada,
            Cliente: data.Cliente,
            Documento: data.Documento,
            Direccion: data.Direccion,
            Celular: data.Celular,
            Zona: data.Zona,
            Neto:  new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Neto),
            Neto2: data.Neto2,
            Saldo: data.Saldo,
            CantidadTotal: data.CantidadTotal,
            Vendedor: data.Vendedor,
            _idVendedor: data._idVendedor,
            PorcentajeGanancia: data.PorcentajeGanancia,
            GananciasVendedor: data.GananciasVendedor,
            Comentario: data.Comentario,
            EstadoComision: data.EstadoComision,
            Estado: data.Estado,
            Transporte: data.Transporte,
            EstadoTarifa: data.EstadoTarifa,
        }
    })

    res.render('client/estado-cuenta/todas-compras-cliente',{
        layout:"client.hbs",
        notas,
        notasTotales,
        netoTotal,
        saldoTotal,
    })
})

router.get('/ver-historial-pagos-cliente/:id', isAuthenticatedClient, async (req, res) => {
    let notaEntrega  = await notasEntregaDB.findOne({Numero:req.params.id})
    if(!notaEntrega){
        let factura = await facturasDB.findOne({Numero: req.params.id})
        let historialPagos = factura.HistorialPago 
        historialPagos = historialPagos.map((data) => {
            return{
                Pago: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Pago),
                Comentario: data.Comentario,
                Recibo: data.Recibo,
                Modalidad: data.Modalidad,
                FechaPago: data.FechaPago,
                user: data.user,
                Timestamp: data.Timestamp,
            }
        })
        historialPagos.sort(function (a, b) {
            if (+a.Timestamp > +b.Timestamp) {
              return -1;
            }
            if (+a.Timestamp < +b.Timestamp) {
              return 1;
            }
            return 0;
        });
        let data = {
            Numero: req.params.id,
            historialPagos: historialPagos
        }
        res.render('seller/estado-cuenta/historial-de-pagos',{
            layout: "client.hbs",
            data
        })
    }else{
        let historialPagos = notaEntrega.HistorialPago 
        historialPagos = historialPagos.map((data) => {
            return{
                Pago: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Pago),
                Comentario: data.Comentario,
                Recibo: data.Recibo,
                Modalidad: data.Modalidad,
                FechaPago: data.FechaPago,
                user: data.user,
                Timestamp: data.Timestamp,
            }
        })
        historialPagos.sort(function (a, b) {
            if (+a.Timestamp > +b.Timestamp) {
              return -1;
            }
            if (+a.Timestamp < +b.Timestamp) {
              return 1;
            }
            return 0;
        });
        let data = {
            Numero: req.params.id,
            historialPagos: historialPagos
        }
        res.render('seller/estado-cuenta/historial-de-pagos',{
            layout: "client.hbs",
            data
        })
    }
})




module.exports = router
