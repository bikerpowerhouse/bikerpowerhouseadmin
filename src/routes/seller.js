const router = require("express").Router();
const path = require("path");
const passport = require('passport');
const productosDB = require('../models/productos');
const vendedoresDB = require('../models/vendedores')
const clientesDB = require('../models/clientes')
const bujiaDB = require('../models/bujias')

const facturasDB = require('../models/facturas')
const notasEntregaDB = require('../models/notasEntregas')
const ordenCompraTemporalSCDB = require('../models//seller/ordenCompraTemporalSC')
const ordenComprasClientesDB = require('../models//seller/ordenesCompra')
const reportesDB = require('../models//seller/reportes')
const usersDB = require('../models/users')
const tareasDB = require('../models/tareas')
const comisionesDB = require('../models/comisiones') 
const calificacionDB = require('../models/calificacion')
const solicitudesDevolucionesDB = require('../models/solicitudes-de-devoluciones')
const solicitudesClientesDB = require('../models/solicitudesClientes')
const garantiasDB = require('../models/garantias')
const bateriasDB = require('../models/baterias')
const bombasDB = require('../models/bombas')
const guardapolvosDB = require('../models/guardapolvos')
const baseAmortiguadoresDB = require('../models/base-amortiguadores')
const valvulasDB = require('../models/valvulas')
const amortiguadoresDB = require('../models/amortiguadores')
const solicitudesPagoDB = require('../models/solicitudes-de-pago')
const solicitudesEgresosDB = require('../models/solicitudes-egresos')
const notasComisionesDB = require('../models/notasComisiones')
const recibosVueltosDB = require('../models/recibosVuelto')
const calculoComisonDB = require('../models/calculosComision')
const { isAuthenticatedSeller } = require("../helpers/auth");
const { isAuthenticatedDuroc } = require("../helpers/auth");


router.get('/home-seller', isAuthenticatedSeller, async (req, res) => {
    let vendedor = await vendedoresDB.findOne({email: req.user.email})
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
    let notasEntregaVencida = await notasEntregaDB.find({$and :  [{Estado: "Por pagar"},{_idVendedor:vendedor._id},{Vencimiento: {$lte: Fecha}}]})
    let notasEntregaProximasVencer = await notasEntregaDB.find({$and : [{Estado: "Por pagar"},{_idVendedor:vendedor._id},{Vencimiento: {$gte: Fecha}}, {Vencimiento: {$lte: Fecha2}}]})
    
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
    res.render('seller/home-seller',{
        layout:"seller.hbs",
        notasEntregaProximasVencer,
        tareas, 
        nombres,
        notasEntregaVencida
    })
})

router.get('/realizar-compra-seller', isAuthenticatedSeller ,async (req, res) => {
    let productos = await productosDB.find().sort({"TipoProducto": 1})
    let vendedor = await vendedoresDB.findOne({email: req.user.email})
    let clientes = await clientesDB.find({_idVendedor: vendedor._id})
    clientes = clientes.map((data) => {
        return{
            Empresa: data.Empresa,
        }
    })
    let tiposProductos = []
    for(i=0; i< productos.length; i++ ){
        let validacion = tiposProductos.find((data) => data == productos[i].TipoProducto)
        if(!validacion){
            tiposProductos.push(productos[i].TipoProducto)
        }
    }
    res.render('seller/realizar-compra',{
        layout:"seller.hbs",
        clientes,
        tiposProductos
    })
})

router.post('/solicitar-productos-realizar-compra', isAuthenticatedDuroc, async (req, res) => {
    let {TipoProducto} = req.body
    let producto = await productosDB.find({TipoProducto:TipoProducto}).sort({"Codigo":1})
    res.send(JSON.stringify(producto))

})

router.post('/enviar-productos-orden-compra', isAuthenticatedSeller, async (req, res) => {
    let {Codigo, TipoProducto, PrecioFOBUnitario, Cantidad, PrecioFOBTotal, MetrosCubicosUnidad, 
        MetrosCubicosTotal, PesoUnidad, PesoTotal, Descripcion, Cliente} = req.body
    let datosCliente = await clientesDB.findOne({Empresa: Cliente})
    let DiasCredito = datosCliente.MaximoCredito
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
    let ordenCompraTemporalSC = await ordenCompraTemporalSCDB.find({$and: [{SolicitadoPor: req.user.TipoUsuario},{Cliente:Cliente}]})
    if(ordenCompraTemporalSC.length == 0){
        let validacionNumero = await ordenCompraTemporalSCDB.find()
        let Numero = 0
        if(validacionNumero.length == 0){
            Numero = 5000001
        }else{
            Numero = +validacionNumero.Numero + 1
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
            DiasCredito:DiasCredito,
            Cliente: Cliente,
            Vendedor: req.user.Empresa,
            _idUsuarioVendedor : req.user._id,
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

router.get('/ver-lista-compra-vendedor', isAuthenticatedSeller, async (req, res) => {
    let ordenCompraTemporalSC = await ordenCompraTemporalSCDB.find({_idUsuarioVendedor: req.user._id}).sort({"Cliente": 1})
    let clientes = ordenCompraTemporalSC.map((data) => {
        return{
            Cliente: data.Cliente
        }
    })
    res.render('seller/ver-lista-compras',{
        clientes,
        layout:"seller.hbs"
    })
})

router.post('/solicitar-orden-compra-cliente', isAuthenticatedSeller, async (req, res) => {
    let {Cliente} = req.body
    let ordenCompraTemporalCliente = await ordenCompraTemporalSCDB.findOne({$and:[{_idUsuarioVendedor: req.user._id}, {Cliente: Cliente}]})
    res.send(JSON.stringify(ordenCompraTemporalCliente))
})

router.post('/cambiando-cantidad-orden-temporal-cliente', isAuthenticatedSeller,async (req, res) => {
    let {MetrosCubicos, Peso, CantidadTotal, PrecioTotal, Producto, Cliente}= req.body

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

router.get('/generar-orden-compra-cliente/:id', isAuthenticatedSeller, async (req, res) => {
    let Timestamp = Date.now();
    let Fecha = new Date();
    let dia;
    let mes;
    let año = Fecha.getFullYear();
    let ordenComprasClientes = await ordenComprasClientesDB.find().sort({"Timestamp": -1})
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
    res.redirect('/realizar-compra-seller')

})


router.post('/eliminar-codigo-orden-temporal-cliente', isAuthenticatedSeller, async (req, res) => {
    let {Codigo, Cliente} = req.body
    let ordenCompraTemporalSC = await ordenCompraTemporalSCDB.find({Cliente:Cliente})
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



router.get('/reportar-pago', isAuthenticatedSeller, async (req, res) => {
    let vendedor = await vendedoresDB.findOne({email: req.user.email})
    let clientes = await clientesDB.find({_idVendedor: vendedor._id})
    let reportes = await reportesDB.find({email: req.user.email}).sort({"Timestamp":-1})
    reportes = reportes.map((data) => {
        return{
            Fecha: data.Fecha,
            Timestamp: data.Timestamp,
            Vendedor: data.Vendedor,
            email: data.email,
            _idVendedor: data._idVendedor,
            _idUsuario: data._idUsuario,
            Tipo: data.Tipo,
            Comentario: data.Comentario,
            Cliente: data.Cliente,
            Monto: data.Monto,
        }
    })
    clientes = clientes.map((data) => {
        return{
            Empresa: data.Empresa,
        }
    })
    res.render('seller/reportar-pagos',{
        clientes,
        reportes,
        layout:"seller.hbs"
    })
})

router.post('/generar-nuevo-reporte', isAuthenticatedSeller, async (req, res) => {
    let {Tipo, Cliente, Monto, Comentario} = req.body
    let vendedor = await vendedoresDB.findOne({email: req.user.email})
    let usuario = await usersDB.findOne({email: req.user.email})
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
    
    let nuevoReporte = new reportesDB({
        Fecha: Fecha, 
        Timestamp: Timestamp, 
        Vendedor: `${vendedor.Nombres} ${vendedor.Apellidos}`, 
        email: req.user.email, 
        _idVendedor: vendedor._id, 
        _idUsuario: usuario._id, 
        Tipo: Tipo, 
        Comentario: Comentario, 
        Cliente: Cliente, 
        Monto: Monto, 
    })
    await nuevoReporte.save()
    req.flash("success", "Reporte registrado correctamente")
    res.redirect("/reportar-pago")

})

router.get('/ordenes-de-compras-vendedores', isAuthenticatedSeller, async (req, res) => {
    let usuario = await usersDB.findOne({email: req.user.email})
    let ordenes = await ordenComprasClientesDB.find({_idUsuarioVendedor: usuario._id})
    let ordenesAtendidas = await ordenComprasClientesDB.find({$and : [{Estado: {$ne: "En proceso"}}, {_idUsuarioVendedor: usuario._id}]})
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

    res.render('seller/estado-cuenta/ver-ordenes-compra',{
        ordenes,
        montoOrdenesAtendidas,
        montoOrdenesGeneradas,
        ordenesAtendidas,
        ordenesGeneradas,
        layout:"seller.hbs"
    })

})


router.get('/cuentas-pendientes-vendedor', isAuthenticatedSeller ,async (req, res) => {
    let email = req.user.email
    let vendedor = await vendedoresDB.findOne({email:email})
    let solicitudesDevolucion = await solicitudesDevolucionesDB.find({$and: [{Estado: "Aceptado en proceso"}, {_idVendedor: vendedor._id}]})
    let solicitudes = solicitudesDevolucion.length
    let clientes = await clientesDB.find({_idVendedor: vendedor._id})
    let notasEntrega = await notasEntregaDB.find({$and:[{_idVendedor: vendedor._id}, {Estado:"Por pagar"}]}).sort({"Timestamp": -1})
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

    clientes = clientes.map((data) => {
        return{
            Empresa: data.Empresa
        }
    })
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
            Vendedor: data.Vendedor,
            link: data.link,
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

    res.render('seller/estado-cuenta/cuentas-pendientes-vendedor',{
        layout:"seller.hbs",
        facturasGeneral,
        montoPorPagar,
        solicitudes,
        documentosPendientes,
        montoDocumentosPendientes,
        montoDocumentosVencidos,
        documentosVencidos,
        clientes
    })
})


router.post('/solicitar-facturas-cliente', isAuthenticatedSeller, async (req, res) => {
    let {Cliente} = req.body
    let solicitudesDevolucion = await solicitudesDevolucionesDB.find({$and: [{Estado: "Aceptado en proceso"}, {Cliente: Cliente}]})
    let notasEntrega = await notasEntregaDB.find({$and:[{Cliente: Cliente}, {Estado:"Por pagar"}]}).sort({"Timestamp": -1})
    let solicitudes = solicitudesDevolucion.length
    let facturasGeneral = []
    let documentosPendientes = notasEntrega.length
    let documentosVencidos = 0
    let montoSolicitud = 0
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
            clase: data.clase,
            Cliente: data.Cliente,
            Documento: data.Documento,
            Direccion: data.Direccion,
            Tipo: data.Tipo,
            Celular: data.Celular,
            Zona: data.Zona,
            Neto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Neto),
            Neto2: data.Neto2,
            Saldo: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Saldo),
            CantidadTotal: data.CantidadTotal,
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

    let data = {
        montoDocumentosPendientes,
        montoDocumentosVencidos,
        montoPorPagar,
        solicitudes,
        documentosPendientes,
        documentosVencidos,
        facturasGeneral
    }
    res.send(JSON.stringify(data))
})

router.get('/ver-historial-pagos/:id', isAuthenticatedSeller, async (req, res) => {
    let notaEntrega  = await notasEntregaDB.findOne({Numero:req.params.id})
    let Numero = notaEntrega.Numero
    let historial = notaEntrega.HistorialPago.map((data) => {
        if(data.Modalidad == "Pago"){
            return{
                Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Pago),
                Comentario: data.Comentario,
                Recibo: data.Recibo,
                Modalidad: data.Modalidad,
                Fecha: data.FechaPago,
                user: data.user,
                Timestamp: data.Timestamp,
                link: `/ver-nota-de-pago/${data.Recibo}`
            }
        }else{
            return{
                Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Pago),
                Comentario: data.Comentario,
                Recibo: data.Recibo,
                Modalidad: data.Modalidad,
                Fecha: data.FechaPago,
                user: data.user,
                Timestamp: data.Timestamp,
                link: `/ver-recibo-devolucion/${data.Recibo}`
            }
        }
    })
    historial.sort(function (a, b) {
        if (+a.Timestamp > +b.Timestamp) {
          return -1;
        }
        if (+a.Timestamp < +b.Timestamp) {
          return 1;
        }
        return 0;
    });

    res.render('seller/estado-cuenta/historial-de-pagos',{
        layout: "seller.hbs",
        Numero,
        historial
    })
})

router.get('/comisiones-vendedor', isAuthenticatedSeller, async (req, res) => {
    let email = req.user.email
    let vendedor = await vendedoresDB.findOne({email:email})
    let notasComisiones = await notasComisionesDB.find({_idVendedor: vendedor._id})
    let notasEntregaGeneral = await notasEntregaDB.find({_idVendedor: vendedor._id})
    let cantidadGeneralNotas = notasEntregaGeneral.length
    let comisionTotalGenerada = 0
    for(i=0; i< notasEntregaGeneral.length; i++){
        comisionTotalGenerada += +notasEntregaGeneral[i].GananciasVendedor 
    }
    comisionTotalGenerada = comisionTotalGenerada.toFixed(2)
    let notasEntrega = await notasEntregaDB.find({$and: [{Estado: "Cerrada"},{EstadoComision: "Por pagar"}, {_idVendedor: vendedor._id}]})
    let documentosPendientes = notasEntrega.length 
    let comisionPendiente = 0
    for(i=0; i< notasComisiones.length; i++){
        comisionPendiente += +notasComisiones[i].MontoCancelado
    }
    comisionPendiente = comisionPendiente.toFixed(2)
    notasComisiones = notasComisiones.map((data) => {
        return{
            Numero: data.Numero,
            Timestamp: data.Timestamp,
            Fecha: data.Fecha,
            Vendedor: data.Vendedor,
            _idVendedor: data._idVendedor,
            CantidadTotalDocumentos: data.CantidadTotalDocumentos,
            MontoCancelado: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.MontoCancelado),
            ValorTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.ValorTotal),
            Pendiente: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Pendiente),
            _id: data._id,
        }
    })
    comisionPendiente = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(comisionPendiente)
    comisionTotalGenerada = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(comisionTotalGenerada)
    res.render('seller/estado-cuenta/comisiones',{
        notasComisiones,
        cantidadGeneralNotas,
        documentosPendientes,
        comisionTotalGenerada,
        comisionPendiente,
        layout:"seller.hbs"
    })
})

router.post('/solicitar-comisiones-vendedor', isAuthenticatedSeller, async (req, res) => {
    let {Estado} = req.body
    let email = req.user.email
    let vendedor = await vendedoresDB.findOne({email:email})
    let comisiones = await comisionesDB.find({$and : [{_idVendedor: vendedor._id}, {Estado: Estado}]}).sort({"Timestamp":-1})
    let documentosEmitidos = comisiones.length
    let documentoPendientesPago =comisiones.length
    let ComisionTotalGenerada = 0
    let ComisionPendientePago = 0
    if(Estado == "Pendiente"){
        for(i=0; i< comisiones.length; i++){
            ComisionTotalGenerada += comisiones[i].SaldoComision
            ComisionPendientePago += comisiones[i].SaldoComision
        }
    }else{
        documentoPendientesPago = 0
    }
    ComisionTotalGenerada = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(ComisionTotalGenerada)
    ComisionPendientePago = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(ComisionPendientePago)
    comisiones = comisiones.map((data) => {
        return{
            Timestamp: data.Timestamp,
            Fecha: data.Fecha,
            NumeroComision: data.NumeroComision,
            NumeroFactura: data.NumeroFactura,
            PrecioFactura: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioFactura),
            PorcentajeGanancia: data.PorcentajeGanancia,
            Comision: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Comision),
            _idVendedor: data._idVendedor,
            Nombres: data.Nombres,
            Apellidos: data.Apellidos,
            Zona: data.Zona,
            Cliente: data.Cliente,
            Estado: data.Estado,
            SaldoComision: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.SaldoComision),
            _id: data._id,
        }
    })

    let data = {
        documentosEmitidos,
        documentoPendientesPago,
        ComisionTotalGenerada,
        ComisionPendientePago,
        comisiones,
    }
    res.send(JSON.stringify(data))
})


router.post('/solicitar-ordenes-compras-vendedor', isAuthenticatedSeller,async (req, res) => {
    let {Estado} = req.body
    let usuario = await usersDB.findOne({email: req.user.email})
    let ordenes = await ordenComprasClientesDB.find({$and : [{_idUsuarioVendedor: usuario._id}, {Estado:Estado}]})
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


router.get('/calificacion-vendedor', isAuthenticatedSeller ,async (req, res) => {
    let calificacion = await calificacionDB.findOne({user: req.user.email})
    let vendedor = await vendedoresDB.findOne({email: req.user.email})
    if(!calificacion){
        let nuevaCalificacion = new calificacionDB({
            user: req.user.email ,
            Nombres: vendedor.Nombres ,
            Apellidos: vendedor.Apellidos ,
            Documento: vendedor.Cedula ,
            TipoUsuario: "Vendedor",
            _idPersona: vendedor._id ,
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
        res.render('seller/estado-cuenta/calificacion',{
            layout:"seller.hbs",
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
        res.render('seller/estado-cuenta/calificacion',{
            layout:"seller.hbs",
            _id,
            historiaCalificaciones
        })
    }
})

router.get('/perfil-vendedor', isAuthenticatedSeller, async (req, res) => {
    let usuario = await usersDB.findOne({email: req.user.email})
    usuario = {
        Nombres: usuario.Empresa,
        email: usuario.email,
        password: usuario.password,
        _id: usuario._id
    }
    res.render('seller/perfil',{
        layout:"seller.hbs",
        usuario
    })

})

router.get('/tareas-vendedor', isAuthenticatedSeller ,async (req, res) => {
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
    res.render('seller/tareas',{
        layout:"seller.hbs",
        tareas
    })
})


router.get('/nueva-tarea-personal-vendedor', isAuthenticatedSeller, async (req, res) => {
    res.render('seller/nueva-tarea',{
        layout:"seller.hbs"
    })
})

router.post('/actualizar-datos-usuario-vendedor/:id', isAuthenticatedSeller, async (req, res) => {
    let {email, emailConfirm, password, passwordConfirm} = req.body
    if(email != emailConfirm){
        req.flash("error", "Los correos ingresados no coinciden. Por favor, valide e intente de nuevo")
        res.redirect('/perfil-vendedor')
        return
    }
    if(password != passwordConfirm){
        req.flash("error", "Las contraseñas ingresadas no coinciden. Por favor, valide e intente de nuevo")
        res.redirect('/perfil-vendedor')
        return
    }
    let validacionUsuario = await usersDB.findById(req.params.id)
    if(validacionUsuario.password == password){
        await usersDB.findByIdAndUpdate(validacionUsuario._id,{
            email: email
        })
        req.flash("success", "Usuario actualizado correctamente")
        res.redirect('/perfil-vendedor')

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
        res.redirect('/perfil-vendedor')
    }
} )

router.post('/nueva-tarea-personal-vendedor', isAuthenticatedSeller, async (req, res) => {
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
    res.redirect('/nueva-tarea-personal-vendedor')
})

router.get('/solicitar-devolucion-vendedor', isAuthenticatedSeller ,async (req, res) => {
    let vendedor = await vendedoresDB.findOne({email: req.user.email})
    let solicitudesDevoluciones = await solicitudesDevolucionesDB.find({_idVendedor: vendedor._id}).sort({"Timestamp":-1})
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

    res.render('seller/solicitar-devolucion',{
        layout:"seller.hbs",
        solicitudesDevoluciones 
    })
})

router.get('/realizar-solicitud-devolucion-vendedor', isAuthenticatedSeller, async (req, res) => {
    let codigos = []
    let vendedor = await vendedoresDB.findOne({email: req.user.email})
    let clientes = await clientesDB.find({_idVendedor: vendedor._id})
    clientes= clientes.map((data) => {
        return{
            Empresa:data.Empresa,
        }
    })
    let notasEntrega = await notasEntregaDB.find({_idVendedor: vendedor._id}).sort({"Timestamp":-1})
    for(i=0; i< notasEntrega.length; i++){
        for(x=0; x < notasEntrega[i].Productos.length; x++){
            let validacion = codigos.find((data) => data == notasEntrega[i].Productos[x].Codigo)
            if(!validacion){
                codigos.push(notasEntrega[i].Productos[x].Codigo)
            }
        }
    }
    res.render('seller/realizar-devolucion',{
        layout:"seller.hbs",
        clientes,
        codigos
    })
})

router.post('/solciitar-codigos-generar-devolucion-vendedor', isAuthenticatedSeller, async (req, res) => {
    let codigos = []
    let vendedor = await vendedoresDB.findOne({email: req.user.email})
    let notasEntrega = await notasEntregaDB.find({_idVendedor: vendedor._id}).sort({"Timestamp":-1})
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

router.post('/registrar-solicitud-devolucion-vendedor', isAuthenticatedSeller ,async (req, res) => {
    let {CantidadTotal, PrecioTotal, Productos, Cliente} = req.body
    let cliente = await clientesDB.findOne({Empresa: Cliente})
    let vendedor = await vendedoresDB.findOne({email: req.user.email})
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
        Cliente: Cliente,
        Vendedor: cliente.Vendedor,
        _idVendedor: cliente._idVendedor,
        CantidadTotal: CantidadTotal,
        PrecioTotal: PrecioTotal,
        Productos: Productos,
    })

    await nuevaSolicitudDevolucion.save()
    res.send(JSON.stringify("ok"))
})


router.get('/registrar-cliente-seller',  isAuthenticatedSeller ,async (req, res) => {
    let vendedores = await vendedoresDB.findOne({email: req.user.email})
    vendedores =  {
            Nombres: vendedores.Nombres,
            Apellidos: vendedores.Apellidos,
            _id: vendedores._id,
    }
    res.render('seller/registrar-clientes',{
        layout:"seller.hbs",
        vendedores
    })
})

router.post('/registrar-nuevo-cliente-seller/:id', isAuthenticatedDuroc ,async (req, res) => {
    let Vendedor = req.params.id
    let {Nombres, Apellidos, Cedula, Empresa, RIF, Direccion, Celular, CodigoCeular, Telefono, CodigoTelefono, email, Zona, CodigoPostal,
        MaximoCredito} = req.body
    let errors = []
    console.log(Vendedor)
    if(!Nombres || Nombres == "" || Nombres == 0){
        errors.push({text: 'El campo "Nombres" no puede estar vacío.'})
    }
    if(!Apellidos || Apellidos == "" || Apellidos == 0){
        errors.push({text: 'El campo "Apellidos" no puede estar vacío.'})
    }
    if(!Cedula || Cedula == "" || Cedula == 0){
        errors.push({text: 'El campo "Cedula" no puede estar vacío.'})
    }
    if(!Empresa || Empresa == "" || Empresa == 0){
        errors.push({text: 'El campo "Empresa o negocio" no puede estar vacío.'})
    }
    if(!RIF || RIF == "" || RIF == 0){
        errors.push({text: 'El campo "RIF" no puede estar vacío.'})
    }
    if(!Direccion || Direccion == "" || Direccion == 0){
        errors.push({text: 'El campo "Dirección fiscal" no puede estar vacío.'})
    }
    if(!Celular || Celular == "" || Celular == 0){
        errors.push({text: 'El campo "Número celular" no puede estar vacío.'})
    }
    if(!email || email == "" || email == 0){
        errors.push({text: 'El campo "Correo electronico" no puede estar vacío.'})
    }
    if(!Zona || Zona == "" || Zona == 0){
        errors.push({text: 'El campo "Zona" no puede estar vacío.'})
    }
    if(!CodigoPostal || CodigoPostal == "" || CodigoPostal == 0){
        errors.push({text: 'El campo "Código postal" no puede estar vacío.'})
    }
    if(!MaximoCredito || MaximoCredito == "" || MaximoCredito == 0){
        errors.push({text: 'El campo "Días de credito" no puede estar vacío.'})
    }
    if(!Vendedor || Vendedor == "" || Vendedor == 0){
        errors.push({text: 'El campo "Vendedor" no puede estar vacío.'})
    }if(errors.length > 0){
        let vendedores = await vendedoresDB.find({email: req.user.email})
        vendedores = vendedores.map((data) => {
            return{
                Nombres: data.Nombres,
                Apellidos: data.Apellidos,
                _id: data._id,
            }
        })
        res.render('seller/registrar-clientes',{
            vendedores, 
            errors, 
            Nombres, 
            Apellidos, 
            Cedula, 
            Empresa, 
            RIF, 
            Direccion, 
            Celular, 
            MaximoCredito,
            Telefono, 
            email, 
            Zona, 
            CodigoPostal, 
            Vendedor

        })
    }else{
        let _idVendedor = Vendedor
        let vendedorBuscar = await vendedoresDB.findById(Vendedor)
        Vendedor =  `${vendedorBuscar.Nombres} ${vendedorBuscar.Apellidos}`
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

        if(!Telefono){
            let nuevoCliente = new solicitudesClientesDB({
                Fecha,
                Nombres, 
                Apellidos, 
                CodigoCeular, 
                Cedula, 
                Empresa, 
                RIF, 
                Direccion, 
                MaximoCredito,
                Celular, 
                email, 
                Zona, 
                CodigoPostal, 
                _idVendedor,
                Vendedor
            })
            await nuevoCliente.save()

        }else{
            let nuevoCliente = new solicitudesClientesDB({
                Fecha,
                Nombres, 
                Apellidos, 
                CodigoCeular, 
                CodigoTelefono, 
                Cedula, 
                Empresa, 
                RIF, 
                Direccion, 
                MaximoCredito,
                Celular, 
                Telefono, 
                email, 
                Zona, 
                CodigoPostal, 
                _idVendedor,
                Vendedor
            })
            await nuevoCliente.save()
        }
        req.flash("success","Solicitud enviada correctamente")
        res.redirect('/registrar-cliente-seller')
    }

})


router.get('/solicitar-garantia-vendedor', isAuthenticatedSeller, async (req, res) => {
    let vendedor = await vendedoresDB.findOne({email: req.user.email})
    let garantias = await garantiasDB.find({_idVendedor: vendedor._id}).sort({"Timestamp":-1})
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
    res.render('seller/solicitar-garantia',{
        layout:"seller.hbs",
        garantias
    })
})

router.get('/realizar-solicitud-garantia-vendedor', isAuthenticatedSeller, async (req, res) => {
    let vendedor = await vendedoresDB.findOne({email: req.user.email})
    let productos = await productosDB.find().sort({Codigo: 1})
    let clientes = await clientesDB.find({_idVendedor: vendedor._id}).sort({"Empresa":1})
    productos = productos.map((data) => {
        return{
            Codigo: data.Codigo
        }
    })
    clientes = clientes.map((data) => {
        return{
            Empresa: data.Empresa
        }
    })
    res.render('seller/realizar-solicitud-garantia',{
        layout:"seller.hbs",
        productos,
        clientes
    })
})



router.post('/realizar-solicitud-garantia-vendedor', isAuthenticatedSeller ,async (req, res) => {
    let {Cliente, Codigo, Cantidad} = req.body
    let vendedor = await vendedoresDB.findOne({email: req.user.email})
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
    let producto = await productosDB.findOne({Codigo:Codigo})
    let Valor = +producto.PrecioVenta * +Cantidad 

    let nuevaGarantia = new garantiasDB({
        Timestamp: Timestamp,
        Fecha: Fecha,
        Codigo: Codigo,
        TipoProducto: producto.TipoProducto,
        Cantidad: Cantidad,
        Valor: Valor,
        Cliente: Cliente,
        Vendedor: `${vendedor.Nombres} ${vendedor.Apellidos}`,
        _idVendedor: vendedor._id,
    })
    await nuevaGarantia.save()
    req.flash("success", "Garantía enviada correctamente.")
    res.redirect('/realizar-solicitud-garantia-vendedor')
})

router.get('/lista-de-productos',  isAuthenticatedSeller ,async (req, res) => {
    res.render('seller/lista-productos',{
        layout:"seller.hbs"
    })
})

router.post('/solicitar-productos-lista', isAuthenticatedDuroc, async (req, res) => {
    let {TipoVehiculo} = req.body
    let productos 
    if(TipoVehiculo == "General"){
        productos = await productosDB.find().sort({TipoVehiculo : 1, TipoProducto: 1, Codigo: 1 })
        productos = productos.map((data) => {
            if(data.Cantidad == 0){
                if(data.CantidadTransito == 0){
                    return{
                        Codigo: data.Codigo,
                        Referencia: data.Referencia,
                        PrecioFOB: data.PrecioFOB,
                        PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                        Cantidad: data.Cantidad,
                        MarcaProducto: data.MarcaProducto,
                        Proveedor: data.Proveedor,
                        Descripcion: data.Descripcion,
                        Bulto: data.Bulto,
                        Semaforo: "Rojo",
                        TipoVehiculo: data.TipoVehiculo,
                        TipoProducto: data.TipoProducto,
                        CantidadVendida: data.CantidadVendida,
                        CantidadTransito: data.CantidadTransito,
                        CantidadProduccion: data.CantidadProduccion,
                        Alto: data.Alto,
                        Largo: data.Largo,
                        Ancho: data.Ancho,
                        Peso: data.Peso,
                    }
                }else{
                    return{
                        Codigo: data.Codigo,
                        Referencia: data.Referencia,
                        PrecioFOB: data.PrecioFOB,
                        PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                        Cantidad: data.Cantidad,
                        MarcaProducto: data.MarcaProducto,
                        Proveedor: data.Proveedor,
                        Descripcion: data.Descripcion,
                        Semaforo: "Amarillo",
                        Bulto: data.Bulto,
                        TipoVehiculo: data.TipoVehiculo,
                        TipoProducto: data.TipoProducto,
                        CantidadVendida: data.CantidadVendida,
                        CantidadTransito: data.CantidadTransito,
                        CantidadProduccion: data.CantidadProduccion,
                        Alto: data.Alto,
                        Largo: data.Largo,
                        Ancho: data.Ancho,
                        Peso: data.Peso,
                    }
                }
            }else{
                return{
                    Codigo: data.Codigo,
                    Referencia: data.Referencia,
                    PrecioFOB: data.PrecioFOB,
                    PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                    Cantidad: data.Cantidad,
                    MarcaProducto: data.MarcaProducto,
                    Proveedor: data.Proveedor,
                    Descripcion: data.Descripcion,
                    Bulto: data.Bulto,
                    TipoVehiculo: data.TipoVehiculo,
                    TipoProducto: data.TipoProducto,
                    Semaforo: "Verde",
                    CantidadVendida: data.CantidadVendida,
                    CantidadTransito: data.CantidadTransito,
                    CantidadProduccion: data.CantidadProduccion,
                    Alto: data.Alto,
                    Largo: data.Largo,
                    Ancho: data.Ancho,
                    Peso: data.Peso,
                }

            }
        })
    }else{
        productos = await productosDB.find({TipoVehiculo: TipoVehiculo}).sort({TipoVehiculo : 1, TipoProducto: 1, Codigo: 1 })
        productos = productos.map((data) => {
            if(data.Cantidad == 0){
                if(data.CantidadTransito == 0){
                    return{
                        Codigo: data.Codigo,
                        Referencia: data.Referencia,
                        PrecioFOB: data.PrecioFOB,
                        PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                        Cantidad: data.Cantidad,
                        MarcaProducto: data.MarcaProducto,
                        Proveedor: data.Proveedor,
                        Descripcion: data.Descripcion,
                        Bulto: data.Bulto,
                        Semaforo: "Rojo",
                        TipoVehiculo: data.TipoVehiculo,
                        TipoProducto: data.TipoProducto,
                        CantidadVendida: data.CantidadVendida,
                        CantidadTransito: data.CantidadTransito,
                        CantidadProduccion: data.CantidadProduccion,
                        Alto: data.Alto,
                        Largo: data.Largo,
                        Ancho: data.Ancho,
                        Peso: data.Peso,
                    }
                }else{
                    return{
                        Codigo: data.Codigo,
                        Referencia: data.Referencia,
                        PrecioFOB: data.PrecioFOB,
                        PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                        Cantidad: data.Cantidad,
                        MarcaProducto: data.MarcaProducto,
                        Proveedor: data.Proveedor,
                        Descripcion: data.Descripcion,
                        Semaforo: "Amarillo",
                        Bulto: data.Bulto,
                        TipoVehiculo: data.TipoVehiculo,
                        TipoProducto: data.TipoProducto,
                        CantidadVendida: data.CantidadVendida,
                        CantidadTransito: data.CantidadTransito,
                        CantidadProduccion: data.CantidadProduccion,
                        Alto: data.Alto,
                        Largo: data.Largo,
                        Ancho: data.Ancho,
                        Peso: data.Peso,
                    }
                }
            }else{
                return{
                    Codigo: data.Codigo,
                    Referencia: data.Referencia,
                    PrecioFOB: data.PrecioFOB,
                    PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                    Cantidad: data.Cantidad,
                    MarcaProducto: data.MarcaProducto,
                    Proveedor: data.Proveedor,
                    Descripcion: data.Descripcion,
                    Bulto: data.Bulto,
                    TipoVehiculo: data.TipoVehiculo,
                    TipoProducto: data.TipoProducto,
                    Semaforo: "Verde",
                    CantidadVendida: data.CantidadVendida,
                    CantidadTransito: data.CantidadTransito,
                    CantidadProduccion: data.CantidadProduccion,
                    Alto: data.Alto,
                    Largo: data.Largo,
                    Ancho: data.Ancho,
                    Peso: data.Peso,
                }

            }
        })
    }
    res.send(JSON.stringify(productos))
})


router.get('/descargar-lista-excel-auto', isAuthenticatedDuroc, async (req, res) => {
    const xl = require("excel4node");
    const wb = new xl.Workbook();
    const title = wb.createStyle({
        font: {
        color: "#ffffff",
        size: 15,
        },
        alignment: {
        wrapText: true,
        horizontal: 'center',
        },
        fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#198754",
        fgColor: "#198754",
        },
    });
    const headers3 = wb.createStyle({
        font: {
        color: "#ffffff",
        size: 11,
        },
        fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#15A204",
        fgColor: "#15A204",
        },
    });
    const headers2 = wb.createStyle({
        font: {
        color: "#ffffff",
        size: 11,
        },
        fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#343a40",
        fgColor: "#343a40",
        },
    });
    const lineasRoja = wb.createStyle({
        font: {
        color: "#000000",
        size: 11,
        },
        fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ff0000",
        fgColor: "#ff0000",
        },
    });
    const lineas = wb.createStyle({
        font: {
        color: "#000000",
        size: 11,
        },
        fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ffffff",
        fgColor: "#ffffff",
        },
    });
    let productosBujias = await productosDB.find({$and:  [{TipoProducto : "Bujia"},{TipoVehiculo: "Auto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosAmortiguadores = await productosDB.find({$and:  [{TipoProducto : "Amortiguador"},{TipoVehiculo: "Auto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosBases = await productosDB.find({$and:  [{TipoProducto : "Base amortiguador"},{TipoVehiculo: "Auto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosBaterias = await productosDB.find({$and:  [{TipoProducto : "Bateria"},{TipoVehiculo: "Auto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosBombas = await productosDB.find({$and:  [{TipoProducto : "Bomba"},{TipoVehiculo: "Auto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosGuardapolvos = await productosDB.find({$and:  [{TipoProducto : "Guardapolvo"},{TipoVehiculo: "Auto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosValvulas = await productosDB.find({$and:  [{TipoProducto : "Valvula"},{TipoVehiculo: "Auto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let wsAmortiguadores = false 
    let wsBases = false 
    let wsBaterias = false 
    let wsBujia = false 
    let wsBombas = false 
    let wsGuardapolvos = false 
    let wsValvulas = false 
    if(productosAmortiguadores.length > 0){
        wsAmortiguadores = wb.addWorksheet(`Amortiguadores`);
        wsAmortiguadores.cell(1,1).string("Código").style(headers2)
        wsAmortiguadores.cell(1,2).string("Marca").style(headers2)
        wsAmortiguadores.cell(1,3).string("Tipo de vehiculo").style(headers2)
        wsAmortiguadores.cell(1,4).string("Descripcion").style(headers2)
        wsAmortiguadores.cell(1,5).string("Modelo").style(headers2)
        wsAmortiguadores.cell(1,6).string("Posicion").style(headers2)
        wsAmortiguadores.cell(1,7).string("Precio").style(headers2)
        let fila = 2
        for(i=0; i< productosAmortiguadores.length; i++){
            columna = 1
            let amortiguador = await amortiguadoresDB.findOne({Codigo: productosAmortiguadores[i].Codigo})
            productosAmortiguadores[i].MarcaProducto = amortiguador.MarcaProducto
            productosAmortiguadores[i].ModeloProducto = amortiguador.ModeloProducto
            productosAmortiguadores[i].Posicion = amortiguador.Posicion
            if(productosAmortiguadores[i].Cantidad == 0){
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].Codigo).style(lineasRoja)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].MarcaProducto).style(lineasRoja)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].TipoVehiculo).style(lineasRoja)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].Descripcion).style(lineasRoja)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].ModeloProducto).style(lineasRoja)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].Posicion).style(lineasRoja)
                wsAmortiguadores.cell(fila, columna++).number(productosAmortiguadores[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].Codigo).style(lineas)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].MarcaProducto).style(lineas)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].TipoVehiculo).style(lineas)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].Descripcion).style(lineas)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].ModeloProducto).style(lineas)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].Posicion).style(lineas)
                wsAmortiguadores.cell(fila, columna++).number(productosAmortiguadores[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }
    if(productosBases.length > 0){
        wsBases = wb.addWorksheet(`Bases de amortiguador`);
        wsBases.cell(1,1).string("Código").style(headers2)
        wsBases.cell(1,2).string("Marca").style(headers2)
        wsBases.cell(1,3).string("Tipo de vehiculo").style(headers2)
        wsBases.cell(1,4).string("Descripcion").style(headers2)
        wsBases.cell(1,5).string("Posicion").style(headers2)
        wsBases.cell(1,6).string("Precio").style(headers2)
        let fila = 2

        for(i=0; i< productosBases.length; i++){
            columna = 1
            let base = await baseAmortiguadoresDB.findOne({Codigo: productosBases[i].Codigo})
            productosBases[i].MarcaProducto = base.MarcaProducto
            productosBases[i].Posicion = base.Posicion
            if(productosBases[i].Cantidad == 0){
                wsBases.cell(fila, columna++).string(productosBases[i].Codigo).style(lineasRoja)
                wsBases.cell(fila, columna++).string(productosBases[i].MarcaProducto).style(lineasRoja)
                wsBases.cell(fila, columna++).string(productosBases[i].TipoVehiculo).style(lineasRoja)
                wsBases.cell(fila, columna++).string(productosBases[i].Descripcion).style(lineasRoja)
                wsBases.cell(fila, columna++).string(productosBases[i].Posicion).style(lineasRoja)
                wsBases.cell(fila, columna++).number(productosBases[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsBases.cell(fila, columna++).string(productosBases[i].Codigo).style(lineas)
                wsBases.cell(fila, columna++).string(productosBases[i].MarcaProducto).style(lineas)
                wsBases.cell(fila, columna++).string(productosBases[i].TipoVehiculo).style(lineas)
                wsBases.cell(fila, columna++).string(productosBases[i].Descripcion).style(lineas)
                wsBases.cell(fila, columna++).string(productosBases[i].Posicion).style(lineas)
                wsBases.cell(fila, columna++).number(productosBases[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }
    if(productosBaterias.length > 0){
        wsBaterias = wb.addWorksheet(`Baterias`);
        wsBaterias.cell(1,1).string("Código").style(headers2)
        wsBaterias.cell(1,2).string("Tipo de vehiculo").style(headers2)
        wsBaterias.cell(1,3).string("Descripcion").style(headers2)
        wsBaterias.cell(1,4).string("Voltaje").style(headers2)
        wsBaterias.cell(1,5).string("Carga").style(headers2)
        wsBaterias.cell(1,6).string("Polaridad").style(headers2)
        wsBaterias.cell(1,7).string("Precio").style(headers2)
        let fila = 2

        for(i=0; i< productosBaterias.length; i++){
            columna = 1
            let bateria = await bateriasDB.findOne({Codigo: productosBaterias[i].Codigo})
            productosBaterias[i].Voltaje = bateria.Voltaje 
            productosBaterias[i].Carga = bateria.Carga
            productosBaterias[i].Polaridad = bateria.Polaridad
            if(productosBaterias[i].Cantidad == 0){
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].Codigo).style(lineasRoja)
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].TipoVehiculo).style(lineasRoja)
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].Descripcion).style(lineasRoja)
                wsBaterias.cell(fila, columna++).number(productosBaterias[i].Voltaje).style(lineasRoja)
                wsBaterias.cell(fila, columna++).number(productosBaterias[i].Carga).style(lineasRoja)
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].Polaridad).style(lineasRoja)
                wsBaterias.cell(fila, columna++).number(productosBaterias[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].Codigo).style(lineas)
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].TipoVehiculo).style(lineas)
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].Descripcion).style(lineas)
                wsBaterias.cell(fila, columna++).number(productosBaterias[i].Voltaje).style(lineas)
                wsBaterias.cell(fila, columna++).number(productosBaterias[i].Carga).style(lineas)
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].Polaridad).style(lineas)
                wsBaterias.cell(fila, columna++).number(productosBaterias[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }
    if(productosBombas.length > 0){
        wsBombas = wb.addWorksheet(`Bombas`);
        wsBombas.cell(1,1).string("Código").style(headers2)
        wsBombas.cell(1,2).string("Tipo de vehiculo").style(headers2)
        wsBombas.cell(1,3).string("Descripcion").style(headers2)
        wsBombas.cell(1,4).string("Precio").style(headers2)
        let fila = 2

        for(i=0; i< productosBombas.length; i++){
            columna = 1
            if(productosBombas[i].Cantidad == 0){
                wsBombas.cell(fila, columna++).string(productosBombas[i].Codigo).style(lineasRoja)
                wsBombas.cell(fila, columna++).string(productosBombas[i].TipoVehiculo).style(lineasRoja)
                wsBombas.cell(fila, columna++).string(productosBombas[i].Descripcion).style(lineasRoja)
                wsBombas.cell(fila, columna++).number(productosBombas[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsBombas.cell(fila, columna++).string(productosBombas[i].Codigo).style(lineas)
                wsBombas.cell(fila, columna++).string(productosBombas[i].TipoVehiculo).style(lineas)
                wsBombas.cell(fila, columna++).string(productosBombas[i].Descripcion).style(lineas)
                wsBombas.cell(fila, columna++).number(productosBombas[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }
    if(productosBujias.length > 0){
        wsBujia = wb.addWorksheet(`Bujías`);
        wsBujia.cell(1,1).string("Código").style(headers2)
        wsBujia.cell(1,2).string("Codigo stock").style(headers2)
        wsBujia.cell(1,3).string("Referencia 1").style(headers2)
        wsBujia.cell(1,4).string("Referencia 2").style(headers2)
        wsBujia.cell(1,5).string("Serie").style(headers2)
        wsBujia.cell(1,6).string("Tipo de vehiculo").style(headers2)
        wsBujia.cell(1,7).string("Descripcion").style(headers2)
        wsBujia.cell(1,8).string("Precio").style(headers2)
        let fila = 2
        for(i=0; i< productosBujias.length; i++){
            let bujia = await bujiaDB.findOne({Codigo: productosBujias[i].Codigo})
            columna = 1
            if(productosBujias[i].Cantidad == 0){
                wsBujia.cell(fila, columna++).string(productosBujias[i].Codigo).style(lineasRoja)
                wsBujia.cell(fila, columna++).number(bujia.CodigoStock).style(lineasRoja)
                wsBujia.cell(fila, columna++).string(bujia.Referencia1).style(lineasRoja)
                wsBujia.cell(fila, columna++).string(bujia.Referencia2).style(lineasRoja)
                wsBujia.cell(fila, columna++).string(bujia.Serie).style(lineasRoja)
                wsBujia.cell(fila, columna++).string(productosBujias[i].TipoVehiculo).style(lineasRoja)
                wsBujia.cell(fila, columna++).string(productosBujias[i].Descripcion).style(lineasRoja)
                wsBujia.cell(fila, columna++).number(productosBujias[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsBujia.cell(fila, columna++).string(productosBujias[i].Codigo).style(lineas)
                wsBujia.cell(fila, columna++).string(bujia.CodigoStock).style(lineas)
                wsBujia.cell(fila, columna++).string(bujia.Referencia1).style(lineas)
                wsBujia.cell(fila, columna++).string(bujia.Referencia2).style(lineas)
                wsBujia.cell(fila, columna++).string(bujia.Serie).style(lineas)
                wsBujia.cell(fila, columna++).string(productosBujias[i].TipoVehiculo).style(lineas)
                wsBujia.cell(fila, columna++).string(productosBujias[i].Descripcion).style(lineas)
                wsBujia.cell(fila, columna++).number(productosBujias[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }
    if(productosGuardapolvos.length > 0){
        wsGuardapolvos = wb.addWorksheet(`Guardapolvos`);
        wsGuardapolvos.cell(1,1).string("Código").style(headers2)
        wsGuardapolvos.cell(1,2).string("Tipo de vehiculo").style(headers2)
        wsGuardapolvos.cell(1,3).string("Descripcion").style(headers2)
        wsGuardapolvos.cell(1,4).string("Precio").style(headers2)
        let fila = 2

        for(i=0; i< productosBombas.length; i++){
            columna = 1
            if(productosGuardapolvos[i].Cantidad == 0){
                wsGuardapolvos.cell(fila, columna++).string(productosGuardapolvos[i].Codigo).style(lineasRoja)
                wsGuardapolvos.cell(fila, columna++).string(productosGuardapolvos[i].TipoVehiculo).style(lineasRoja)
                wsGuardapolvos.cell(fila, columna++).string(productosGuardapolvos[i].Descripcion).style(lineasRoja)
                wsGuardapolvos.cell(fila, columna++).number(productosGuardapolvos[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsGuardapolvos.cell(fila, columna++).string(productosGuardapolvos[i].Codigo).style(lineas)
                wsGuardapolvos.cell(fila, columna++).string(productosGuardapolvos[i].TipoVehiculo).style(lineas)
                wsGuardapolvos.cell(fila, columna++).string(productosGuardapolvos[i].Descripcion).style(lineas)
                wsGuardapolvos.cell(fila, columna++).number(productosGuardapolvos[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }
    if(productosValvulas.length > 0){
        wsValvulas = wb.addWorksheet(`Valvulas`);
        wsValvulas.cell(1,1).string("Código").style(headers2)
        wsValvulas.cell(1,2).string("Tipo de vehiculo").style(headers2)
        wsValvulas.cell(1,3).string("Descripcion").style(headers2)
        wsValvulas.cell(1,4).string("Precio").style(headers2)
        let fila = 2

        for(i=0; i< productosValvulas.length; i++){
            columna = 1
            if(productosValvulas[i].Cantidad == 0){
                wsValvulas.cell(fila, columna++).string(productosValvulas[i].Codigo).style(lineasRoja)
                wsValvulas.cell(fila, columna++).string(productosValvulas[i].TipoVehiculo).style(lineasRoja)
                wsValvulas.cell(fila, columna++).string(productosValvulas[i].Descripcion).style(lineasRoja)
                wsValvulas.cell(fila, columna++).number(productosValvulas[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsValvulas.cell(fila, columna++).string(productosValvulas[i].Codigo).style(lineas)
                wsValvulas.cell(fila, columna++).string(productosValvulas[i].TipoVehiculo).style(lineas)
                wsValvulas.cell(fila, columna++).string(productosValvulas[i].Descripcion).style(lineas)
                wsValvulas.cell(fila, columna++).number(productosValvulas[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }

    wb.write(`Lista de productos autos.xlsx`, res);

})
router.get('/descargar-lista-excel-moto', isAuthenticatedDuroc, async (req, res) => {
    const xl = require("excel4node");
    const wb = new xl.Workbook();
    const title = wb.createStyle({
        font: {
        color: "#ffffff",
        size: 15,
        },
        alignment: {
        wrapText: true,
        horizontal: 'center',
        },
        fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#198754",
        fgColor: "#198754",
        },
    });
    const headers3 = wb.createStyle({
        font: {
        color: "#ffffff",
        size: 11,
        },
        fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#15A204",
        fgColor: "#15A204",
        },
    });
    const headers2 = wb.createStyle({
        font: {
        color: "#ffffff",
        size: 11,
        },
        fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#343a40",
        fgColor: "#343a40",
        },
    });
    const lineasRoja = wb.createStyle({
        font: {
        color: "#000000",
        size: 11,
        },
        fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ff0000",
        fgColor: "#ff0000",
        },
    });
    const lineas = wb.createStyle({
        font: {
        color: "#000000",
        size: 11,
        },
        fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ffffff",
        fgColor: "#ffffff",
        },
    });
    let productosBujias = await productosDB.find({$and:  [{TipoProducto : "Bujia"},{TipoVehiculo: "Moto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosAmortiguadores = await productosDB.find({$and:  [{TipoProducto : "Amortiguador"},{TipoVehiculo: "Moto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosBases = await productosDB.find({$and:  [{TipoProducto : "Base amortiguador"},{TipoVehiculo: "Moto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosBaterias = await productosDB.find({$and:  [{TipoProducto : "Bateria"},{TipoVehiculo: "Moto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosBombas = await productosDB.find({$and:  [{TipoProducto : "Bomba"},{TipoVehiculo: "Moto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosGuardapolvos = await productosDB.find({$and:  [{TipoProducto : "Guardapolvo"},{TipoVehiculo: "Moto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosValvulas = await productosDB.find({$and:  [{TipoProducto : "Valvula"},{TipoVehiculo: "Moto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let wsAmortiguadores = false 
    let wsBases = false 
    let wsBaterias = false 
    let wsBujia = false 
    let wsBombas = false 
    let wsGuardapolvos = false 
    let wsValvulas = false 
    if(productosAmortiguadores.length > 0){
        wsAmortiguadores = wb.addWorksheet(`Amortiguadores`);
        wsAmortiguadores.cell(1,1).string("Código").style(headers2)
        wsAmortiguadores.cell(1,2).string("Marca").style(headers2)
        wsAmortiguadores.cell(1,3).string("Tipo de vehiculo").style(headers2)
        wsAmortiguadores.cell(1,4).string("Descripcion").style(headers2)
        wsAmortiguadores.cell(1,5).string("Modelo").style(headers2)
        wsAmortiguadores.cell(1,6).string("Posicion").style(headers2)
        wsAmortiguadores.cell(1,7).string("Precio").style(headers2)
        let fila = 2
        for(i=0; i< productosAmortiguadores.length; i++){
            columna = 1
            let amortiguador = await amortiguadoresDB.findOne({Codigo: productosAmortiguadores[i].Codigo})
            productosAmortiguadores[i].MarcaProducto = amortiguador.MarcaProducto
            productosAmortiguadores[i].ModeloProducto = amortiguador.ModeloProducto
            productosAmortiguadores[i].Posicion = amortiguador.Posicion
            if(productosAmortiguadores[i].Cantidad == 0){
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].Codigo).style(lineasRoja)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].MarcaProducto).style(lineasRoja)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].TipoVehiculo).style(lineasRoja)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].Descripcion).style(lineasRoja)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].ModeloProducto).style(lineasRoja)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].Posicion).style(lineasRoja)
                wsAmortiguadores.cell(fila, columna++).number(productosAmortiguadores[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].Codigo).style(lineas)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].MarcaProducto).style(lineas)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].TipoVehiculo).style(lineas)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].Descripcion).style(lineas)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].ModeloProducto).style(lineas)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].Posicion).style(lineas)
                wsAmortiguadores.cell(fila, columna++).number(productosAmortiguadores[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }
    if(productosBases.length > 0){
        wsBases = wb.addWorksheet(`Bases de amortiguador`);
        wsBases.cell(1,1).string("Código").style(headers2)
        wsBases.cell(1,2).string("Marca").style(headers2)
        wsBases.cell(1,3).string("Tipo de vehiculo").style(headers2)
        wsBases.cell(1,4).string("Descripcion").style(headers2)
        wsBases.cell(1,5).string("Posicion").style(headers2)
        wsBases.cell(1,6).string("Precio").style(headers2)
        let fila = 2

        for(i=0; i< productosBases.length; i++){
            columna = 1
            let base = await baseAmortiguadoresDB.findOne({Codigo: productosBases[i].Codigo})
            productosBases[i].MarcaProducto = base.MarcaProducto
            productosBases[i].Posicion = base.Posicion
            if(productosBases[i].Cantidad == 0){
                wsBases.cell(fila, columna++).string(productosBases[i].Codigo).style(lineasRoja)
                wsBases.cell(fila, columna++).string(productosBases[i].MarcaProducto).style(lineasRoja)
                wsBases.cell(fila, columna++).string(productosBases[i].TipoVehiculo).style(lineasRoja)
                wsBases.cell(fila, columna++).string(productosBases[i].Descripcion).style(lineasRoja)
                wsBases.cell(fila, columna++).string(productosBases[i].Posicion).style(lineasRoja)
                wsBases.cell(fila, columna++).number(productosBases[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsBases.cell(fila, columna++).string(productosBases[i].Codigo).style(lineas)
                wsBases.cell(fila, columna++).string(productosBases[i].MarcaProducto).style(lineas)
                wsBases.cell(fila, columna++).string(productosBases[i].TipoVehiculo).style(lineas)
                wsBases.cell(fila, columna++).string(productosBases[i].Descripcion).style(lineas)
                wsBases.cell(fila, columna++).string(productosBases[i].Posicion).style(lineas)
                wsBases.cell(fila, columna++).number(productosBases[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }
    if(productosBaterias.length > 0){
        wsBaterias = wb.addWorksheet(`Baterias`);
        wsBaterias.cell(1,1).string("Código").style(headers2)
        wsBaterias.cell(1,2).string("Tipo de vehiculo").style(headers2)
        wsBaterias.cell(1,3).string("Descripcion").style(headers2)
        wsBaterias.cell(1,4).string("Voltaje").style(headers2)
        wsBaterias.cell(1,5).string("Carga").style(headers2)
        wsBaterias.cell(1,6).string("Polaridad").style(headers2)
        wsBaterias.cell(1,7).string("Precio").style(headers2)
        let fila = 2

        for(i=0; i< productosBaterias.length; i++){
            columna = 1
            let bateria = await bateriasDB.findOne({Codigo: productosBaterias[i].Codigo})
            productosBaterias[i].Voltaje = bateria.Voltaje 
            productosBaterias[i].Carga = bateria.Carga
            productosBaterias[i].Polaridad = bateria.Polaridad
            if(productosBaterias[i].Cantidad == 0){
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].Codigo).style(lineasRoja)
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].TipoVehiculo).style(lineasRoja)
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].Descripcion).style(lineasRoja)
                wsBaterias.cell(fila, columna++).number(productosBaterias[i].Voltaje).style(lineasRoja)
                wsBaterias.cell(fila, columna++).number(productosBaterias[i].Carga).style(lineasRoja)
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].Polaridad).style(lineasRoja)
                wsBaterias.cell(fila, columna++).number(productosBaterias[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].Codigo).style(lineas)
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].TipoVehiculo).style(lineas)
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].Descripcion).style(lineas)
                wsBaterias.cell(fila, columna++).number(productosBaterias[i].Voltaje).style(lineas)
                wsBaterias.cell(fila, columna++).number(productosBaterias[i].Carga).style(lineas)
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].Polaridad).style(lineas)
                wsBaterias.cell(fila, columna++).number(productosBaterias[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }
    if(productosBombas.length > 0){
        wsBombas = wb.addWorksheet(`Bombas`);
        wsBombas.cell(1,1).string("Código").style(headers2)
        wsBombas.cell(1,2).string("Tipo de vehiculo").style(headers2)
        wsBombas.cell(1,3).string("Descripcion").style(headers2)
        wsBombas.cell(1,4).string("Precio").style(headers2)
        let fila = 2

        for(i=0; i< productosBombas.length; i++){
            columna = 1
            if(productosBombas[i].Cantidad == 0){
                wsBombas.cell(fila, columna++).string(productosBombas[i].Codigo).style(lineasRoja)
                wsBombas.cell(fila, columna++).string(productosBombas[i].TipoVehiculo).style(lineasRoja)
                wsBombas.cell(fila, columna++).string(productosBombas[i].Descripcion).style(lineasRoja)
                wsBombas.cell(fila, columna++).number(productosBombas[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsBombas.cell(fila, columna++).string(productosBombas[i].Codigo).style(lineas)
                wsBombas.cell(fila, columna++).string(productosBombas[i].TipoVehiculo).style(lineas)
                wsBombas.cell(fila, columna++).string(productosBombas[i].Descripcion).style(lineas)
                wsBombas.cell(fila, columna++).number(productosBombas[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }
    if(productosBujias.length > 0){
        wsBujia = wb.addWorksheet(`Bujías`);
        wsBujia.cell(1,1).string("Código").style(headers2)
        wsBujia.cell(1,2).string("Codigo stock").style(headers2)
        wsBujia.cell(1,3).string("Referencia 1").style(headers2)
        wsBujia.cell(1,4).string("Referencia 2").style(headers2)
        wsBujia.cell(1,5).string("Serie").style(headers2)
        wsBujia.cell(1,6).string("Tipo de vehiculo").style(headers2)
        wsBujia.cell(1,7).string("Descripcion").style(headers2)
        wsBujia.cell(1,8).string("Precio").style(headers2)
        let fila = 2
        for(i=0; i< productosBujias.length; i++){
            console.log(productosBujias[i].Codigo)
            let bujia = await bujiaDB.findOne({Codigo: productosBujias[i].Codigo})
            columna = 1
            if(productosBujias[i].Cantidad == 0){
                wsBujia.cell(fila, columna++).string(productosBujias[i].Codigo).style(lineasRoja)
                wsBujia.cell(fila, columna++).string(bujia.CodigoStock).style(lineasRoja)
                wsBujia.cell(fila, columna++).string(bujia.Referencia1).style(lineasRoja)
                wsBujia.cell(fila, columna++).string(bujia.Referencia2).style(lineasRoja)
                wsBujia.cell(fila, columna++).string(bujia.Serie).style(lineasRoja)
                wsBujia.cell(fila, columna++).string(productosBujias[i].TipoVehiculo).style(lineasRoja)
                wsBujia.cell(fila, columna++).string(productosBujias[i].Descripcion).style(lineasRoja)
                wsBujia.cell(fila, columna++).number(productosBujias[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsBujia.cell(fila, columna++).string(productosBujias[i].Codigo).style(lineas)
                wsBujia.cell(fila, columna++).string(bujia.CodigoStock).style(lineas)
                wsBujia.cell(fila, columna++).string(bujia.Referencia1).style(lineas)
                wsBujia.cell(fila, columna++).string(bujia.Referencia2).style(lineas)
                wsBujia.cell(fila, columna++).string(bujia.Serie).style(lineas)
                wsBujia.cell(fila, columna++).string(productosBujias[i].TipoVehiculo).style(lineas)
                wsBujia.cell(fila, columna++).string(productosBujias[i].Descripcion).style(lineas)
                wsBujia.cell(fila, columna++).number(productosBujias[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }
    if(productosGuardapolvos.length > 0){
        wsGuardapolvos = wb.addWorksheet(`Guardapolvos`);
        wsGuardapolvos.cell(1,1).string("Código").style(headers2)
        wsGuardapolvos.cell(1,2).string("Tipo de vehiculo").style(headers2)
        wsGuardapolvos.cell(1,3).string("Descripcion").style(headers2)
        wsGuardapolvos.cell(1,4).string("Precio").style(headers2)
        let fila = 2

        for(i=0; i< productosBombas.length; i++){
            columna = 1
            if(productosGuardapolvos[i].Cantidad == 0){
                wsGuardapolvos.cell(fila, columna++).string(productosGuardapolvos[i].Codigo).style(lineasRoja)
                wsGuardapolvos.cell(fila, columna++).string(productosGuardapolvos[i].TipoVehiculo).style(lineasRoja)
                wsGuardapolvos.cell(fila, columna++).string(productosGuardapolvos[i].Descripcion).style(lineasRoja)
                wsGuardapolvos.cell(fila, columna++).number(productosGuardapolvos[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsGuardapolvos.cell(fila, columna++).string(productosGuardapolvos[i].Codigo).style(lineas)
                wsGuardapolvos.cell(fila, columna++).string(productosGuardapolvos[i].TipoVehiculo).style(lineas)
                wsGuardapolvos.cell(fila, columna++).string(productosGuardapolvos[i].Descripcion).style(lineas)
                wsGuardapolvos.cell(fila, columna++).number(productosGuardapolvos[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }
    if(productosValvulas.length > 0){
        wsValvulas = wb.addWorksheet(`Valvulas`);
        wsValvulas.cell(1,1).string("Código").style(headers2)
        wsValvulas.cell(1,2).string("Tipo de vehiculo").style(headers2)
        wsValvulas.cell(1,3).string("Descripcion").style(headers2)
        wsValvulas.cell(1,4).string("Precio").style(headers2)
        let fila = 2

        for(i=0; i< productosValvulas.length; i++){
            columna = 1
            if(productosValvulas[i].Cantidad == 0){
                wsValvulas.cell(fila, columna++).string(productosValvulas[i].Codigo).style(lineasRoja)
                wsValvulas.cell(fila, columna++).string(productosValvulas[i].TipoVehiculo).style(lineasRoja)
                wsValvulas.cell(fila, columna++).string(productosValvulas[i].Descripcion).style(lineasRoja)
                wsValvulas.cell(fila, columna++).number(productosValvulas[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsValvulas.cell(fila, columna++).string(productosValvulas[i].Codigo).style(lineas)
                wsValvulas.cell(fila, columna++).string(productosValvulas[i].TipoVehiculo).style(lineas)
                wsValvulas.cell(fila, columna++).string(productosValvulas[i].Descripcion).style(lineas)
                wsValvulas.cell(fila, columna++).number(productosValvulas[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }

    wb.write(`Lista de productos motos.xlsx`, res);

})

router.get('/descargar-lista-excel-general', isAuthenticatedDuroc, async (req, res) => {
    const xl = require("excel4node");
    const wb = new xl.Workbook();
    const title = wb.createStyle({
        font: {
        color: "#ffffff",
        size: 15,
        },
        alignment: {
        wrapText: true,
        horizontal: 'center',
        },
        fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#198754",
        fgColor: "#198754",
        },
    });
    const headers3 = wb.createStyle({
        font: {
        color: "#ffffff",
        size: 11,
        },
        fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#15A204",
        fgColor: "#15A204",
        },
    });
    const headers2 = wb.createStyle({
        font: {
        color: "#ffffff",
        size: 11,
        },
        fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#343a40",
        fgColor: "#343a40",
        },
    });
    const lineasRoja = wb.createStyle({
        font: {
        color: "#000000",
        size: 11,
        },
        fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ff0000",
        fgColor: "#ff0000",
        },
    });
    const lineas = wb.createStyle({
        font: {
        color: "#000000",
        size: 11,
        },
        fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ffffff",
        fgColor: "#ffffff",
        },
    });
    let productosAmortiguadores = await productosDB.find({TipoProducto : "Amortiguador"}).sort({TipoProducto: 1, Codigo: 1})
    let productosBujias = await productosDB.find({TipoProducto : "Bujia"}).sort({TipoProducto: 1, Codigo: 1})
    let productosBases = await productosDB.find({TipoProducto : "Base amortiguador"}).sort({TipoProducto: 1, Codigo: 1})
    let productosBaterias = await productosDB.find({TipoProducto : "Bateria"}).sort({TipoProducto: 1, Codigo: 1})
    let productosBombas = await productosDB.find({TipoProducto : "Bomba"}).sort({TipoProducto: 1, Codigo: 1})
    let productosGuardapolvos = await productosDB.find({TipoProducto : "Guardapolvo"}).sort({TipoProducto: 1, Codigo: 1})
    let productosValvulas = await productosDB.find({TipoProducto : "Valvula"}).sort({TipoProducto: 1, Codigo: 1})
    let wsAmortiguadores = false 
    let wsBases = false 
    let wsBaterias = false 
    let wsBombas = false 
    let wsGuardapolvos = false 
    let wsBujia = false 
    let wsValvulas = false 
    if(productosAmortiguadores.length > 0){
        wsAmortiguadores = wb.addWorksheet(`Amortiguadores`);
        wsAmortiguadores.cell(1,1).string("Código").style(headers2)
        wsAmortiguadores.cell(1,2).string("Marca").style(headers2)
        wsAmortiguadores.cell(1,3).string("Tipo de vehiculo").style(headers2)
        wsAmortiguadores.cell(1,4).string("Descripcion").style(headers2)
        wsAmortiguadores.cell(1,5).string("Modelo").style(headers2)
        wsAmortiguadores.cell(1,6).string("Posicion").style(headers2)
        wsAmortiguadores.cell(1,7).string("Precio").style(headers2)
        let fila = 2
        for(i=0; i< productosAmortiguadores.length; i++){
            columna = 1
            let amortiguador = await amortiguadoresDB.findOne({Codigo: productosAmortiguadores[i].Codigo})
            productosAmortiguadores[i].MarcaProducto = amortiguador.MarcaProducto
            productosAmortiguadores[i].ModeloProducto = amortiguador.ModeloProducto
            productosAmortiguadores[i].Posicion = amortiguador.Posicion
            if(productosAmortiguadores[i].Cantidad == 0){
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].Codigo).style(lineasRoja)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].MarcaProducto).style(lineasRoja)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].TipoVehiculo).style(lineasRoja)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].Descripcion).style(lineasRoja)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].ModeloProducto).style(lineasRoja)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].Posicion).style(lineasRoja)
                wsAmortiguadores.cell(fila, columna++).number(productosAmortiguadores[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].Codigo).style(lineas)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].MarcaProducto).style(lineas)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].TipoVehiculo).style(lineas)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].Descripcion).style(lineas)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].ModeloProducto).style(lineas)
                wsAmortiguadores.cell(fila, columna++).string(productosAmortiguadores[i].Posicion).style(lineas)
                wsAmortiguadores.cell(fila, columna++).number(productosAmortiguadores[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }
    if(productosBases.length > 0){
        wsBases = wb.addWorksheet(`Bases de amortiguador`);
        wsBases.cell(1,1).string("Código").style(headers2)
        wsBases.cell(1,2).string("Marca").style(headers2)
        wsBases.cell(1,3).string("Tipo de vehiculo").style(headers2)
        wsBases.cell(1,4).string("Descripcion").style(headers2)
        wsBases.cell(1,5).string("Posicion").style(headers2)
        wsBases.cell(1,6).string("Precio").style(headers2)
        let fila = 2

        for(i=0; i< productosBases.length; i++){
            columna = 1
            let base = await baseAmortiguadoresDB.findOne({Codigo: productosBases[i].Codigo})
            productosBases[i].MarcaProducto = base.MarcaProducto
            productosBases[i].Posicion = base.Posicion
            if(productosBases[i].Cantidad == 0){
                wsBases.cell(fila, columna++).string(productosBases[i].Codigo).style(lineasRoja)
                wsBases.cell(fila, columna++).string(productosBases[i].MarcaProducto).style(lineasRoja)
                wsBases.cell(fila, columna++).string(productosBases[i].TipoVehiculo).style(lineasRoja)
                wsBases.cell(fila, columna++).string(productosBases[i].Descripcion).style(lineasRoja)
                wsBases.cell(fila, columna++).string(productosBases[i].Posicion).style(lineasRoja)
                wsBases.cell(fila, columna++).number(productosBases[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsBases.cell(fila, columna++).string(productosBases[i].Codigo).style(lineas)
                wsBases.cell(fila, columna++).string(productosBases[i].MarcaProducto).style(lineas)
                wsBases.cell(fila, columna++).string(productosBases[i].TipoVehiculo).style(lineas)
                wsBases.cell(fila, columna++).string(productosBases[i].Descripcion).style(lineas)
                wsBases.cell(fila, columna++).string(productosBases[i].Posicion).style(lineas)
                wsBases.cell(fila, columna++).number(productosBases[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }
    if(productosBaterias.length > 0){
        wsBaterias = wb.addWorksheet(`Baterias`);
        wsBaterias.cell(1,1).string("Código").style(headers2)
        wsBaterias.cell(1,2).string("Tipo de vehiculo").style(headers2)
        wsBaterias.cell(1,3).string("Descripcion").style(headers2)
        wsBaterias.cell(1,4).string("Voltaje").style(headers2)
        wsBaterias.cell(1,5).string("Carga").style(headers2)
        wsBaterias.cell(1,6).string("Polaridad").style(headers2)
        wsBaterias.cell(1,7).string("Precio").style(headers2)
        let fila = 2

        for(i=0; i< productosBaterias.length; i++){
            columna = 1
            let bateria = await bateriasDB.findOne({Codigo: productosBaterias[i].Codigo})
            productosBaterias[i].Voltaje = bateria.Voltaje 
            productosBaterias[i].Carga = bateria.Carga
            productosBaterias[i].Polaridad = bateria.Polaridad
            if(productosBaterias[i].Cantidad == 0){
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].Codigo).style(lineasRoja)
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].TipoVehiculo).style(lineasRoja)
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].Descripcion).style(lineasRoja)
                wsBaterias.cell(fila, columna++).number(productosBaterias[i].Voltaje).style(lineasRoja)
                wsBaterias.cell(fila, columna++).number(productosBaterias[i].Carga).style(lineasRoja)
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].Polaridad).style(lineasRoja)
                wsBaterias.cell(fila, columna++).number(productosBaterias[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].Codigo).style(lineas)
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].TipoVehiculo).style(lineas)
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].Descripcion).style(lineas)
                wsBaterias.cell(fila, columna++).number(productosBaterias[i].Voltaje).style(lineas)
                wsBaterias.cell(fila, columna++).number(productosBaterias[i].Carga).style(lineas)
                wsBaterias.cell(fila, columna++).string(productosBaterias[i].Polaridad).style(lineas)
                wsBaterias.cell(fila, columna++).number(productosBaterias[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }
    if(productosBombas.length > 0){
        wsBombas = wb.addWorksheet(`Bombas`);
        wsBombas.cell(1,1).string("Código").style(headers2)
        wsBombas.cell(1,2).string("Tipo de vehiculo").style(headers2)
        wsBombas.cell(1,3).string("Descripcion").style(headers2)
        wsBombas.cell(1,4).string("Precio").style(headers2)
        let fila = 2

        for(i=0; i< productosBombas.length; i++){
            columna = 1
            if(productosBombas[i].Cantidad == 0){
                wsBombas.cell(fila, columna++).string(productosBombas[i].Codigo).style(lineasRoja)
                wsBombas.cell(fila, columna++).string(productosBombas[i].TipoVehiculo).style(lineasRoja)
                wsBombas.cell(fila, columna++).string(productosBombas[i].Descripcion).style(lineasRoja)
                wsBombas.cell(fila, columna++).number(productosBombas[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsBombas.cell(fila, columna++).string(productosBombas[i].Codigo).style(lineas)
                wsBombas.cell(fila, columna++).string(productosBombas[i].TipoVehiculo).style(lineas)
                wsBombas.cell(fila, columna++).string(productosBombas[i].Descripcion).style(lineas)
                wsBombas.cell(fila, columna++).number(productosBombas[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }
    if(productosBujias.length > 0){
        wsBujia = wb.addWorksheet(`Bujías`);
        wsBujia.cell(1,1).string("Código").style(headers2)
        wsBujia.cell(1,2).string("Codigo stock").style(headers2)
        wsBujia.cell(1,3).string("Referencia 1").style(headers2)
        wsBujia.cell(1,4).string("Referencia 2").style(headers2)
        wsBujia.cell(1,5).string("Serie").style(headers2)
        wsBujia.cell(1,6).string("Tipo de vehiculo").style(headers2)
        wsBujia.cell(1,7).string("Descripcion").style(headers2)
        wsBujia.cell(1,8).string("Precio").style(headers2)
        let fila = 2
        for(i=0; i< productosBujias.length; i++){
            let bujia = await bujiaDB.findOne({Codigo: productosBujias[i].Codigo})
            columna = 1
            if(productosBujias[i].Cantidad == 0){
                wsBujia.cell(fila, columna++).string(productosBujias[i].Codigo).style(lineasRoja)
                wsBujia.cell(fila, columna++).number(bujia.CodigoStock).style(lineasRoja)
                wsBujia.cell(fila, columna++).string(bujia.Referencia1).style(lineasRoja)
                wsBujia.cell(fila, columna++).string(bujia.Referencia2).style(lineasRoja)
                wsBujia.cell(fila, columna++).string(bujia.Serie).style(lineasRoja)
                wsBujia.cell(fila, columna++).string(productosBujias[i].TipoVehiculo).style(lineasRoja)
                wsBujia.cell(fila, columna++).string(productosBujias[i].Descripcion).style(lineasRoja)
                wsBujia.cell(fila, columna++).number(productosBujias[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsBujia.cell(fila, columna++).string(productosBujias[i].Codigo).style(lineas)
                wsBujia.cell(fila, columna++).string(bujia.CodigoStock).style(lineas)
                wsBujia.cell(fila, columna++).string(bujia.Referencia1).style(lineas)
                wsBujia.cell(fila, columna++).string(bujia.Referencia2).style(lineas)
                wsBujia.cell(fila, columna++).string(bujia.Serie).style(lineas)
                wsBujia.cell(fila, columna++).string(productosBujias[i].TipoVehiculo).style(lineas)
                wsBujia.cell(fila, columna++).string(productosBujias[i].Descripcion).style(lineas)
                wsBujia.cell(fila, columna++).number(productosBujias[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }
    if(productosGuardapolvos.length > 0){
        wsGuardapolvos = wb.addWorksheet(`Guardapolvos`);
        wsGuardapolvos.cell(1,1).string("Código").style(headers2)
        wsGuardapolvos.cell(1,2).string("Tipo de vehiculo").style(headers2)
        wsGuardapolvos.cell(1,3).string("Descripcion").style(headers2)
        wsGuardapolvos.cell(1,4).string("Precio").style(headers2)
        let fila = 2

        for(i=0; i< productosBombas.length; i++){
            columna = 1
            if(productosGuardapolvos[i].Cantidad == 0){
                wsGuardapolvos.cell(fila, columna++).string(productosGuardapolvos[i].Codigo).style(lineasRoja)
                wsGuardapolvos.cell(fila, columna++).string(productosGuardapolvos[i].TipoVehiculo).style(lineasRoja)
                wsGuardapolvos.cell(fila, columna++).string(productosGuardapolvos[i].Descripcion).style(lineasRoja)
                wsGuardapolvos.cell(fila, columna++).number(productosGuardapolvos[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsGuardapolvos.cell(fila, columna++).string(productosGuardapolvos[i].Codigo).style(lineas)
                wsGuardapolvos.cell(fila, columna++).string(productosGuardapolvos[i].TipoVehiculo).style(lineas)
                wsGuardapolvos.cell(fila, columna++).string(productosGuardapolvos[i].Descripcion).style(lineas)
                wsGuardapolvos.cell(fila, columna++).number(productosGuardapolvos[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }
    if(productosValvulas.length > 0){
        wsValvulas = wb.addWorksheet(`Valvulas`);
        wsValvulas.cell(1,1).string("Código").style(headers2)
        wsValvulas.cell(1,2).string("Tipo de vehiculo").style(headers2)
        wsValvulas.cell(1,3).string("Descripcion").style(headers2)
        wsValvulas.cell(1,4).string("Precio").style(headers2)
        let fila = 2

        for(i=0; i< productosValvulas.length; i++){
            columna = 1
            if(productosValvulas[i].Cantidad == 0){
                wsValvulas.cell(fila, columna++).string(productosValvulas[i].Codigo).style(lineasRoja)
                wsValvulas.cell(fila, columna++).string(productosValvulas[i].TipoVehiculo).style(lineasRoja)
                wsValvulas.cell(fila, columna++).string(productosValvulas[i].Descripcion).style(lineasRoja)
                wsValvulas.cell(fila, columna++).number(productosValvulas[i].PrecioVenta).style(lineasRoja)
                fila++
            }else{
                wsValvulas.cell(fila, columna++).string(productosValvulas[i].Codigo).style(lineas)
                wsValvulas.cell(fila, columna++).string(productosValvulas[i].TipoVehiculo).style(lineas)
                wsValvulas.cell(fila, columna++).string(productosValvulas[i].Descripcion).style(lineas)
                wsValvulas.cell(fila, columna++).number(productosValvulas[i].PrecioVenta).style(lineas)
                fila++
            }
        }
    }

    wb.write(`Lista de productos general.xlsx`, res);

})


router.get('/descargar-lista-pdf-auto', isAuthenticatedDuroc, async (req, res) => {
    let productosAmortiguadores = await productosDB.find({$and:  [{TipoProducto : "Amortiguador"},{TipoVehiculo: "Auto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosBases = await productosDB.find({$and:  [{TipoProducto : "Base amortiguador"},{TipoVehiculo: "Auto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosBujias = await productosDB.find({$and:  [{TipoProducto : "Bujia"},{TipoVehiculo: "Auto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosBaterias = await productosDB.find({$and:  [{TipoProducto : "Bateria"},{TipoVehiculo: "Auto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosBombas = await productosDB.find({$and:  [{TipoProducto : "Bomba"},{TipoVehiculo: "Auto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosGuardapolvos = await productosDB.find({$and:  [{TipoProducto : "Guardapolvo"},{TipoVehiculo: "Auto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosValvulas = await productosDB.find({$and:  [{TipoProducto : "Valvula"},{TipoVehiculo: "Auto"}]}).sort({TipoProducto: 1, Codigo: 1})
    if(productosAmortiguadores.length > 0){
        for(i=0; i< productosAmortiguadores.length; i++){
            let amortiguador = await amortiguadoresDB.findOne({Codigo: productosAmortiguadores[i].Codigo})
            productosAmortiguadores[i].MarcaProducto = amortiguador.MarcaProducto
            productosAmortiguadores[i].ModeloProducto = amortiguador.ModeloProducto
            productosAmortiguadores[i].Posicion = amortiguador.Posicion
        }
    }
    if(productosBases.length > 0){
        for(i=0; i< productosBases.length; i++){
            let base = await baseAmortiguadoresDB.findOne({Codigo: productosBases[i].Codigo})
            productosBases[i].MarcaProducto = base.MarcaProducto
            productosBases[i].Posicion = base.Posicion
        }
    }
    if(productosBujias.length > 0){
        for(i=0; i< productosBujias.length; i++){
            let bujia = await bujiaDB.findOne({Codigo: productosBujias[i].Codigo})
            productosBujias[i].CodigoStock = bujia.CodigoStock 
            productosBujias[i].Referencia1 = bujia.Referencia1 
            productosBujias[i].Referencia2 = bujia.Referencia2
            productosBujias[i].Serie = bujia.Serie
        }
        productosBujias = productosBujias.map((data) => {
            if(data.Cantidad == 0){
                return{
                    Codigo: data.Codigo,
                    TipoVehiculo: data.TipoVehiculo,
                    Descripcion: data.Descripcion,
                    PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                    CodigoStock: data.CodigoStock,
                    Referencia1: data.Referencia1,
                    Referencia2: data.Referencia2,
                    Serie: data.Serie,
                    clase : "text-danger"
                }
            } else{
                return{
                    Codigo: data.Codigo,
                    TipoVehiculo: data.TipoVehiculo,
                    Descripcion: data.Descripcion,
                    PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                    CodigoStock: data.CodigoStock,
                    Referencia1: data.Referencia1,
                    Referencia2: data.Referencia2,
                    Serie: data.Serie,
                    clase : "text-dark"
                }
            }
        })
        
    }
    if(productosBujias.length > 0){
        for(i=0; i< productosBujias.length; i++){
            let bujia = await bujiaDB.findOne({Codigo: productosBujias[i].Codigo})
            productosBujias[i].CantidadElectrodoTierra = bujia.CantidadElectrodoTierra 
            productosBujias[i].MaterialElectrodoTierra = bujia.MaterialElectrodoTierra
            productosBujias[i].MaterialElectrodoCentral = bujia.MaterialElectrodoCentral
        }
        productosBujias = productosBujias.map((data) => {
            if(data.Cantidad == 0){
                return{
                    Codigo: data.Codigo,
                    TipoVehiculo: data.TipoVehiculo,
                    Descripcion: data.Descripcion,
                    PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                    CantidadElectrodoTierra: data.CantidadElectrodoTierra,
                    MaterialElectrodoTierra: data.MaterialElectrodoTierra,
                    MaterialElectrodoCentral: data.MaterialElectrodoCentral,
                    clase : "text-danger"
                }
            } else{
                return{
                    Codigo: data.Codigo,
                    TipoVehiculo: data.TipoVehiculo,
                    Descripcion: data.Descripcion,
                    PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                    CantidadElectrodoTierra: data.CantidadElectrodoTierra,
                    MaterialElectrodoTierra: data.MaterialElectrodoTierra,
                    MaterialElectrodoCentral: data.MaterialElectrodoCentral,
                    clase : "text-dark"
                }
            }
        })
        
    }
    productosAmortiguadores = productosAmortiguadores.map((data) => {
        if(data.Cantidad == 0){
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                MarcaProducto: data.MarcaProducto,
                ModeloProducto: data.ModeloProducto,
                Posicion: data.Posicion,
                clase : "text-danger"
            }
        }else{
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                MarcaProducto: data.MarcaProducto,
                ModeloProducto: data.ModeloProducto,
                Posicion: data.Posicion,
                clase : "text-dark"
            }
        }
    })
    productosBases = productosBases.map((data) => {
        if(data.Cantidad == 0){
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                MarcaProducto: data.MarcaProducto,
                Posicion: data.Posicion,
                clase : "text-danger"
            }
        }else{
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                MarcaProducto: data.MarcaProducto,
                Posicion: data.Posicion,
                clase : "text-dark"
            }
        }
    })

    productosBombas = productosBombas.map((data) => {
        if(data.Cantidad == 0){
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                clase : "text-danger"
            }
        }else{
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                clase : "text-dark"
            }
        }
    })
    productosGuardapolvos = productosGuardapolvos.map((data) => {
        if(data.Cantidad == 0){
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                clase : "text-danger"
            }
        }else{
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                clase : "text-dark"
            }
        }
    })
    productosValvulas = productosValvulas.map((data) => {
        if(data.Cantidad == 0){
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                clase : "text-danger"

            }
        }else{
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                clase : "text-dark"
            }
        }
    })
    let titulo  = "Lista de productos autos"
    let validacionProductosAmortiguadores = productosAmortiguadores.length 
    let validacionProductosBases = productosBases.length 
    let validacionProductosBaterias = productosBaterias.length 
    let validacionProductosBujia = productosBujias.length 
    let validacionProductosBombas = productosBombas.length 
    let validacionProductosGuardapolvos = productosGuardapolvos.length 
    let validacionProductosValvulas = productosValvulas.length 

    if(validacionProductosBujia.length == 0){
        validacionProductosBujia = false
    }else{
        validacionProductosBujia = true
    }
    if(validacionProductosAmortiguadores.length == 0){
        validacionProductosAmortiguadores = false
    }else{
        validacionProductosAmortiguadores = true
    }
    if(validacionProductosBases.length == 0){
        validacionProductosBases = false
    }else{
        validacionProductosBases = true
    }
    if(validacionProductosBaterias.length == 0){
        validacionProductosBaterias = false
    }else{
        validacionProductosBaterias = true
    }
    if(validacionProductosBombas.length == 0){
        validacionProductosBombas = false
    }else{
        validacionProductosBombas = true
    }
    if(validacionProductosGuardapolvos.length == 0){
        validacionProductosGuardapolvos = false
    }else{
        validacionProductosGuardapolvos = true
    }
    if(validacionProductosValvulas.length == 0){
        validacionProductosValvulas = false
    }else{
        validacionProductosValvulas = true
    }
    res.render('seller/lista-pdf',{
        layout:"reportes.hbs",
        productosAmortiguadores,
        productosBases,
        productosBaterias,
        productosBombas,
        productosGuardapolvos,
        productosValvulas,
        validacionProductosBujia,
        productosBujias,
        validacionProductosAmortiguadores,
        validacionProductosBases,
        validacionProductosBaterias,
        validacionProductosBombas,
        validacionProductosGuardapolvos,
        validacionProductosValvulas,
        titulo
    })

})
router.get('/descargar-lista-pdf-moto', isAuthenticatedDuroc, async (req, res) => {
    let productosAmortiguadores = await productosDB.find({$and:  [{TipoProducto : "Amortiguador"},{TipoVehiculo: "Moto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosBujias = await productosDB.find({$and:  [{TipoProducto : "Bujia"},{TipoVehiculo: "Moto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosBases = await productosDB.find({$and:  [{TipoProducto : "Base amortiguador"},{TipoVehiculo: "Moto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosBaterias = await productosDB.find({$and:  [{TipoProducto : "Bateria"},{TipoVehiculo: "Moto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosBombas = await productosDB.find({$and:  [{TipoProducto : "Bomba"},{TipoVehiculo: "Moto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosGuardapolvos = await productosDB.find({$and:  [{TipoProducto : "Guardapolvo"},{TipoVehiculo: "Moto"}]}).sort({TipoProducto: 1, Codigo: 1})
    let productosValvulas = await productosDB.find({$and:  [{TipoProducto : "Valvula"},{TipoVehiculo: "Moto"}]}).sort({TipoProducto: 1, Codigo: 1})
    if(productosAmortiguadores.length > 0){
        for(i=0; i< productosAmortiguadores.length; i++){
            let amortiguador = await amortiguadoresDB.findOne({Codigo: productosAmortiguadores[i].Codigo})
            productosAmortiguadores[i].MarcaProducto = amortiguador.MarcaProducto
            productosAmortiguadores[i].ModeloProducto = amortiguador.ModeloProducto
            productosAmortiguadores[i].Posicion = amortiguador.Posicion
        }
    }
    if(productosBujias.length > 0){
        for(i=0; i< productosBujias.length; i++){
            let bujia = await bujiaDB.findOne({Codigo: productosBujias[i].Codigo})
            productosBujias[i].CodigoStock = bujia.CodigoStock 
            productosBujias[i].Referencia1 = bujia.Referencia1 
            productosBujias[i].Referencia2 = bujia.Referencia2
            productosBujias[i].Serie = bujia.Serie
        }
        productosBujias = productosBujias.map((data) => {
            if(data.Cantidad == 0){
                return{
                    Codigo: data.Codigo,
                    TipoVehiculo: data.TipoVehiculo,
                    Descripcion: data.Descripcion,
                    PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                    CodigoStock: data.CodigoStock,
                    Referencia1: data.Referencia1,
                    Referencia2: data.Referencia2,
                    Serie: data.Serie,
                    clase : "text-danger"
                }
            } else{
                return{
                    Codigo: data.Codigo,
                    TipoVehiculo: data.TipoVehiculo,
                    Descripcion: data.Descripcion,
                    PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                    CodigoStock: data.CodigoStock,
                    Referencia1: data.Referencia1,
                    Referencia2: data.Referencia2,
                    Serie: data.Serie,
                    clase : "text-dark"
                }
            }
        })
        
    }
    if(productosBases.length > 0){
        for(i=0; i< productosBases.length; i++){
            let base = await baseAmortiguadoresDB.findOne({Codigo: productosBases[i].Codigo})
            productosBases[i].MarcaProducto = base.MarcaProducto
            productosBases[i].Posicion = base.Posicion
        }
    }
    if(productosBaterias.length > 0){
        for(i=0; i< productosBaterias.length; i++){
            let bateria = await bateriasDB.findOne({Codigo: productosBaterias[i].Codigo})
            productosBaterias[i].Voltaje = bateria.Voltaje 
            productosBaterias[i].Carga = bateria.Carga
            productosBaterias[i].Polaridad = bateria.Polaridad
        }
        productosBaterias = productosBaterias.map((data) => {
            if(data.Cantidad == 0){
                return{
                    Codigo: data.Codigo,
                    TipoVehiculo: data.TipoVehiculo,
                    Descripcion: data.Descripcion,
                    PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                    Voltaje: data.Voltaje,
                    Carga: data.Carga,
                    Polaridad: data.Polaridad,
                    clase : "text-danger"
                }
            } else{
                return{
                    Codigo: data.Codigo,
                    TipoVehiculo: data.TipoVehiculo,
                    Descripcion: data.Descripcion,
                    PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                    Voltaje: data.Voltaje,
                    Carga: data.Carga,
                    Polaridad: data.Polaridad,
                    clase : "text-dark"
                }
            }
        })
        
    }
    productosAmortiguadores = productosAmortiguadores.map((data) => {
        if(data.Cantidad == 0){
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                MarcaProducto: data.MarcaProducto,
                ModeloProducto: data.ModeloProducto,
                Posicion: data.Posicion,
                clase : "text-danger"
            }
        }else{
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                MarcaProducto: data.MarcaProducto,
                ModeloProducto: data.ModeloProducto,
                Posicion: data.Posicion,
                clase : "text-dark"
            }
        }
    })
    productosBases = productosBases.map((data) => {
        if(data.Cantidad == 0){
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                MarcaProducto: data.MarcaProducto,
                Posicion: data.Posicion,
                clase : "text-danger"
            }
        }else{
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                MarcaProducto: data.MarcaProducto,
                Posicion: data.Posicion,
                clase : "text-dark"
            }
        }
    })

    productosBombas = productosBombas.map((data) => {
        if(data.Cantidad == 0){
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                clase : "text-danger"
            }
        }else{
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                clase : "text-dark"
            }
        }
    })
    productosGuardapolvos = productosGuardapolvos.map((data) => {
        if(data.Cantidad == 0){
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                clase : "text-danger"
            }
        }else{
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                clase : "text-dark"
            }
        }
    })
    productosValvulas = productosValvulas.map((data) => {
        if(data.Cantidad == 0){
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                clase : "text-danger"

            }
        }else{
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                clase : "text-dark"
            }
        }
    })
    let titulo  = "Lista de productos motos"
    let validacionProductosAmortiguadores = productosAmortiguadores.length 
    let validacionProductosBases = productosBases.length 
    let validacionProductosBaterias = productosBaterias.length 
    let validacionProductosBujia = productosBujias.length 
    let validacionProductosBombas = productosBombas.length 
    let validacionProductosGuardapolvos = productosGuardapolvos.length 
    let validacionProductosValvulas = productosValvulas.length 

    if(validacionProductosBujia.length == 0){
        validacionProductosBujia = false
    }else{
        validacionProductosBujia = true
    }
    if(validacionProductosAmortiguadores.length == 0){
        validacionProductosAmortiguadores = false
    }else{
        validacionProductosAmortiguadores = true
    }
    if(validacionProductosBases.length == 0){
        validacionProductosBases = false
    }else{
        validacionProductosBases = true
    }
    if(validacionProductosBaterias.length == 0){
        validacionProductosBaterias = false
    }else{
        validacionProductosBaterias = true
    }
    if(validacionProductosBombas.length == 0){
        validacionProductosBombas = false
    }else{
        validacionProductosBombas = true
    }
    if(validacionProductosGuardapolvos.length == 0){
        validacionProductosGuardapolvos = false
    }else{
        validacionProductosGuardapolvos = true
    }
    if(validacionProductosValvulas.length == 0){
        validacionProductosValvulas = false
    }else{
        validacionProductosValvulas = true
    }
    res.render('seller/lista-pdf',{
        layout:"reportes.hbs",
        productosAmortiguadores,
        productosBases,
        validacionProductosBujia,
        productosBujias,
        productosBaterias,
        productosBombas,
        productosGuardapolvos,
        productosValvulas,
        validacionProductosAmortiguadores,
        validacionProductosBases,
        validacionProductosBaterias,
        validacionProductosBombas,
        validacionProductosGuardapolvos,
        validacionProductosValvulas,
        titulo
    })

})
router.get('/descargar-lista-pdf-general', isAuthenticatedDuroc, async (req, res) => {
    let productosBujias = await productosDB.find({TipoProducto : "Bujia"}).sort({TipoProducto: 1, Codigo: 1})
    let productosAmortiguadores = await productosDB.find({TipoProducto : "Amortiguador"}).sort({TipoProducto: 1, Codigo: 1})
    let productosBases = await productosDB.find({TipoProducto : "Base amortiguador"}).sort({TipoProducto: 1, Codigo: 1})
    let productosBaterias = await productosDB.find({TipoProducto : "Bateria"}).sort({TipoProducto: 1, Codigo: 1})
    let productosBombas = await productosDB.find({TipoProducto : "Bomba"}).sort({TipoProducto: 1, Codigo: 1})
    let productosGuardapolvos = await productosDB.find({TipoProducto : "Guardapolvo"}).sort({TipoProducto: 1, Codigo: 1})
    let productosValvulas = await productosDB.find({TipoProducto : "Valvula"}).sort({TipoProducto: 1, Codigo: 1})
    if(productosAmortiguadores.length > 0){
        for(i=0; i< productosAmortiguadores.length; i++){
            let amortiguador = await amortiguadoresDB.findOne({Codigo: productosAmortiguadores[i].Codigo})
            productosAmortiguadores[i].MarcaProducto = amortiguador.MarcaProducto
            productosAmortiguadores[i].ModeloProducto = amortiguador.ModeloProducto
            productosAmortiguadores[i].Posicion = amortiguador.Posicion
        }
    }
    if(productosBases.length > 0){
        for(i=0; i< productosBases.length; i++){
            let base = await baseAmortiguadoresDB.findOne({Codigo: productosBases[i].Codigo})
            productosBases[i].MarcaProducto = base.MarcaProducto
            productosBases[i].Posicion = base.Posicion
        }
    }
    if(productosBujias.length > 0){
        for(i=0; i< productosBujias.length; i++){
            let bujia = await bujiaDB.findOne({Codigo: productosBujias[i].Codigo})
            productosBujias[i].CodigoStock = bujia.CodigoStock 
            productosBujias[i].Referencia1 = bujia.Referencia1 
            productosBujias[i].Referencia2 = bujia.Referencia2
            productosBujias[i].Serie = bujia.Serie
        }
        productosBujias = productosBujias.map((data) => {
            if(data.Cantidad == 0){
                return{
                    Codigo: data.Codigo,
                    TipoVehiculo: data.TipoVehiculo,
                    Descripcion: data.Descripcion,
                    PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                    CodigoStock: data.CodigoStock,
                    Referencia1: data.Referencia1,
                    Referencia2: data.Referencia2,
                    Serie: data.Serie,
                    clase : "text-danger"
                }
            } else{
                return{
                    Codigo: data.Codigo,
                    TipoVehiculo: data.TipoVehiculo,
                    Descripcion: data.Descripcion,
                    PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                    CodigoStock: data.CodigoStock,
                    Referencia1: data.Referencia1,
                    Referencia2: data.Referencia2,
                    Serie: data.Serie,
                    clase : "text-dark"
                }
            }
        })
        
    }
    if(productosBaterias.length > 0){
        for(i=0; i< productosBaterias.length; i++){
            let bateria = await bateriasDB.findOne({Codigo: productosBaterias[i].Codigo})
            productosBaterias[i].Voltaje = bateria.Voltaje 
            productosBaterias[i].Carga = bateria.Carga
            productosBaterias[i].Polaridad = bateria.Polaridad
        }
        productosBaterias = productosBaterias.map((data) => {
            if(data.Cantidad == 0){
                return{
                    Codigo: data.Codigo,
                    TipoVehiculo: data.TipoVehiculo,
                    Descripcion: data.Descripcion,
                    PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                    Voltaje: data.Voltaje,
                    Carga: data.Carga,
                    Polaridad: data.Polaridad,
                    clase : "text-danger"
                }
            } else{
                return{
                    Codigo: data.Codigo,
                    TipoVehiculo: data.TipoVehiculo,
                    Descripcion: data.Descripcion,
                    PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                    Voltaje: data.Voltaje,
                    Carga: data.Carga,
                    Polaridad: data.Polaridad,
                    clase : "text-dark"
                }
            }
        })
        
    }
    productosAmortiguadores = productosAmortiguadores.map((data) => {
        if(data.Cantidad == 0){
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                MarcaProducto: data.MarcaProducto,
                ModeloProducto: data.ModeloProducto,
                Posicion: data.Posicion,
                clase : "text-danger"
            }
        }else{
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                MarcaProducto: data.MarcaProducto,
                ModeloProducto: data.ModeloProducto,
                Posicion: data.Posicion,
                clase : "text-dark"
            }
        }
    })
    productosBases = productosBases.map((data) => {
        if(data.Cantidad == 0){
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                MarcaProducto: data.MarcaProducto,
                Posicion: data.Posicion,
                clase : "text-danger"
            }
        }else{
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                MarcaProducto: data.MarcaProducto,
                Posicion: data.Posicion,
                clase : "text-dark"
            }
        }
    })

    productosBombas = productosBombas.map((data) => {
        if(data.Cantidad == 0){
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                clase : "text-danger"
            }
        }else{
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                clase : "text-dark"
            }
        }
    })
    productosGuardapolvos = productosGuardapolvos.map((data) => {
        if(data.Cantidad == 0){
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                clase : "text-danger"
            }
        }else{
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                clase : "text-dark"
            }
        }
    })
    productosValvulas = productosValvulas.map((data) => {
        if(data.Cantidad == 0){
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                clase : "text-danger"

            }
        }else{
            return{
                Codigo: data.Codigo,
                TipoVehiculo: data.TipoVehiculo,
                Descripcion: data.Descripcion,
                PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
                clase : "text-dark"
            }
        }
    })
    let titulo  = "Lista de productos general"
    let validacionProductosBujia = productosBujias.length 
    let validacionProductosAmortiguadores = productosAmortiguadores.length 
    let validacionProductosBases = productosBases.length 
    let validacionProductosBaterias = productosBaterias.length 
    let validacionProductosBombas = productosBombas.length 
    let validacionProductosGuardapolvos = productosGuardapolvos.length 
    let validacionProductosValvulas = productosValvulas.length 

    if(validacionProductosBujia.length == 0){
        validacionProductosBujia = false
    }else{
        validacionProductosBujia = true
    }
    if(validacionProductosAmortiguadores.length == 0){
        validacionProductosAmortiguadores = false
    }else{
        validacionProductosAmortiguadores = true
    }
    if(validacionProductosBases.length == 0){
        validacionProductosBases = false
    }else{
        validacionProductosBases = true
    }
    if(validacionProductosBaterias.length == 0){
        validacionProductosBaterias = false
    }else{
        validacionProductosBaterias = true
    }
    if(validacionProductosBombas.length == 0){
        validacionProductosBombas = false
    }else{
        validacionProductosBombas = true
    }
    if(validacionProductosGuardapolvos.length == 0){
        validacionProductosGuardapolvos = false
    }else{
        validacionProductosGuardapolvos = true
    }
    if(validacionProductosValvulas.length == 0){
        validacionProductosValvulas = false
    }else{
        validacionProductosValvulas = true
    }
    res.render('seller/lista-pdf',{
        layout:"reportes.hbs",
        productosAmortiguadores,
        productosBases,
        productosBaterias,
        productosBombas,
        productosGuardapolvos,
        validacionProductosBujia,
        productosBujias,
        productosValvulas,
        validacionProductosAmortiguadores,
        validacionProductosBases,
        validacionProductosBaterias,
        validacionProductosBombas,
        validacionProductosGuardapolvos,
        validacionProductosValvulas,
        titulo
    })
})

router.get('/reportar-pago-vendedor', isAuthenticatedSeller ,async (req, res) => {
    let vendedor = await vendedoresDB.findOne({email: req.user.email})
    vendedor = {
        SaldoEnPosesion: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(vendedor.SaldoEnPosesion)
    }
    res.render('seller/reportar-pago',{
        layout:"seller.hbs",
        vendedor
    })
})


router.post('/solicitar-solicitudes-pago', isAuthenticatedSeller,async (req, res) => {
    let {tipoSolicitud} = req.body
    let _idVendedor = await vendedoresDB.findOne({email: req.user.email})
    _idVendedor = _idVendedor._id
    if(tipoSolicitud == "Ingreso" ){
        let solicitudesPago = await solicitudesPagoDB.find({_idVendedor: _idVendedor}).sort({Timestamp: -1, Estado: 1})
        solicitudesPago = solicitudesPago.map((data) => {
            return{
                Fecha: data.Fecha,
                Timestamp: data.Timestamp,
                SolicitadoPor: data.SolicitadoPor,
                Vendedor: data.Vendedor,
                _idVendedor: data._idVendedor,
                NumeroSolicitud: data.NumeroSolicitud,
                Estado: data.Estado,
                Transaccion: data.Transaccion,
                Monto: data.Monto,
                Modalidad: data.Modalidad,
                Comentario: data.Comentario,
                Cliente: data.Cliente,
                Documento: data.Documento,
                Direccion: data.Direccion,
                Celular: data.Celular,
                PendienteAPagar: data.PendienteAPagar,
                TipoSolicitud: "Ingreso",
                _id: data._id
            }
        })
        res.send(JSON.stringify(solicitudesPago))
    }else{
        let solicitudesEgresos = await solicitudesEgresosDB.find({_idVendedor: _idVendedor}).sort({Timestamp: -1, Estado: 1})
        solicitudesEgresos = solicitudesEgresos.map((data) => {
            return{
                Fecha: data.Fecha,
                Timestamp: data.Timestamp,
                Vendedor: data.Vendedor,
                _idVendedor: data._idVendedor,
                NumeroSolicitud: data.NumeroSolicitud,
                Estado: data.Estado,
                MontoTotal: data.MontoTotal,
                TipoSolicitud: "Egreso",
                Comentario: data.Comentario,
                _id: data._id
            }
        }) 
        res.send(JSON.stringify(solicitudesEgresos))
    }
})


router.get('/reportar-ingreso-vendedor', isAuthenticatedSeller ,async (req, res) => {
    let _idVendedor = await vendedoresDB.findOne({email: req.user.email})
    let clientes = await clientesDB.find({_idVendedor: _idVendedor._id})
    clientes = clientes.map((data) => {
        return{
            Empresa: data.Empresa
        }
    })

    res.render('seller/reportar-ingreso',{
        layout:"seller.hbs",
        clientes
    })
})


router.post('/registrar-nueva-solicitud-de-ingreso-vendedor', isAuthenticatedSeller ,async (req, res) => {
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
        SolicitadoPor: "Vendedor", 
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
    res.redirect('/reportar-ingreso-vendedor')
})


router.get('/ver-solicitud-de-pago/:id', isAuthenticatedDuroc ,async (req, res) => {
    let solicitudPago = await solicitudesPagoDB.findById(req.params.id)
    solicitudPago = {
        Fecha: solicitudPago.Fecha, 
        Timestamp: solicitudPago.Timestamp, 
        SolicitadoPor: solicitudPago.SolicitadoPor, 
        Vendedor: solicitudPago.Vendedor, 
        _idVendedor: solicitudPago._idVendedor, 
        NumeroSolicitud: solicitudPago.NumeroSolicitud, 
        Estado: solicitudPago.Estado, 
        Transaccion: solicitudPago.Transaccion, 
        Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(solicitudPago.Monto), 
        Modalidad: solicitudPago.Modalidad, 
        Comentario: solicitudPago.Comentario, 
        Cliente: solicitudPago.Cliente, 
        Documento: solicitudPago.Documento, 
        Direccion: solicitudPago.Direccion, 
        Celular: solicitudPago.Celular, 
        Facturas: solicitudPago.Facturas.map((data) => {
            return{
                NotaEntrega: data.NotaEntrega,
                Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Monto),
                SaldoFavor: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.SaldoFavor),
                Modalidad: data.Modalidad,
                Comentario: data.Comentario,
            }
        }), 
    }
    res.render('seller/ver-solicitud-pago',{
        layout:"reportes.hbs",
        solicitudPago,
    })

})

router.get('/ver-solicitud-de-egreso/:id', isAuthenticatedSeller, async (req, res) => {
    let solicitudEgreso = await solicitudesEgresosDB.findById(req.params.id)
    solicitudEgreso = {
        Fecha: solicitudEgreso.Fecha,
        Timestamp: solicitudEgreso.Timestamp,
        Vendedor: solicitudEgreso.Vendedor,
        _idVendedor: solicitudEgreso._idVendedor,
        NumeroSolicitud: solicitudEgreso.NumeroSolicitud,
        Estado: solicitudEgreso.Estado,
        MontoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(solicitudEgreso.MontoTotal),
        Egresos: solicitudEgreso.Egresos.map((data) => {
            return{
                Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Monto),
                Comentario: data.Comentario,
            }
        }),
    }
    res.render('seller/ver-solicitud-egreso',{
        layout:"reportes.hbs",
        solicitudEgreso
    })
})



router.get('/reportar-egreso-vendedor', isAuthenticatedSeller ,async (req, res) => {
    let vendedor = await vendedoresDB.findOne({email: req.user.email})
    if(vendedor.SaldoEnPosesion == 0){
        req.flash("error", "No puede reportar egresos ya que no cuenta con saldo en posesión.")
        res.redirect('/reportar-pago-vendedor')
    }else{
        let SaldoEnPosesion = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(vendedor.SaldoEnPosesion)
        res.render('seller/reportar-egreso',{
            layout:"seller.hbs",
            SaldoEnPosesion
        })
    }
})


router.post('/enviar-nuevo-egreso-vendedor', isAuthenticatedSeller, async (req, res) => {
    let {Fecha, Timestamp, Estado, MontoTotal, Egresos,} = req.body
    let egresos = await solicitudesEgresosDB.find().sort({NumeroSolicitud: -1})
    let vendedor = await vendedoresDB.findOne({email: req.user.email})
    let NumeroSolicitud = 0
    if(egresos.length == 0){
        NumeroSolicitud = 700000001
    }else{
        NumeroSolicitud = egresos[0].NumeroSolicitud + 1
    }
    let nuevaSolicitudEgreso = new solicitudesEgresosDB({
        Fecha: Fecha, 
        Timestamp: Timestamp, 
        Vendedor: `${vendedor.Nombres} ${vendedor.Apellidos}`, 
        _idVendedor: vendedor._id, 
        NumeroSolicitud: NumeroSolicitud, 
        Estado: Estado, 
        MontoTotal: MontoTotal, 
        Egresos: Egresos, 
    })
    await nuevaSolicitudEgreso.save()
    res.send(JSON.stringify("ok"))

})

router.get('/ventas-seller', isAuthenticatedSeller ,async (req, res) => {
    let vendedor = await vendedoresDB.findOne({email: req.user.email})
    let Clientes = await clientesDB.find({_idVendedor: vendedor._id})
    let notaEntrega = await notasEntregaDB.find({_idVendedor: vendedor._id}).sort({"Timestamp": -1})
    let notasTotales = 0
    let netoTotal = 0
    let saldoTotal = 0
    Clientes = Clientes.map((data) => {
        return{
            Empresa: data.Empresa
        }
    })

    for(i=0; i< notaEntrega.length; i++){
        notasTotales++
        netoTotal += +notaEntrega[i].Neto
        saldoTotal += +notaEntrega[i].Saldo
    }

    netoTotal = netoTotal.toFixed(2) 
    saldoTotal = saldoTotal.toFixed(2) 
    netoTotal = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotal)
    saldoTotal = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(saldoTotal)

    notaEntrega = notaEntrega.map((data) => {
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
            Neto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Neto),
            Neto2: data.Neto2,
            Saldo: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Saldo),
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
    res.render('seller/todas-ventas',{
        layout:"seller.hbs",
        notaEntrega,
        notasTotales,
        netoTotal,
        Clientes,
        saldoTotal,
    })
})

router.post('/solicitar-ventas-por-cliente', isAuthenticatedSeller ,async (req, res) => {
    let {Cliente}  = req.body
    let notaEntrega = await notasEntregaDB.find({Cliente: Cliente}).sort({"Timestamp":-1})
    let notasTotales = 0
    let netoTotal = 0
    let saldoTotal = 0

    for(i=0; i< notaEntrega.length; i++){
        notasTotales++
        netoTotal += +notaEntrega[i].Neto
        saldoTotal += +notaEntrega[i].Saldo
    }
    netoTotal = netoTotal.toFixed(2) 
    saldoTotal = saldoTotal.toFixed(2) 
    netoTotal = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotal)
    saldoTotal = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(saldoTotal)
    notaEntrega = notaEntrega.map((data) => {
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
            Neto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Neto),
            Neto2: data.Neto2,
            Saldo: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Saldo),
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

    let data = {
        notaEntrega,
        notasTotales,
        netoTotal,
        saldoTotal,
    }
    res.send(JSON.stringify(data))

})


router.get('/ventas-por-productos-seller', isAuthenticatedSeller, async (req, res) => {
    let producto = await productosDB.find().sort({TipoProducto:1, Codigo:1})
    let vendedor = await vendedoresDB.findOne({email: req.user.email})
    let notaEntrega = await notasEntregaDB.find({_idVendedor: vendedor._id}).sort({"Timestamp": -1})
    producto = producto.map((data) => {
        return{
            Codigo: data.Codigo,
            TipoProducto: data.TipoProducto,
            Descripcion: data.Descripcion,
            _id: data._id
        }
    })
    let data = []
    for(r=0; r < notaEntrega.length; r++){
        for(i=0; i< producto.length; i++){
            let codigo = notaEntrega[r].Productos.find((doc) => doc.Codigo == producto[i].Codigo)
            if(codigo){
                validacion = data.find((doc) => doc.Codigo == producto[i].Codigo)
                if(validacion){
                    let CantidadVendida = +validacion.CantidadVendida + +codigo.Cantidad
                    let ValorVendido = +validacion.ValorVendido + +codigo.PrecioTotal
                    data = data.filter((doc) => doc.Codigo != producto[i].Codigo)
                    let subdata = {
                        Codigo: producto[i].Codigo, 
                        TipoProducto: producto[i].TipoProducto, 
                        Descripcion: producto[i].Descripcion, 
                        CantidadVendida: CantidadVendida, 
                        ValorVendido: ValorVendido, 
                        _id: producto[i]._id, 
                    }
                    data.push(subdata)
                }else{
                    let subdata = {
                        Codigo: producto[i].Codigo, 
                        TipoProducto: producto[i].TipoProducto, 
                        Descripcion: producto[i].Descripcion, 
                        CantidadVendida: codigo.Cantidad, 
                        ValorVendido: codigo.PrecioTotal, 
                        _id: producto[i]._id, 
                    }
                    data.push(subdata)
                }
            }
        }
    }
    data.sort(function (a, b) {
        if (+a.CantidadVendida > +b.CantidadVendida) {
          return -1;
        }
        if (+a.CantidadVendida < +b.CantidadVendida) {
          return 1;
        }
        return 0;
    });
    data = data.map((data) => {
        return{
            Codigo: data.Codigo,
            TipoProducto: data.TipoProducto,
            Descripcion: data.Descripcion,
            CantidadVendida: data.CantidadVendida,
            ValorVendido: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.ValorVendido),
            _id: data._id,
        }
    })

    res.render('seller/ventas-por-productos',{
        layout:"seller.hbs",
        data,
        producto
    })
})

router.post('/solicitar-ventas-por-producto', isAuthenticatedSeller, async (req, res) => {
    let {Codigo}  =req.body
    let producto = await productosDB.find({Codigo: Codigo}).sort({TipoProducto:1, Codigo:1})
    let vendedor = await vendedoresDB.findOne({email: req.user.email})
    let notaEntrega = await notasEntregaDB.find({_idVendedor: vendedor._id}).sort({"Timestamp": -1})
    producto = producto.map((data) => {
        return{
            Codigo: data.Codigo,
            TipoProducto: data.TipoProducto,
            Descripcion: data.Descripcion,
            _id: data._id
        }
    })
    let data = []
    for(r=0; r < notaEntrega.length; r++){
        for(i=0; i< producto.length; i++){
            let codigo = notaEntrega[r].Productos.find((doc) => doc.Codigo == producto[i].Codigo)
            if(codigo){
                validacion = data.find((doc) => doc.Codigo == producto[i].Codigo)
                if(validacion){
                    let CantidadVendida = +validacion.CantidadVendida + +codigo.Cantidad
                    let ValorVendido = +validacion.ValorVendido + +codigo.PrecioTotal
                    data = data.filter((doc) => doc.Codigo != producto[i].Codigo)
                    let subdata = {
                        Codigo: producto[i].Codigo, 
                        TipoProducto: producto[i].TipoProducto, 
                        Descripcion: producto[i].Descripcion, 
                        CantidadVendida: CantidadVendida, 
                        ValorVendido: ValorVendido, 
                        _id: producto[i]._id, 
                    }
                    data.push(subdata)
                }else{
                    let subdata = {
                        Codigo: producto[i].Codigo, 
                        TipoProducto: producto[i].TipoProducto, 
                        Descripcion: producto[i].Descripcion, 
                        CantidadVendida: codigo.Cantidad, 
                        ValorVendido: codigo.PrecioTotal, 
                        _id: producto[i]._id, 
                    }
                    data.push(subdata)
                }
            }
        }
    }
    data.sort(function (a, b) {
        if (+a.CantidadVendida > +b.CantidadVendida) {
          return -1;
        }
        if (+a.CantidadVendida < +b.CantidadVendida) {
          return 1;
        }
        return 0;
    });
    data = data.map((data) => {
        return{
            Codigo: data.Codigo,
            TipoProducto: data.TipoProducto,
            Descripcion: data.Descripcion,
            CantidadVendida: data.CantidadVendida,
            ValorVendido: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.ValorVendido),
            _id: data._id,
        }
    })
    res.send(JSON.stringify(data))

})


router.get('/ver-detalles-ventas-producto/:id', isAuthenticatedDuroc ,async (req, res) => {
    let producto = await productosDB.findById(req.params.id)
    let vendedor = await vendedoresDB.findOne({email: req.user.email})
    let notasEntrega = await notasEntregaDB.find({_idVendedor: vendedor._id})
    let data = []
    for(i=0; i< notasEntrega.length; i++){
        let codigoExiste =  notasEntrega[i].Productos.find((doc) => doc.Codigo == producto.Codigo)
        if(codigoExiste){
            let validacion = data.find((doc) => doc.Cliente == notasEntrega[i].Cliente)
            if(validacion){
                //sumamos existente
                data = data.filter((doc) => doc.Codigo != producto.Codigo)
                let cantidad = +codigoExiste.Cantidad + +validacion.Cantidad
                let Precio = +validacion.Precio + +validacion.Precio
                let subdata = {
                    Cliente: validacion.Cliente, 
                    Codigo: validacion.Codigo, 
                    Cantidad: cantidad, 
                    Descripcion: validacion.Descripcion, 
                    Precio: Precio, 
                }
                data.push(subdata)

            }else{
                //creamos nueva
                let subdata = {
                    Cliente: notasEntrega[i].Cliente,
                    Codigo: producto.Codigo,
                    Cantidad: codigoExiste.Cantidad,
                    Descripcion: codigoExiste.Descripcion,
                    Precio: codigoExiste.PrecioTotal,
                }
                data.push(subdata)
            }
        }
    }
    data.sort(function (a, b) {
        if (+a.Cantidad > +b.Cantidad) {
          return -1;
        }
        if (+a.Cantidad < +b.Cantidad) {
          return 1;
        }
        return 0;
    });
    res.render('admin/archivos_pdf/ventas-por-productos',{
        layout:"reportes.hbs",
        data
    })
})


router.post('/cambiando-cantidad-dias-credito', isAuthenticatedSeller, async (req, res) => {
    let {Dias, Cliente} = req.body
    let orden = await ordenCompraTemporalSCDB.findOne({Cliente: Cliente})
    await ordenCompraTemporalSCDB.findByIdAndUpdate(orden._id,{
        DiasCredito: Dias
    })

})

router.get('/calculos-comision-vendedor', isAuthenticatedSeller, async (req, res) => {
    let vendedor = await vendedoresDB.findOne({email: req.user.email})
    let calculoComison = await calculoComisonDB.find({_idVendedor: vendedor._id}).sort({"Timestamp": -1})
    let documentosEmitidos = calculoComison.length
    let documentosPendientesPago = 0
    let comisionTotalGenerada = 0
    let comisionPendiente = 0
    for(i=0; i< calculoComison.length; i++){
        if(calculoComison[i].Estado == "Por pagar"){
            documentosPendientesPago++
            comisionPendiente += +calculoComison[i].Saldo
        }
        comisionTotalGenerada += +calculoComison[i].Neto
    }
    comisionTotalGenerada = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(comisionTotalGenerada)
    comisionPendiente = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(comisionPendiente)


    calculoComison = calculoComison.map((data) => {
        return{
            Timestamp: data.Timestamp,
            Numero: data.Numero,
            Fecha: data.Fecha,
            Vendedor: data.Vendedor,
            Cedula: data.Cedula,
            Direccion: data.Direccion,
            _idVendedor: data._idVendedor,
            Neto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Neto),
            CantidadNotas: data.CantidadNotas,
            Saldo: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Saldo),
            Estado: data.Estado,
        }
    })
    res.render('seller/estado-cuenta/calculos-comision',{
        layout:"Seller.hbs",
        documentosEmitidos,
        documentosPendientesPago,
        comisionTotalGenerada,
        comisionPendiente,
        calculoComison
    })
})

router.get('/ver-historial-calculo-comision-vendedor/:id', isAuthenticatedSeller ,async (req, res) => {
    let notaEntrega = await calculoComisonDB.findOne({Numero: req.params.id})
    let Numero = notaEntrega.Numero
    let historial = notaEntrega.HistorialPago.map((data) => {
        return{
            Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Pago),
            Comentario: data.Comentario,
            Recibo: data.Recibo,
            Modalidad: data.Modalidad,
            Fecha: data.FechaPago,
            user: data.user,
            Timestamp: data.Timestamp,
            link: `/ver-recibo-pago-comision/${data.Recibo}`
        }
    })
    historial.sort(function (a, b) {
        if (+a.Timestamp > +b.Timestamp) {
          return -1;
        }
        if (+a.Timestamp < +b.Timestamp) {
          return 1;
        }
        return 0;
    });

    res.render('admin/facturacion/historial-notas',{
        layout:"seller.hbs",
        historial,
        Numero
    })
})


module.exports = router
