const router = require("express").Router();
const path = require("path");
const passport = require('passport');
const usersDB = require('../models/users')
const vendedoresDB = require('../models/vendedores')
const clientesDB = require('../models/clientes')
const proveedorDB = require('../models/proveedor')
const bateriasDB = require('../models/baterias')
const bombasDB = require('../models/bombas')
const guardapolvosDB = require('../models/guardapolvos')
const bujiaDB = require('../models/bujias')
const baseAmortiguadoresDB = require('../models/base-amortiguadores')
const valvulasDB = require('../models/valvulas')
const amortiguadoresDB = require('../models/amortiguadores')
const productosDB = require('../models/productos')
const transporteDB = require('../models/transporte')
const estructuraCostosDB = require('../models/estructuraCostos')
const notasEntregaDB = require('../models/notasEntregas')
const cambioFacturacionDB = require('../models/cambioFacturacion')
const comisionesDB = require('../models/comisiones') 
const notastransporteDB = require('../models/notasTransporte') 
const ventasBasesGeneralDB = require('../models/ventasBasesGeneral') 
const ventasBujiasGeneralDB = require('../models/ventasBujiasGeneral') 
const ventasValvulasGeneralDB = require('../models/ventasValvulasGeneral') 
const ventasGuardapolvoGeneralDB = require('../models/ventasGuardapolvoGeneral') 
const ventasAmortiguadoresGeneralDB = require('../models/ventasAmortiguadoresGeneral') 
const ventasBujiasMesDB = require('../models/ventasBujiasMes') 
const ventasBasesMesDB = require('../models/ventasBasesMes') 
const ventasValvulasMesDB = require('../models/ventasValvulasMes') 
const ventasGuardapolvoMesDB = require('../models/ventasGuardapolvoMes') 
const ventasAmortiguadoresMesDB = require('../models/ventasAmortiguadoresMes') 
const ventasBateriasGeneralDB = require('../models/ventasBateriasGeneral') 
const ventasBateriasMesDB = require('../models/ventasBateriasMes') 
const ventasBombasGeneralDB = require('../models/ventasBombasGeneral') 
const ventasBombasMesDB = require('../models/ventasBombasMes') 
const ventasBujesGeneralDB = require('../models/ventasBujesGeneral') 
const ventasBujesMesDB = require('../models/ventasbujesMes') 
const ventasGeneralDB = require('../models/ventasGeneral') 
const ventasGeneralClientesDB = require('../models/ventasGeneralClientes') 
const ventasGeneralVendedoresDB = require('../models/ventasGeneralVendedores') 
const ventasMesesDB = require('../models/ventasMeses') 
const ventasMesesClientesDB = require('../models/ventasMesesClientes') 
const ventasMesesVendedoresDB = require('../models/ventasMesesVendedores') 
const ventasZonasDB = require('../models/ventasZonas') 
const ventasZonasMesDB = require('../models/ventasZonasMes') 
const utilidadesGeneralDB = require('../models/utilidadesGeneral')
const utilidadesPorMesDB = require('../models/utilidadesPorMes')
const notasComisionesDB = require('../models/notasComisiones')
const facturasDB = require('../models/facturas')
const calificacionDB = require('../models/calificacion')
const tareasDB = require('../models/tareas')
const ordenProveedorTemporalDB = require('../models/ordenCompraTemporal')
const ordenProveedorDB = require('../models/ordenCompraProveedor')
const ordenComprasClientesDB = require('../models//seller/ordenesCompra')
const reportesDB = require('../models//seller/reportes')
const garantiasDB = require('../models/garantias')
const notasPagoDB = require('../models/notasPago')
const notasDevolucionDB = require('../models/notasDevolucion')
const transaccionesCobranzaDB = require('../models/transaccionesCobranza')
const solicitudesDevolucionesDB = require('../models/solicitudes-de-devoluciones')
const modelosDB = require('../models/modelos')
const marcasDB = require('../models/marcas')
const ciudadesDB = require('../models/ciudades')
const solicitudesClientesDB = require('../models/solicitudesClientes')
const solicitudesPagoDB = require('../models/solicitudes-de-pago')
const solicitudesEgresosDB = require('../models/solicitudes-egresos')
const recibosVueltosDB = require('../models/recibosVuelto')
const calculoComisonDB = require('../models/calculosComision')
const stockCopiaDB = require('../models/stockCopiar')
const { isAuthenticatedDuroc } = require("../helpers/auth");
const { isAuthenticatedMaster } = require("../helpers/auth");
const { isAuthenticatedUsuariosAdministrativos } = require("../helpers/auth");
const { isAuthenticatedCliente } = require("../helpers/auth");
const { isAuthenticatedContabilidad } = require("../helpers/auth");
const { isAuthenticatedEstadisticas } = require("../helpers/auth");
const { isAuthenticatedFacturacion } = require("../helpers/auth");
const { isAuthenticatedInventario } = require("../helpers/auth");
const { isAuthenticatedProveedor } = require("../helpers/auth");
const { isAuthenticatedRegistro } = require("../helpers/auth");
const { isAuthenticatedTareas } = require("../helpers/auth");
const { isAuthenticatedTransporte } = require("../helpers/auth");
const { isAuthenticatedVendedor } = require("../helpers/auth");
const { isAuthenticatedSeller } = require("../helpers/auth");
const { isAuthenticatedClient } = require("../helpers/auth");


const multer = require("multer")
const storage = multer.diskStorage({
    destination: path.join(__dirname, "controles"),
    filename: function(req, file,cb){
        cb("","control.xlsx")
    }
})
const upload = multer({
    storage: storage
})
const XLSX = require("xlsx");


router.get('/', async (req, res) => {
    res.redirect("/iniciar-sesion")
})


router.get('/home', isAuthenticatedDuroc,async (req, res) => {
    let Cliente = req.user.Role.find((element) => element == "Client");
    let Seller = req.user.Role.find((element) => element == "Seller");
    if(Seller) {
        res.redirect("/home-seller");
        return
    }
    if(Cliente){
        res.redirect("/home-client");
        return
    }
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
    let tareas = await tareasDB.find({Estado:"Pendiente"}).sort({}).sort({Timestamp:-1})
    let notasEntregaVencida = await notasEntregaDB.find({$and : [{Estado: "Por pagar"},{Vencimiento: {$lte: Fecha}}]})
    let notasEntregaProximasVencer = await notasEntregaDB.find({$and : [{Estado: "Por pagar"},{Vencimiento: {$gte: Fecha}}, {Vencimiento: {$lte: Fecha2}}]})
    let solicitudesEgresos = await solicitudesEgresosDB.find({Estado: "Enviada"}).sort({Timestamp:-1})
    let solicitudesIngresos = await solicitudesPagoDB.find({Estado: "Enviada"}).sort({Timestamp:-1})
    let vendedores = await vendedoresDB.find({SaldoEnPosesion: {$gt: 0}}).sort({Nombres: 1, Apellidos: 1 })
    vendedores = vendedores.map((data) => {
        return{
            Nombres: `${data.Nombres} ${data.Apellidos}`,
            SaldoEnPosesion: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.SaldoEnPosesion)
        }
    })
    let solicitudes = []
    for(i=0; i < solicitudesEgresos.length; i++){
        let data = {
            Fecha: solicitudesEgresos[i].Fecha, 
            Tipo: "Egreso", 
            Cliente: "-", 
            Vendedor: solicitudesEgresos[i].Vendedor, 
            Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(solicitudesEgresos[i].MontoTotal), 
        }
        solicitudes.push(data)
    }
    for(i=0; i < solicitudesIngresos.length; i++){
        let data = {
            Fecha: solicitudesIngresos[i].Fecha, 
            Tipo: "Ingreso", 
            Cliente: solicitudesIngresos[i].Cliente, 
            Vendedor: solicitudesIngresos[i].Vendedor, 
            Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(solicitudesIngresos[i].MontoTotal), 
        }
        solicitudes.push(data)
    }
    solicitudes.sort(function (a, b) {
        if (+a.Timestamp > +b.Timestamp) {
          return -1;
        }
        if (+a.Timestamp < +b.Timestamp) {
          return 1;
        }
        return 0;
    });

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

    res.render('admin/inicio',{
        notasEntregaVencida,
        solicitudes,
        notasEntregaProximasVencer,
        vendedores,
        tareas,
        nombres
    })
}) 

router.get('/iniciar-sesion', async (req, res) => {
    res.render('login/sign-in',{
        layout:"sign-in"
    })
})

router.post("/sign-in", passport.authenticate('local',{
    successRedirect: '/home',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true
}));

router.get('/registro-usuarios', async (req, res) => {
    res.render('login/register',{
        layout:"sign-in"
    })
})




router.get('/log-out', (req, res) =>{
    req.logOut();
    res.redirect('/iniciar-sesion')
} )

router.get('/registrar-usuarios', isAuthenticatedRegistro, (req, res) => {
    res.render('admin/registro/usuarios')
})

router.post('/registrar-nuevo-usuario', isAuthenticatedRegistro,async (req, res) => {
    let {Nombres, Apellidos, Cedula, Usuario, Role, email, emailConfirm, password, passwordConfirm} = req.body
    let errors = []
    if(!Nombres || Nombres == "" || Nombres== 0){
        errors.push({text:'El campo "Nombres" no puede estar vacío.'})
    }
    if(!Apellidos || Apellidos == "" || Apellidos== 0){
        errors.push({text:'El campo "Apellidos" no puede estar vacío.'})
    }
    if(!Cedula || Cedula == "" || Cedula== 0){
        errors.push({text:'El campo "Cedula" no puede estar vacío.'})
    }
    if(!Usuario || Usuario == "" || Usuario== 0){
        errors.push({text:'El campo "Nombre de usuario" no puede estar vacío.'})
    }
    if(!Role || Role == "" || Role== 0){
        errors.push({text:'El campo "Role" no puede estar vacío.'})
    }
    if(!email || email == "" || email== 0){
        errors.push({text:'El campo "Correo electronico" no puede estar vacío.'})
    }
    if(!emailConfirm || emailConfirm == "" || emailConfirm== 0){
        errors.push({text:'El campo "Confirmar correo electronico" no puede estar vacío.'})
    }
    if(!password || password == "" || password== 0){
        errors.push({text:'El campo "Contraseña" no puede estar vacío.'})
    }
    if(password.length < 7){
        errors.push({text:'La contraseña debe incluir minimo 7 caracteres.'})
    }
    if(!passwordConfirm || passwordConfirm == "" || passwordConfirm== 0){
        errors.push({text:'El campo "Confirmar contraseña" no puede estar vacío.'})
    }
    if(email != emailConfirm){
        errors.push({text:'Los correos ingresados no coinciden.'})
    }
    if(password != passwordConfirm){
        errors.push({text:'Las contraseñas ingresadas no coinciden.'})
    }
    if(errors.length > 0){
        res.render('admin/registro/usuarios',{
            Nombres, 
            Apellidos, 
            Cedula, 
            Usuario, 
            Role, 
            email, 
            emailConfirm, 
            password, 
            passwordConfirm,
            errors
        })

    }else{
        email = email.toLowerCase()
        let nuevoUsuario = new usersDB({
            Empresa: `${Nombres} ${Apellidos} `,
            Nombres, 
            Apellidos, 
            Cedula, 
            Usuario, 
            Role, 
            email, 
            password,
        })
        nuevoUsuario.password = await nuevoUsuario.encryptPassword(password);
        nuevoUsuario.save()
        req.flash("success", "Usuario registrado correctamente.")
        res.redirect("/registrar-usuarios")
    }
})

router.get('/registrar-clientes', isAuthenticatedRegistro, async  (req, res) => {
    let vendedores = await vendedoresDB.find().sort({Nombres: 1})
    vendedores = vendedores.map((data) => {
        return{
            Nombres: data.Nombres,
            Apellidos: data.Apellidos,
            _id: data._id,
        }
    })
    res.render('admin/registro/clientes',{
        vendedores
    })
})

router.get('/registrar-transporte', isAuthenticatedRegistro, async (req, res) => {
    let ciudades = await ciudadesDB.find().sort({"Nombre":1})
    ciudades = ciudades.map((data) =>{
        return{
            Nombre: data.Nombre
        }
    })
    res.render('admin/registro/transporte',{
        ciudades
    })
})

router.get('/registrar-vendedores', isAuthenticatedRegistro, async (req, res) => {
    res.render('admin/registro/vendedores')
})

router.get('/registrar-proveedores', isAuthenticatedRegistro, async (req, res) => {
    res.render('admin/registro/proveedores')
})

router.get('/registrar-inventario', isAuthenticatedRegistro, async (req,res) => {
    res.render('admin/registro/eleccion-inventario-crear')
})

router.post('/registrar-vendedores', isAuthenticatedRegistro, async (req, res) => {
    let {Nombres, Apellidos, Cedula, Direccion, Celular, CodigoCeular,email, Zona, CodigoPostal, Porcentaje} = req.body
    let errors = []
    email = email.toLowerCase()
    if(!Porcentaje || Porcentaje == "" || Porcentaje == 0){
        errors.push({text: 'El campo "Porcentaje de ganancia" no puede estar vacío.'})
    }
    if(!Nombres || Nombres == "" || Nombres == 0){
        errors.push({text: 'El campo "Nombres" no puede estar vacío.'})
    }
    if(!Apellidos || Apellidos == "" || Apellidos == 0){
        errors.push({text: 'El campo "Apellidos" no puede estar vacío.'})
    }
    if(!Cedula || Cedula == "" || Cedula == 0){
        errors.push({text: 'El campo "Cédula" no puede estar vacío.'})
    }
    if(!Direccion || Direccion == "" || Direccion == 0){
        errors.push({text: 'El campo "Dirección" no puede estar vacío.'})
    }
    if(!Celular || Celular == "" || Celular == 0){
        errors.push({text: 'El campo "Celular" no puede estar vacío.'})
    }
    if(!email || email == "" || email == 0){
        errors.push({text: 'El campo "Correo electronico" no puede estar vacío.'})
    }
    if(!CodigoCeular || CodigoCeular == "" || CodigoCeular == 0){
        errors.push({text: 'Debe seleccionar un código en el campo "Número celular".'})
    }
    if(!Zona || Zona == "" || Zona == 0){
        errors.push({text: 'El campo "Zona" no puede estar vacío.'})
    }
    if(!CodigoPostal || CodigoPostal == "" || CodigoPostal == 0){
        errors.push({text: 'El campo "Código postal" no puede estar vacío.'})
    }if(errors.length >0 ){
        res.render('admin/registro/vendedores',{
            errors,
            Nombres, 
            Apellidos, 
            Cedula, 
            Direccion, 
            Celular, 
            email, 
            Zona, 
            Porcentaje,
            CodigoPostal
        })
    }else{
        function capitalizarPalabras( val ) {
  
            return val.toLowerCase()
                      .trim()
                      .split(' ')
                      .map( v => v[0].toUpperCase() + v.substr(1) )
                      .join(' ');  
          }
          Nombres = capitalizarPalabras(Nombres)
          Apellidos = capitalizarPalabras(Apellidos)
          Direccion = capitalizarPalabras(Direccion)
        let nuevoVendedor = new vendedoresDB({
            Nombres, 
            Apellidos, 
            Cedula, 
            Direccion, 
            Celular, 
            CodigoCeular,
            email, 
            Zona, 
            Porcentaje,
            CodigoPostal
        })
        await nuevoVendedor.save()
        req.flash("success","Vendedor registrado correctamente")
        res.redirect('/registrar-vendedores')
    }
})


router.post('/registrar-nuevo-cliente', isAuthenticatedRegistro ,async (req, res) => {
    let {Nombres, Apellidos, Cedula, Empresa, RIF, Direccion, Celular, Telefono, email, Zona, CodigoPostal, Vendedor,
        MaximoCredito, CodigoCeular, CodigoTelefono} = req.body
    let errors = []
    email = email.toLowerCase()
    if(!Empresa || Empresa == "" || Empresa == 0){
        errors.push({text: 'El campo "Empresa o negocio" no puede estar vacío.'})
    }
    if(!RIF || RIF == "" || RIF == 0){
        errors.push({text: 'El campo "RIF" no puede estar vacío.'})
    }
    if(!Direccion || Direccion == "" || Direccion == 0){
        errors.push({text: 'El campo "Dirección fiscal" no puede estar vacío.'})
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
    if(!MaximoCredito || MaximoCredito == "" || MaximoCredito == 0){
        errors.push({text: 'El campo "Días de credito" no puede estar vacío.'})
    }
    if(!Vendedor || Vendedor == "" || Vendedor == 0){
        errors.push({text: 'El campo "Vendedor" no puede estar vacío.'})
    }if(errors.length > 0){
 
        let vendedores = await vendedoresDB.find().sort({Nombres: 1})
        vendedores = vendedores.map((data) => {
            return{
                Nombres: data.Nombres,
                Apellidos: data.Apellidos,
                _id: data._id,
            }
        })
        res.render('admin/registro/clientes',{
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
        let solicitud = await solicitudesClientesDB.findOne({Empresa:Empresa})
        if(solicitud){
            await solicitudesClientesDB.findByIdAndDelete(solicitud._id)
        }
        function capitalizarPalabras( val ) {
  
            return val.toLowerCase()
                      .trim()
                      .split(' ')
                      .map( v => v[0].toUpperCase() + v.substr(1) )
                      .join(' ');  
          }
          if(Nombres){
              console.log("Nombres")
              Nombres = capitalizarPalabras(Nombres)
            }
            if(Apellidos){
              console.log("Apellidos")
              Apellidos = capitalizarPalabras(Apellidos)
            }
            if(Direccion){
              console.log("Direccion")
              Direccion = capitalizarPalabras(Direccion)
            }
            if(Empresa){
              console.log("Empresa")
              Empresa = capitalizarPalabras(Empresa)
            }
            if(Zona){
              console.log("Zona")
              Zona = capitalizarPalabras(Zona)
          }
        if(!Telefono || Telefono == "" || Telefono == 0){
            let nuevoCliente = new clientesDB({
                Nombres, 
                Apellidos, 
                Cedula, 
                Empresa, 
                RIF, 
                Direccion, 
                MaximoCredito,
                CodigoCeular, 
                Celular, 
                Telefono, 
                email, 
                Zona, 
                CodigoPostal, 
                _idVendedor,
                Vendedor
            })
            await nuevoCliente.save()
        }else{
            let nuevoCliente = new clientesDB({
                Nombres, 
                Apellidos, 
                Cedula, 
                Empresa, 
                RIF, 
                Direccion, 
                CodigoCeular, 
                CodigoTelefono,
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
        req.flash("success","Cliente registrado correctamente")
        res.redirect('/registrar-clientes')
    }

})

router.post('/registrar-proveedores', isAuthenticatedRegistro, async (req, res) => {
    let {Empresa, Direccion, CodigoPostal, Celular, 
        Telefono, email, Nombres, Apellidos, PaginaWeb, CodigoCeular, CodigoTelefono } = req.body
    let errors = []
    if(!CodigoCeular || CodigoCeular == "" || CodigoCeular == 0){
        errors.push({text: 'Debe seleccionar un código en el campo "Número celular".'})
    }
    if(!Nombres || Nombres == "" || Nombres == 0){
        errors.push({text: 'El campo "Nombres del contato" no puede estar vacío.'})
    }
    if(!Apellidos || Apellidos == "" || Apellidos == 0){
        errors.push({text: 'El campo "Apellidos del contacto" no puede estar vacío.'})
    }
    if(!Empresa || Empresa == "" || Empresa == 0){
        errors.push({text: 'El campo "Empresa" no puede estar vacío.'})
    }
    if(!Celular || Celular == "" || Celular == 0){
        errors.push({text: 'El campo "Número celular" no puede estar vacío.'})
    }

    if(errors.length > 0){
        res.render('admin/registro/proveedores',{
            errors,
            Empresa, 
            Direccion,
            Nombres, 
            Apellidos, 
            PaginaWeb,
            CodigoPostal, 
            Celular, 
            Telefono, 
            email
        })
    }else{
        function capitalizarPalabras( val ) {
  
            return val.toLowerCase()
                      .trim()
                      .split(' ')
                      .map( v => v[0].toUpperCase() + v.substr(1) )
                      .join(' ');  
        }
        Empresa = capitalizarPalabras(Empresa)
        Apellidos = capitalizarPalabras(Apellidos)
        Nombres = capitalizarPalabras(Nombres)
        if(Direccion){
            Direccion = capitalizarPalabras(Direccion)
        }
        if(!CodigoTelefono || CodigoTelefono == "" || CodigoTelefono == 0){
            let nuevoProveedor = new proveedorDB({
                Empresa, 
                Direccion, 
                CodigoPostal,
                CodigoCeular, 
                Nombres, 
                Apellidos, 
                PaginaWeb, 
                Celular, 
                Telefono, 
                email
            })
            await nuevoProveedor.save()
        }else{
            let nuevoProveedor = new proveedorDB({
                Empresa, 
                Direccion, 
                CodigoPostal,
                CodigoCeular, 
                CodigoTelefono,
                Nombres, 
                Apellidos, 
                PaginaWeb, 
                Celular, 
                Telefono, 
                email
            })
            await nuevoProveedor.save()
        }
        req.flash("success", "Proveedor registrado correctamente")
        res.redirect('/registrar-proveedores')
    }
})


router.get('/registrar-amortiguadores', isAuthenticatedRegistro, async (req, res) => {
    let proveedores = await proveedorDB.find().sort({"Empresa":1})
    let modelos = await modelosDB.find().sort({"Nombre":1})
    let marcas = await marcasDB.find().sort({"Nombre":1})
    modelos = modelos.map((data) => {
        return{
            Nombre: data.Nombre
        }
    })
    marcas = marcas.map((data) => {
        return{
            Nombre: data.Nombre
        }
    })
    proveedores = proveedores.map((data) => {
        return{
            Empresa: data.Empresa 
        }
    })
    res.render('admin/registro/registrar-amortiguadores',{
        proveedores,
        modelos,
        marcas
    })
})

router.post('/registrar-amortiguador', isAuthenticatedRegistro, async (req, res) => {
    let {
        Codigo,
        ModeloProducto,
        Nombre,
        Proveedor,
        Posicion,
        MarcaProducto,
        Alto,
        Largo,
        Ancho,
        Bulto,
        TipoVehiculo,
        Peso,
        PrecioFOB,
        PrecioVenta,
        Cantidad,
        Descripcion,
        Vehiculo
    } = req.body
    
    let validacionDuplicado = await productosDB.findOne({Codigo:Codigo})
    if(validacionDuplicado){
        res.send(JSON.stringify("error"))
    }else{
        let nuevoAmortiguador = new amortiguadoresDB({
            Codigo,
            ModeloProducto,
            Nombre,
            Proveedor,
            Posicion,
            Alto,
            Largo,
            MarcaProducto,
            Bulto,
            TipoVehiculo,
            Ancho,
            Peso,
            PrecioFOB,
            PrecioVenta,
            Descripcion,
            Vehiculo
        })
        let TipoProducto= "Amortiguador"
        let nuevoProducto = new productosDB({
            Codigo,
            MarcaProducto,
            PrecioFOB,
            PrecioVenta,
            Cantidad,
            Bulto,
            TipoVehiculo,
            Proveedor,
            Descripcion,
            TipoProducto,
            Alto,
            Largo,
            Ancho,
            Peso,
        })

        await nuevoAmortiguador.save()
        await nuevoProducto.save()
     
        res.send(JSON.stringify("ok"))

    }
})
router.post('/actualizar-amortiguador/:id', isAuthenticatedInventario, async (req, res) => {
    let {ModeloProducto, Nombre, Proveedor, Posicion, Alto, Largo, Ancho, Peso, PrecioFOB, PrecioVenta, Descripcion, Vehiculo} = req.body
    let codigo = await amortiguadoresDB.findById(req.params.id)
    codigo = codigo.Codigo
    await amortiguadoresDB.findByIdAndUpdate(req.params.id,{
        ModeloProducto,
        Nombre,
        Proveedor,
        Posicion,
        Alto,
        Largo,
        Ancho,
        Peso,
        PrecioFOB,
        PrecioVenta,
        Descripcion,
        Vehiculo
    })
    await productosDB.findOneAndUpdate({Codigo:codigo},{
        PrecioFOB,
        PrecioVenta,
        Descripcion,
    })
    res.send(JSON.stringify("ok"))
})
router.post('/actualizar-valvula/:id', isAuthenticatedInventario, async (req, res) => {
    let {Proveedor,
        CantidadEstuche,
        Bulto,
        Alto,
        Largo,
        Ancho,
        Tipo,
        Peso,
        MarcaProducto,
        PrecioFOB,
        PrecioVenta,
        Descripcion,
        Vehiculo} = req.body
    let codigo = await valvulasDB.findById(req.params.id)
    codigo = codigo.Codigo
    await valvulasDB.findByIdAndUpdate(req.params.id,{
        Proveedor,
        CantidadEstuche,
        Bulto,
        Alto,
        Largo,
        Ancho,
        Tipo,
        Peso,
        MarcaProducto,
        PrecioFOB,
        PrecioVenta,
        Descripcion,
        Vehiculo
    })
    await productosDB.findOneAndUpdate({Codigo:codigo},{
        PrecioFOB,
        PrecioVenta,
        Descripcion,
    })
    res.send(JSON.stringify("ok"))
})
router.post('/actualizar-guardapolvo/:id', isAuthenticatedInventario, async (req, res) => {
    let {Proveedor,
        Bulto,
        Alto,
        Largo,
        Ancho,
        Peso,
        MarcaProducto,
        PrecioFOB,
        PrecioVenta,
        Descripcion,
        Vehiculo} = req.body
    let codigo = await guardapolvosDB.findById(req.params.id)
    codigo = codigo.Codigo
    await guardapolvosDB.findByIdAndUpdate(req.params.id,{
        Proveedor,
        Bulto,
        Alto,
        Largo,
        Ancho,
        Peso,
        MarcaProducto,
        PrecioFOB,
        PrecioVenta,
        Descripcion,
        Vehiculo
    })
    await productosDB.findOneAndUpdate({Codigo:codigo},{
        PrecioFOB,
        PrecioVenta,
        Descripcion,
    })
    res.send(JSON.stringify("ok"))
})
router.post('/actualizar-base/:id', isAuthenticatedInventario, async (req, res) => {
    let { Nombre, Proveedor, Posicion, Alto, Largo, MarcaProducto, ModeloProducto, Ancho, Peso, PrecioFOB, PrecioVenta, Descripcion, Vehiculo} = req.body
    let codigo = await baseAmortiguadoresDB.findById(req.params.id)
    codigo = codigo.Codigo
    await baseAmortiguadoresDB.findByIdAndUpdate(req.params.id,{
        ModeloProducto,
        Nombre,
        Proveedor,
        Posicion,
        Alto,
        Largo,
        Ancho,
        MarcaProducto,
        Peso,
        PrecioFOB,
        PrecioVenta,
        Descripcion,
        Vehiculo
    })
    await productosDB.findOneAndUpdate({Codigo:codigo},{
        PrecioFOB,
        PrecioVenta,
        Descripcion,
    })
    res.send(JSON.stringify("ok"))
})
router.post('/actualizar-bujia/:id', isAuthenticatedInventario, async (req, res) => {
    let {
        Proveedor,
        Bulto,
        Alto,
        Largo,
        CodigoStock,
        Serie,
        Referencia1,
        Referencia2,
        Ancho,
        Peso,
        MarcaProducto,
        PrecioFOB,
        PrecioVenta,
        Descripcion,
        Vehiculo} = req.body
    let codigo = await bujiaDB.findById(req.params.id)
    codigo = codigo.Codigo
    await bujiaDB.findByIdAndUpdate(req.params.id,{
        Proveedor,
        Bulto,
        Alto,
        Largo,
        Ancho,
        CodigoStock,
        Serie,
        Referencia1,
        Referencia2,
        Peso,
        MarcaProducto,
        PrecioFOB,
        PrecioVenta,
        Descripcion,
        Vehiculo
    })
    await productosDB.findOneAndUpdate({Codigo:codigo},{
        PrecioFOB,
        PrecioVenta,
        Descripcion,
    })
    res.send(JSON.stringify("ok"))
})

router.post('/actualizar-bateria/:id', isAuthenticatedInventario, async (req, res) => {
    let { 
        Proveedor,
        Bulto,
        TipoVehiculo,
        Referencia,
        Voltaje,
        Capacidad10h,
        Serie,
        Capacidad20h,
        CCA,
        Carga,
        Polaridad,
        Alto,
        Largo,
        Ancho,
        Peso,
        MarcaProducto,
        PrecioFOB,
        PrecioVenta,
        Descripcion,
        Vehiculo,
    } = req.body
    let codigo = await bateriasDB.findById(req.params.id)
    codigo = codigo.Codigo
    await bateriasDB.findByIdAndUpdate(req.params.id,{
        Proveedor,
        Bulto,
        TipoVehiculo,
        Referencia,
        Voltaje,
        Capacidad10h,
        Serie,
        Capacidad20h,
        CCA,
        Carga,
        Polaridad,
        Alto,
        Largo,
        Ancho,
        Peso,
        MarcaProducto,
        PrecioFOB,
        PrecioVenta,
        Descripcion,
        Vehiculo,
    })
    await productosDB.findOneAndUpdate({Codigo:codigo},{
        PrecioFOB,
        PrecioVenta,
        Descripcion,
    })
    res.send(JSON.stringify("ok"))
})
router.post('/actualizar-bomba/:id', isAuthenticatedInventario, async (req, res) => {
    let { 
        Proveedor,
        Bulto,
        Alto,
        Referencia,
        Largo,
        Ancho,
        Peso,
        MarcaProducto,
        PrecioFOB,
        PrecioVenta,
        Descripcion,
        Vehiculo,
    } = req.body
    let codigo = await bombasDB.findById(req.params.id)
    codigo = codigo.Codigo
    await bombasDB.findByIdAndUpdate(req.params.id,{
        Proveedor,
        Bulto,
        Alto,
        Referencia,
        Largo,
        Ancho,
        Peso,
        MarcaProducto,
        PrecioFOB,
        PrecioVenta,
        Descripcion,
        Vehiculo,
    })
    await productosDB.findOneAndUpdate({Codigo:codigo},{
        PrecioFOB,
        PrecioVenta,
        Descripcion,
    })
    res.send(JSON.stringify("ok"))
})

router.post('/registrar-transporte', isAuthenticatedRegistro, async (req, res) => {
    let {Empresa,
        Direccion,
        Celular,
        Telefono,
        CodigoCelular,
        CodigoTelefono,
        email,
        Tarifario} = req.body
    let validacion = await transporteDB.findOne({Empresa:Empresa})
    if(validacion){
        res.send(JSON.stringify("error"))
    }else{
        function capitalizarPalabras( val ) {
  
            return val.toLowerCase()
                      .trim()
                      .split(' ')
                      .map( v => v[0].toUpperCase() + v.substr(1) )
                      .join(' ');  
        }
        Empresa = capitalizarPalabras(Empresa)
        Direccion = capitalizarPalabras(Direccion)
        let nuevoTranporte = new transporteDB({
            Empresa,
            Direccion,
            Celular,
            CodigoCelular,
            CodigoTelefono,
            Telefono,
            email,
            Tarifario
        })
        await nuevoTranporte.save()

        res.send(JSON.stringify("ok"))
    }
})

router.get('/directorio-clientes', isAuthenticatedCliente, async (req, res) => {
    let clientes = await clientesDB.find().sort({"Empresa": 1})
    clientes = clientes.map((data) => {
        return{
            Empresa: data.Empresa,
            RIF: data.RIF,
            Direccion: data.Direccion,
            Celular: data.Celular,
            _id: data._id,

        }
    })
    res.render('admin/clientes/directorio',{
        clientes,
    })
})


router.get('/ver-cliente/:id', isAuthenticatedCliente, async (req, res) => {
    let cliente = await clientesDB.findById(req.params.id)
    let vendedores = await vendedoresDB.find().sort({"Nombres": 1})
    vendedores = vendedores.map((data) => {
        return{
            Nombres: data.Nombres,
            Apellidos: data.Apellidos,
        }
    })
    cliente = {
        Nombres: cliente.Nombres,
        Apellidos: cliente.Apellidos,
        Cedula: cliente.Cedula,
        Empresa: cliente.Empresa,
        CodigoTelefono: cliente.CodigoTelefono,
        CodigoCeular: cliente.CodigoCeular,
        RIF: cliente.RIF,
        Direccion: cliente.Direccion,
        Celular: cliente.Celular,
        MaximoCredito: cliente.MaximoCredito,
        Telefono: cliente.Telefono,
        email: cliente.email,
        Zona: cliente.Zona,
        CodigoPostal: cliente.CodigoPostal,
        Vendedor: cliente.Vendedor,
        _id: cliente._id,
    }
    res.render('admin/clientes/ver-cliente',{
        cliente,
        vendedores
    })
})

router.post('/actualizar-cliente/:id',isAuthenticatedCliente,  async (req, res) => {
    let {Nombres, Apellidos, Cedula, Empresa, RIF, Direccion, Celular, Telefono, 
        email, Zona, CodigoPostal, Vendedor, MaximoCredito, CodigoCeular, CodigoTelefono } = req.body
    let errors = []
    email = email.toLowerCase()
    if(!Empresa || Empresa == "" || Empresa == 0){
        errors.push({text: 'El campo "Empresa o negocio" no puede estar vacío.'})
    }
    if(!RIF || RIF == "" || RIF == 0){
        errors.push({text: 'El campo "RIF" no puede estar vacío.'})
    }
    if(!Direccion || Direccion == "" || Direccion == 0){
        errors.push({text: 'El campo "Dirección fiscal" no puede estar vacío.'})
    }
    if(!CodigoCeular || CodigoCeular == "" || CodigoCeular == 0){
        errors.push({text: 'Debe seleccionar un código en el campo "Número celular".'})
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
    if(!Vendedor || Vendedor == "" || Vendedor == 0){
        errors.push({text: 'El campo "Vendedor" no puede estar vacío.'})
    }
    if(errors.length > 0){
        let cliente = await clientesDB.findById(req.params.id)
        cliente = {
            Nombres: cliente.Nombres,
            Apellidos: cliente.Apellidos,
            Cedula: cliente.Cedula,
            Empresa: cliente.Empresa,
            RIF: cliente.RIF,
            CodigoCeular: cliente.CodigoCeular, 
            CodigoTelefono: cliente.CodigoTelefono,
            Direccion: cliente.Direccion,
            Celular: cliente.Celular,
            Telefono: cliente.Telefono,
            email: cliente.email,
            Zona: cliente.Zona,
            MaximoCredito: cliente.MaximoCredito,
            CodigoPostal: cliente.CodigoPostal,
            Vendedor: cliente.Vendedor,
            _id: cliente._id,
        }
        res.render('admin/clientes/ver-cliente',{
            cliente,
            errors
        })
    }else{
        let emailAnterior = await clientesDB.findById(req.params.id)
        emailAnterior=  emailAnterior.email
        let usuarioCliente = await usersDB.findOne({email:emailAnterior})
        if(usuarioCliente){
            await usersDB.findByIdAndUpdate(usuarioCliente._id,{
                email: email,
            })
        }
        await clientesDB.findByIdAndUpdate(req.params.id,{
            Nombres, 
            Apellidos, 
            Cedula, 
            Empresa, 
            CodigoCeular,
            CodigoTelefono,
            RIF, 
            Direccion, 
            Celular, 
            Telefono,
            MaximoCredito, 
            email, 
            Zona, 
            CodigoPostal, 
            Vendedor
        })
        req.flash("success","Cliente actualizado correctamente")
        res.redirect(`/ver-cliente/${req.params.id}`)
    }
})

router.get('/directorio-vendedores', isAuthenticatedVendedor, async (req, res) => {
    let vendedores = await vendedoresDB.find().sort({"Nombres": -1})
    vendedores = vendedores.map((data) => {
        return{
            Nombres: data.Nombres,
            Apellidos: data.Apellidos,
            Cedula: data.Cedula,
            Zona: data.Zona,
            Celular: data.Celular,
            _id: data._id
        }
    })
    res.render('admin/vendedores/directorio',{
        vendedores
    })
})


router.get('/ver-vendedor/:id', isAuthenticatedVendedor, async (req, res) => {
    let vendedor = await vendedoresDB.findById(req.params.id)
    vendedor = {
        Nombres: vendedor.Nombres,
        Apellidos: vendedor.Apellidos,
        Cedula: vendedor.Cedula,
        Zona: vendedor.Zona,
        Celular: vendedor.Celular,
        Porcentaje: vendedor.Porcentaje,
        CodigoCeular: vendedor.CodigoCeular,
        Usuario: vendedor.Usuario,
        Direccion: vendedor.Direccion,
        Telefono: vendedor.Telefono,
        email: vendedor.email,
        CodigoPostal: vendedor.CodigoPostal,
        _id: vendedor._id,
    }
    res.render('admin/vendedores/ver-vendedor',{
        vendedor
    })
})

router.post('/actualizar-vendedor/:id', isAuthenticatedVendedor, async (req, res) => {
    let {Nombres, Apellidos, Cedula, Direccion, Celular,CodigoCeular, Telefono, email, Zona, CodigoPostal, Porcentaje} = req.body
    let errors = []
    email = email.toLowerCase()
    if(!Nombres || Nombres == "" || Nombres == 0){
        errors.push({text: 'El campo "Nombres" no puede estar vacío.'})
    }
    if(!Apellidos || Apellidos == "" || Apellidos == 0){
        errors.push({text: 'El campo "Apellidos" no puede estar vacío.'})
    }
    if(!Cedula || Cedula == "" || Cedula == 0){
        errors.push({text: 'El campo "Cédula" no puede estar vacío.'})
    }
    if(!Direccion || Direccion == "" || Direccion == 0){
        errors.push({text: 'El campo "Dirección" no puede estar vacío.'})
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
    if(errors.length > 0){
        let vendedor = await vendedoresDB.findById(req.params.id)
        vendedor = {
            Nombres: vendedor.Nombres,
            Apellidos: vendedor.Apellidos,
            Porcentaje: vendedor.Porcentaje,
            Cedula: vendedor.Cedula,
            CodigoCeular: vendedor.CodigoCeular,
            Zona: vendedor.Zona,
            Celular: vendedor.Celular,
            Usuario: vendedor.Usuario,
            Direccion: vendedor.Direccion,
            Telefono: vendedor.Telefono,
            email: vendedor.email,
            CodigoPostal: vendedor.CodigoPostal,
            _id: vendedor._id,
        }
        res.render('admin/vendedores/ver-vendedor',{
            errors,
            vendedor, 
        })

    }else{
        let emailAnterior = await vendedoresDB.findById(req.params.id)
        emailAnterior=  emailAnterior.email
        let usuarioVendedor = await usersDB.findOne({email:emailAnterior})
        if(usuarioVendedor){
            await usersDB.findByIdAndUpdate(usuarioVendedor._id,{
                email: email,
            })
        }
        await vendedoresDB.findByIdAndUpdate(req.params.id,{
            Nombres: Nombres,
            CodigoCeular: CodigoCeular,
            Apellidos: Apellidos,
            Cedula: Cedula,
            Direccion: Direccion,
            Porcentaje: Porcentaje,
            Celular: Celular,
            Telefono: Telefono,
            email: email,
            Zona: Zona,
            CodigoPostal: CodigoPostal,
        })
        req.flash("success","Vendedor actualizado correctamente")
        res.redirect(`/ver-vendedor/${req.params.id}`)
    }
})

router.get('/directorio-proveedores', isAuthenticatedProveedor, async (req, res) => {
    let proveedores = await proveedorDB.find().sort({"Empresa": 1})
    proveedores = proveedores.map((data) => {
        return{
            Empresa: data.Empresa,
            Direccion: data.Direccion,
            CodigoPostal: data.CodigoPostal,
            Celular: data.Celular,
            _id: data._id,
        }
    })

    res.render('admin/proveedores/directorio',{
        proveedores
    })
})

router.get('/ver-proveedor/:id', isAuthenticatedProveedor, async (req, res) => {
    let proveedor = await proveedorDB.findById(req.params.id)
    proveedor = {
        Empresa: proveedor.Empresa, 
        Direccion: proveedor.Direccion, 
        CodigoTelefono: proveedor.CodigoTelefono,
        CodigoCeular: proveedor.CodigoCeular,
        CodigoPostal: proveedor.CodigoPostal, 
        Nombres: proveedor.Nombres, 
        Apellidos: proveedor.Apellidos, 
        PaginaWeb: proveedor.PaginaWeb, 
        Celular: proveedor.Celular, 
        Telefono: proveedor.Telefono, 
        email: proveedor.email, 
        _id: proveedor._id,
    }
    res.render('admin/proveedores/ver-proveedor',{
        proveedor
    })
})

router.post('/actualizar-proveedor/:id', isAuthenticatedProveedor, async (req, res) => {
    let {Empresa, Direccion, CodigoPostal, Celular, Telefono, email, Nombres, CodigoCeular, CodigoTelefono, Apellidos, PaginaWeb } = req.body
    let errors = []
    if(!Nombres || Nombres == "" || Nombres == 0){
        errors.push({text: 'El campo "Nombres del contacto" no puede estar vacío.'})
    }
    if(!Apellidos || Apellidos == "" || Apellidos == 0){
        errors.push({text: 'El campo "Apellidos del contacto" no puede estar vacío.'})
    }
    if(!Empresa || Empresa == "" || Empresa == 0){
        errors.push({text: 'El campo "Empresa" no puede estar vacío.'})
    }
    if(!Celular || Celular == "" || Celular == 0){
        errors.push({text: 'El campo "Número celular" no puede estar vacío.'})
    }
    if(errors.length > 0){
        let proveedor = await proveedorDB.findById(req.params.id)
        proveedor = {
            Empresa: proveedor.Empresa, 
            Direccion: proveedor.Direccion, 
            CodigoPostal: proveedor.CodigoPostal, 
            Celular: proveedor.Celular, 
            Telefono: proveedor.Telefono, 
            Nombres: proveedor.Nombres, 
            Apellidos: proveedor.Apellidos, 
            PaginaWeb: proveedor.PaginaWeb,
            email: proveedor.email, 
            _id: proveedor._id,
        }
        res.render('admin/proveedores/ver-proveedor',{
            proveedor,
            errors
        })
    }else{
        await proveedorDB.findByIdAndUpdate(req.params.id,{
            Empresa, 
            Direccion, 
            CodigoPostal, 
            CodigoCeular, 
            CodigoTelefono,
            Celular, 
            Telefono, 
            Nombres,
            Apellidos,
            PaginaWeb,
            email
        })
        req.flash("success","Proveedor actualizado correctamente")
        res.redirect(`/ver-proveedor/${req.params.id}`)
    }
})

router.get('/directorio-inventario', isAuthenticatedInventario, async (req, res) => {
    let productos = await productosDB.find().sort({Codigo:1})
    productos = productos.map((data) => {
        if(data.TipoProducto == "Bateria"){
            return{
                Codigo: data.Codigo,
                PrecioFOB: data.PrecioFOB,
                link: `/ver-producto-bateria/${data._id}`,
                PrecioVenta: data.PrecioVenta,
                Cantidad: data.Cantidad,
                TipoProducto: data.TipoProducto,
                _id: data._id,
            }
        }
        if(data.TipoProducto == "Bomba"){
            return{
                Codigo: data.Codigo,
                PrecioFOB: data.PrecioFOB,
                PrecioVenta: data.PrecioVenta,
                link: `/ver-producto-bomba/${data._id}`,
                Cantidad: data.Cantidad,
                TipoProducto: data.TipoProducto,
                _id: data._id,
            }
        }
        if(data.TipoProducto == "Base amortiguador"){
            return{
                Codigo: data.Codigo,
                PrecioFOB: data.PrecioFOB,
                PrecioVenta: data.PrecioVenta,
                link: `/ver-producto-base/${data._id}`,
                Cantidad: data.Cantidad,
                TipoProducto: data.TipoProducto,
                _id: data._id,
            }
        }
        if(data.TipoProducto == "Guardapolvo"){
            return{
                Codigo: data.Codigo,
                PrecioFOB: data.PrecioFOB,
                PrecioVenta: data.PrecioVenta,
                link: `/ver-producto-guardapolvo/${data._id}`,
                Cantidad: data.Cantidad,
                TipoProducto: data.TipoProducto,
                _id: data._id,
            }
        }
        if(data.TipoProducto == "Valvula"){
            return{
                Codigo: data.Codigo,
                PrecioFOB: data.PrecioFOB,
                link: `/ver-producto-valvula/${data._id}`,
                PrecioVenta: data.PrecioVenta,
                Cantidad: data.Cantidad,
                TipoProducto: data.TipoProducto,
                _id: data._id,
            }
        }
        if(data.TipoProducto == "Bujia"){
            return{
                Codigo: data.Codigo,
                PrecioFOB: data.PrecioFOB,
                link: `/ver-producto-bujia/${data._id}`,
                PrecioVenta: data.PrecioVenta,
                Cantidad: data.Cantidad,
                TipoProducto: data.TipoProducto,
                _id: data._id,
            }
        }
        if(data.TipoProducto == "Amortiguador"){
            return{
                Codigo: data.Codigo,
                PrecioFOB: data.PrecioFOB,
                link: `/ver-producto-amortiguador/${data._id}`,
                PrecioVenta: data.PrecioVenta,
                Cantidad: data.Cantidad,
                TipoProducto: data.TipoProducto,
                _id: data._id,
            }
        }
    })
    res.render('admin/inventario/directorio',{
        productos
    })
})

router.get('/ver-producto-amortiguador/:id', isAuthenticatedInventario, async (req, res) => {
    let codigo = await productosDB.findById(req.params.id)
    let productoId = await productosDB.findOne({Codigo: codigo.Codigo})
    let _idProducto = productoId._id 
    let producto = await amortiguadoresDB.findOne({Codigo: codigo.Codigo})
    producto = {
        Codigo: producto.Codigo,
        TipoProducto: producto.TipoProducto,
        ModeloProducto: producto.ModeloProducto,
        Nombre: producto.Nombre,
        Proveedor: producto.Proveedor,
        Posicion: producto.Posicion,
        Alto: producto.Alto,
        Largo: producto.Largo,
        Ancho: producto.Ancho,
        Peso: producto.Peso,
        PrecioFOB: producto.PrecioFOB,
        PrecioVenta: producto.PrecioVenta,
        Descripcion: producto.Descripcion,
        _id: producto._id,
        Vehiculo: producto.Vehiculo.map((data) => {
            return{
                Marca: data.Marca,
                Modelo: data.Modelo,
                Anio: data.Anio,
            }
        }),
    }
    res.render('admin/inventario/ver-producto-amortiguador',{
        producto,
        _idProducto
    })
})

router.get('/ver-producto-bujia/:id',isAuthenticatedInventario,  async (req, res) => {
    let codigo = await productosDB.findById(req.params.id)
    let productoId = await productosDB.findOne({Codigo: codigo.Codigo})
    let _idProducto = productoId._id 
    let producto = await bujiaDB.findOne({Codigo: codigo.Codigo})
    producto = {
        Codigo: producto.Codigo,
        TipoProducto: producto.TipoProducto,
        TipoVehiculo: producto.TipoVehiculo,
        Bulto: producto.Bulto,
        CodigoStock: producto.CodigoStock,
        Serie: producto.Serie,
        Referencia1: producto.Referencia1,
        Referencia2: producto.Referencia2,
        MarcaProducto: producto.MarcaProducto,
        Nombre: producto.Nombre,
        Proveedor: producto.Proveedor,
        _id: producto._id,
        Alto: producto.Alto,
        Largo: producto.Largo,
        Ancho: producto.Ancho,
        Peso: producto.Peso,
        PrecioFOB: producto.PrecioFOB,
        PrecioVenta: producto.PrecioVenta,
        Descripcion: producto.Descripcion,
        Vehiculo: producto.Vehiculo.map((data) => {
            return{
                Marca: data.Marca,
                Modelo: data.Modelo,
                Anio: data.Anio,
            }
        }),
    }
    res.render('admin/inventario/ver-producto-bujia',{
        producto,
        _idProducto
    })
})

router.get('/ver-producto-valvula/:id',isAuthenticatedInventario,  async (req, res) => {
    let codigo = await productosDB.findById(req.params.id)
    let productoId = await productosDB.findOne({Codigo: codigo.Codigo})
    let _idProducto = productoId._id 
    let producto = await valvulasDB.findOne({Codigo: codigo.Codigo})
    producto = {
        Codigo: producto.Codigo,
        TipoProducto: producto.TipoProducto,
        TipoVehiculo: producto.TipoVehiculo,
        Bulto: producto.Bulto,
        Tipo: producto.Tipo,
        MarcaProducto: producto.MarcaProducto,
        CantidadEstuche: producto.CantidadEstuche,
        Proveedor: producto.Proveedor,
        _id: producto._id,
        Alto: producto.Alto,
        Largo: producto.Largo,
        Ancho: producto.Ancho,
        Peso: producto.Peso,
        PrecioFOB: producto.PrecioFOB,
        PrecioVenta: producto.PrecioVenta,
        Descripcion: producto.Descripcion,
        Vehiculo: producto.Vehiculo.map((data) => {
            return{
                Marca: data.Marca,
                Modelo: data.Modelo,
                Anio: data.Anio,
            }
        }),
    }
    res.render('admin/inventario/ver-producto-valvula',{
        producto,
        _idProducto
    })
})

router.get('/ver-producto-guardapolvo/:id', isAuthenticatedInventario, async (req, res) => {
    let codigo = await productosDB.findById(req.params.id)
    let productoId = await productosDB.findOne({Codigo: codigo.Codigo})
    let _idProducto = productoId._id 
    let producto = await guardapolvosDB.findOne({Codigo: codigo.Codigo})
    producto = {
        Codigo: producto.Codigo,
        TipoProducto: producto.TipoProducto,
        TipoVehiculo: producto.TipoVehiculo,
        Bulto: producto.Bulto,
        Nombre: producto.Nombre,
        MarcaProducto: producto.MarcaProducto,
        Proveedor: producto.Proveedor,
        Alto: producto.Alto,
        Largo: producto.Largo,
        Ancho: producto.Ancho,
        _id: producto._id,
        Peso: producto.Peso,
        PrecioFOB: producto.PrecioFOB,
        PrecioVenta: producto.PrecioVenta,
        Descripcion: producto.Descripcion,
        Vehiculo: producto.Vehiculo.map((data) => {
            return{
                Marca: data.Marca,
                Modelo: data.Modelo,
                Anio: data.Anio,
            }
        }),
    }
    res.render('admin/inventario/ver-producto-guardapolvo',{
        producto,
        _idProducto
    })
})

router.get('/ver-producto-base/:id', isAuthenticatedInventario, async (req, res) => {
    let codigo = await productosDB.findById(req.params.id)
    let productoId = await productosDB.findOne({Codigo: codigo.Codigo})
    let _idProducto = productoId._id 
    let producto = await baseAmortiguadoresDB.findOne({Codigo: codigo.Codigo})
    producto = {
        Codigo: producto.Codigo,
        TipoProducto: producto.TipoProducto,
        TipoVehiculo: producto.TipoVehiculo,
        Bulto: producto.Bulto,
        MarcaProducto: producto.MarcaProducto,
        ModeloProducto: producto.ModeloProducto,
        Nombre: producto.Nombre,
        Proveedor: producto.Proveedor,
        Posicion: producto.Posicion,
        Alto: producto.Alto,
        Largo: producto.Largo,
        Ancho: producto.Ancho,
        _id: producto._id,
        Peso: producto.Peso,
        PrecioFOB: producto.PrecioFOB,
        PrecioVenta: producto.PrecioVenta,
        Descripcion: producto.Descripcion,
        Vehiculo: producto.Vehiculo.map((data) => {
            return{
                Marca: data.Marca,
                Modelo: data.Modelo,
                Anio: data.Anio,
            }
        }),
    }
    res.render('admin/inventario/ver-producto-base',{
        producto,
        _idProducto
    })
})

router.get('/ver-producto-bomba/:id', isAuthenticatedInventario, async (req, res) => {
    let codigo = await productosDB.findById(req.params.id)
    let productoId = await productosDB.findOne({Codigo: codigo.Codigo})
    let _idProducto = productoId._id 
    let producto = await bombasDB.findOne({Codigo: codigo.Codigo})
    producto = {
        Codigo: producto.Codigo,
        _id: producto._id,
        TipoProducto: producto.TipoProducto,
        TipoVehiculo: producto.TipoVehiculo,
        Bulto: producto.Bulto,
        MarcaProducto: producto.MarcaProducto,
        Tipo: producto.Tipo,
        Referencia: producto.Referencia,
        Proveedor: producto.Proveedor,
        Alto: producto.Alto,
        Largo: producto.Largo,
        Ancho: producto.Ancho,
        Peso: producto.Peso,
        PrecioFOB: producto.PrecioFOB,
        PrecioVenta: producto.PrecioVenta,
        Descripcion: producto.Descripcion,
        Vehiculo: producto.Vehiculo.map((data) => {
            return{
                Marca: data.Marca,
                Modelo: data.Modelo,
                Anio: data.Anio,
            }
        }),
    }
    res.render('admin/inventario/ver-producto-bomba',{
        producto,
        _idProducto
    })
})

router.get('/ver-producto-bateria/:id', isAuthenticatedInventario, async (req, res) => {
    let codigo = await productosDB.findById(req.params.id)
    let productoId = await productosDB.findOne({Codigo: codigo.Codigo})
    let _idProducto = productoId._id 
    let producto = await bateriasDB.findOne({Codigo: codigo.Codigo})
    producto = {
        TipoProducto:producto.TipoProducto,
        Codigo:producto.Codigo,
        Referencia:producto.Referencia,
        Proveedor:producto.Proveedor,
        Serie:producto.Serie,
        Bulto:producto.Bulto,
        TipoVehiculo:producto.TipoVehiculo,
        Voltaje:producto.Voltaje,
        Capacidad10h:producto.Capacidad10h,
        _id:producto._id,
        Capacidad20h:producto.Capacidad20h,
        CCA:producto.CCA,
        Carga:producto.Carga,
        Polaridad:producto.Polaridad,
        Alto:producto.Alto,
        Largo:producto.Largo,
        Ancho:producto.Ancho,
        Peso:producto.Peso,
        MarcaProducto:producto.MarcaProducto,
        PrecioFOB:producto.PrecioFOB,
        PrecioVenta:producto.PrecioVenta,
        Cantidad:producto.Cantidad,
        Descripcion:producto.Descripcion,
        Vehiculo: producto.Vehiculo.map((data) => {
            return{
                Marca: data.Marca,
                Modelo: data.Modelo,
                Anio: data.Anio,
            }
        }),
    }
    res.render('admin/inventario/ver-producto-bateria',{
        producto,
        _idProducto
    })
})

router.get('/reporte-inventario', isAuthenticatedInventario, async (req, res) => {
    res.render('admin/inventario/reporte-inventario')
})


router.post('/reporte-inventario', isAuthenticatedInventario, async (req, res) => {
    let {Cantidad, TipoProducto } = req.body
    let productos
    if(TipoProducto == 0){
        if(Cantidad == "Todas"){
            productos = await productosDB.find().sort({"TipoProducto": 1,"Codigo":-1})
        }
        if(Cantidad == "Mayores"){
            productos = await productosDB.find({Cantidad: {$gt: 0}}).sort({"TipoProducto": 1,"Codigo":-1})
        }
        if(Cantidad == "Iguales"){
            productos = await productosDB.find({Cantidad: 0}).sort({"TipoProducto": 1, "Codigo":-1})
        }
    }else{
        if(Cantidad == "Todas"){
            productos = await productosDB.find({TipoProducto: TipoProducto}).sort({"TipoProducto": 1,"Codigo":-1})
        }
        if(Cantidad == "Mayores"){
            productos = await productosDB.find({$and: [{TipoProducto: TipoProducto},{Cantidad: {$gt: 0}}]}).sort({"TipoProducto": 1,"Codigo":-1})
        }
        if(Cantidad == "Iguales"){
            productos = await productosDB.find({$and: [{TipoProducto: TipoProducto},{Cantidad: 0}]}).sort({"TipoProducto": 1,"Codigo":-1})
        }
    }
    let cantidadTotal = 0
    let PrecioFOBGeneral = 0
    let PrecioVentaGeneral = 0
    for(i=0; i< productos.length; i++){
        productos[i].PrecioFOBTotal = (+productos[i].Cantidad * +productos[i].PrecioFOB).toFixed(2)
        productos[i].PrecioVentaTotal = (+productos[i].Cantidad * +productos[i].PrecioVenta).toFixed(2)
        PrecioFOBGeneral += +productos[i].PrecioFOBTotal
        PrecioVentaGeneral += +productos[i].PrecioVentaTotal
        cantidadTotal += +productos[i].Cantidad
    }

    productos = productos.map((data) => {
        return{
            Codigo: data.Codigo,
            Referencia: data.Referencia,
            PrecioFOB: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioFOB),
            PrecioVenta: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVenta),
            PrecioFOBTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioFOBTotal),
            PrecioVentaTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioVentaTotal),
            Cantidad: data.Cantidad,
            MarcaProducto: data.MarcaProducto,
            Proveedor: data.Proveedor,
            Descripcion: data.Descripcion,
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
    })
    PrecioFOBGeneral = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(PrecioFOBGeneral)
    PrecioVentaGeneral = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(PrecioVentaGeneral)
    res.render('admin/archivos_pdf/reporte-inventario',{
        layout:"reportes.hbs",
        productos,
        cantidadTotal,
        PrecioFOBGeneral,
        PrecioVentaGeneral,
    })
})



router.post('/generar-reporte-inventario', isAuthenticatedInventario, async (req, res) => {
    let {Cantidad, TipoProducto, Precio} = req.body
    if(Cantidad == 0){
        if(TipoProducto == 1){
            if(Precio == 0){
                let productos = await productosDB.find({Cantidad : 0})
                let thead = ["Código","Tipo de producto","Modelo de producto","Nombre","Proveedor", "Descripción","Precio FOB", "Precio venta"]
                let tbody = []
                for(i=0; i< productos.length; i++){
                    if(productos[i].TipoProducto == "Amortiguador"){
                       let amortiguador = await amortiguadoresDB.findOne({Codigo: productos[i].Codigo})
                       let data = {
                           Codigo: productos[i].Codigo, 
                           TipoProducto: "Amortiguador", 
                           ModeloProducto: amortiguador.ModeloProducto, 
                           Nombre: amortiguador.Nombre, 
                           Proveedor: amortiguador.Proveedor, 
                           Descripcion: amortiguador.Descripcion, 
                           PrecioFOB: productos[i].PrecioFOB, 
                           PrecioVenta: productos[i].PrecioVenta, 
                       }
                       tbody.push(data)
                    }
                    if(productos[i].TipoProducto == "Baterias"){
                        //pendiente
                    }
                    if(productos[i].TipoProducto == "Bombas"){
                        //pendiente
                    }
                    if(productos[i].TipoProducto == "Bujes"){
                        //pendiente
                    }
                }
                lineas = 8
                let data = {
                    thead,
                    tbody,
                    lineas
                }
                res.send(JSON.stringify(data))
            }
            if(Precio == "Venta"){
                let productos = await productosDB.find({Cantidad : 0})
                let thead = ["Código","Tipo de producto","Modelo de producto","Nombre","Proveedor", "Descripción","Precio venta"]
                let tbody = []
                for(i=0; i< productos.length; i++){
                    if(productos[i].TipoProducto == "Amortiguador"){
                       let amortiguador = await amortiguadoresDB.findOne({Codigo: productos[i].Codigo})
                       let data = {
                           Codigo: productos[i].Codigo, 
                           TipoProducto: "Amortiguador", 
                           ModeloProducto: amortiguador.ModeloProducto, 
                           Nombre: amortiguador.Nombre, 
                           Proveedor: amortiguador.Proveedor, 
                           Descripcion: amortiguador.Descripcion, 
                           Precio: productos[i].PrecioVenta, 
                       }
                       tbody.push(data)
                    }
                    if(productos[i].TipoProducto == "Baterias"){
                        //pendiente
                    }
                    if(productos[i].TipoProducto == "Bombas"){
                        //pendiente
                    }
                    if(productos[i].TipoProducto == "Bujes"){
                        //pendiente
                    }
                }
                lineas = 7
                let data = {
                    thead,
                    tbody,
                    lineas
                }
                res.send(JSON.stringify(data))

            }
            if(Precio == "FOB"){
                let productos = await productosDB.find({Cantidad : 0})
                let thead = ["Código","Tipo de producto","Modelo de producto","Nombre","Proveedor", "Descripción","Precio FOB"]
                let tbody = []
                for(i=0; i< productos.length; i++){
                    if(productos[i].TipoProducto == "Amortiguador"){
                       let amortiguador = await amortiguadoresDB.findOne({Codigo: productos[i].Codigo})
                       let data = {
                           Codigo: productos[i].Codigo, 
                           TipoProducto: "Amortiguador", 
                           ModeloProducto: amortiguador.ModeloProducto, 
                           Nombre: amortiguador.Nombre, 
                           Proveedor: amortiguador.Proveedor, 
                           Descripcion: amortiguador.Descripcion, 
                           Precio: productos[i].PrecioFOB, 
                       }
                       tbody.push(data)
                    }
                    if(productos[i].TipoProducto == "Baterias"){
                        //pendiente
                    }
                    if(productos[i].TipoProducto == "Bombas"){
                        //pendiente
                    }   
                    if(productos[i].TipoProducto == "Bujes"){
                        //pendiente
                    }
                }
                lineas = 7
                let data = {
                    thead,
                    tbody,
                    lineas
                }
                res.send(JSON.stringify(data))
            }
        }
        if(TipoProducto == "Amortiguador"){
            if(Precio == 0){
                let productos = await productosDB.find({Cantidad : 0, TipoProducto: "Amortiguador"})
                let thead = ["Código","Tipo de producto","Modelo de producto","Nombre","Proveedor", "Descripción","Precio FOB", "Precio venta"]
                let tbody = []
                for(i=0; i< productos.length; i++){
                    let amortiguador = await amortiguadoresDB.findOne({Codigo: productos[i].Codigo})
                    let data = {
                        Codigo: productos[i].Codigo, 
                        TipoProducto: "Amortiguador", 
                        ModeloProducto: amortiguador.ModeloProducto, 
                        Nombre: amortiguador.Nombre, 
                        Proveedor: amortiguador.Proveedor, 
                        Descripcion: amortiguador.Descripcion, 
                        PrecioFOB: productos[i].PrecioFOB, 
                        PrecioVenta: productos[i].PrecioVenta, 
                    }
                    tbody.push(data)
                }
                lineas = 8
                let data = {
                    thead,
                    tbody,
                    lineas
                }
                res.send(JSON.stringify(data))
            }
            if(Precio == "Venta"){
                let productos = await productosDB.find({Cantidad : 0, TipoProducto: "Amortiguador"})
                let thead = ["Código","Tipo de producto","Modelo de producto","Nombre","Proveedor", "Descripción","Precio venta"]
                let tbody = []
                for(i=0; i< productos.length; i++){
                    let amortiguador = await amortiguadoresDB.findOne({Codigo: productos[i].Codigo})
                    let data = {
                        Codigo: productos[i].Codigo, 
                        TipoProducto: "Amortiguador", 
                        ModeloProducto: amortiguador.ModeloProducto, 
                        Nombre: amortiguador.Nombre, 
                        Proveedor: amortiguador.Proveedor, 
                        Descripcion: amortiguador.Descripcion, 
                        Precio: productos[i].PrecioVenta, 
                    }
                    tbody.push(data)
                }
                lineas = 7
                let data = {
                    thead,
                    tbody,
                    lineas
                }
                res.send(JSON.stringify(data))

            }
            if(Precio == "FOB"){
                let productos = await productosDB.find({Cantidad : 0, TipoProducto: "Amortiguador"})
                let thead = ["Código","Tipo de producto","Modelo de producto","Nombre","Proveedor", "Descripción","Precio FOB"]
                let tbody = []
                for(i=0; i< productos.length; i++){
                    let amortiguador = await amortiguadoresDB.findOne({Codigo: productos[i].Codigo})
                    let data = {
                        Codigo: productos[i].Codigo, 
                        TipoProducto: "Amortiguador", 
                        ModeloProducto: amortiguador.ModeloProducto, 
                        Nombre: amortiguador.Nombre, 
                        Proveedor: amortiguador.Proveedor, 
                        Descripcion: amortiguador.Descripcion, 
                        Precio: productos[i].PrecioFOB, 
                    }
                    tbody.push(data)
                }
                lineas = 7
                let data = {
                    thead,
                    tbody,
                    lineas
                }
                res.send(JSON.stringify(data))
            }
        }
        if(TipoProducto == "Baterias"){
            if(Precio == "Todos"){
                //pendiente
            }
            if(Precio == "Venta"){
                //pendiente
            }
            if(Precio == "FOB"){
                //pendiente
            }
        }
        if(TipoProducto == "Bombas"){
            if(Precio == "Todos"){
                //pendiente
            }
            if(Precio == "Venta"){
                //pendiente
            }
            if(Precio == "FOB"){
                //pendiente
            }
        }
        if(TipoProducto == "Bujes"){
            if(Precio == "Todos"){
                //pendiente
            }   
            if(Precio == "Venta"){
                //pendiente
            }
            if(Precio == "FOB"){
                //pendiente
            }   
        }
    }
    if(Cantidad == 1){
        if(TipoProducto == 1){
            if(Precio == 0){
                let productos = await productosDB.find()
                let thead = ["Código","Tipo de producto","Modelo de producto","Nombre","Proveedor", "Descripción","Precio FOB", "Precio venta"]
                let tbody = []
                for(i=0; i< productos.length; i++){
                    if(productos[i].TipoProducto == "Amortiguador"){
                       let amortiguador = await amortiguadoresDB.findOne({Codigo: productos[i].Codigo})
                       let data = {
                           Codigo: productos[i].Codigo, 
                           TipoProducto: "Amortiguador", 
                           ModeloProducto: amortiguador.ModeloProducto, 
                           Nombre: amortiguador.Nombre, 
                           Proveedor: amortiguador.Proveedor, 
                           Descripcion: amortiguador.Descripcion, 
                           PrecioFOB: productos[i].PrecioFOB, 
                           PrecioFOB: productos[i].PrecioFOB, 
                           PrecioVenta: productos[i].PrecioVenta, 
                       }
                       tbody.push(data)
                    }
                    if(productos[i].TipoProducto == "Baterias"){
                        //pendiente
                    }
                    if(productos[i].TipoProducto == "Bombas"){
                        //pendiente
                    }
                    if(productos[i].TipoProducto == "Bujes"){
                        //pendiente
                    }
                }
                lineas = 8
                let data = {
                    thead,
                    tbody,
                    lineas
                }
                res.send(JSON.stringify(data))
            }
            if(Precio == "Venta"){
                let productos = await productosDB.find()
                let thead = ["Código","Tipo de producto","Modelo de producto","Nombre","Proveedor", "Descripción","Precio venta"]
                let tbody = []
                for(i=0; i< productos.length; i++){
                    if(productos[i].TipoProducto == "Amortiguador"){
                       let amortiguador = await amortiguadoresDB.findOne({Codigo: productos[i].Codigo})
                       let data = {
                           Codigo: productos[i].Codigo, 
                           TipoProducto: "Amortiguador", 
                           ModeloProducto: amortiguador.ModeloProducto, 
                           Nombre: amortiguador.Nombre, 
                           Proveedor: amortiguador.Proveedor, 
                           Descripcion: amortiguador.Descripcion, 
                           Precio: productos[i].PrecioVenta, 
                       }
                       tbody.push(data)
                    }
                    if(productos[i].TipoProducto == "Baterias"){
                        //pendiente
                    }
                    if(productos[i].TipoProducto == "Bombas"){
                        //pendiente
                    }
                    if(productos[i].TipoProducto == "Bujes"){
                        //pendiente
                    }
                }
                lineas = 7
                let data = {
                    thead,
                    tbody,
                    lineas
                }
                res.send(JSON.stringify(data))

            }
            if(Precio == "FOB"){
                let productos = await productosDB.find()
                let thead = ["Código","Tipo de producto","Modelo de producto","Nombre","Proveedor", "Descripción","Precio FOB"]
                let tbody = []
                for(i=0; i< productos.length; i++){
                    if(productos[i].TipoProducto == "Amortiguador"){
                       let amortiguador = await amortiguadoresDB.findOne({Codigo: productos[i].Codigo})
                       let data = {
                           Codigo: productos[i].Codigo, 
                           TipoProducto: "Amortiguador", 
                           ModeloProducto: amortiguador.ModeloProducto, 
                           Nombre: amortiguador.Nombre, 
                           Proveedor: amortiguador.Proveedor, 
                           Descripcion: amortiguador.Descripcion, 
                           Precio: productos[i].PrecioFOB, 
                       }
                       tbody.push(data)
                    }
                    if(productos[i].TipoProducto == "Baterias"){
                        //pendiente
                    }
                    if(productos[i].TipoProducto == "Bombas"){
                        //pendiente
                    }   
                    if(productos[i].TipoProducto == "Bujes"){
                        //pendiente
                    }
                }
                lineas = 7
                let data = {
                    thead,
                    tbody,
                    lineas
                }
                res.send(JSON.stringify(data))
            }
        }
        if(TipoProducto == "Amortiguador"){
            if(Precio == 0){
                let productos = await productosDB.find({Cantidad : 0, TipoProducto: "Amortiguador"})
                let thead = ["Código","Tipo de producto","Modelo de producto","Nombre","Proveedor", "Descripción","Precio FOB", "Precio venta"]
                let tbody = []
                for(i=0; i< productos.length; i++){
                    let amortiguador = await amortiguadoresDB.findOne({Codigo: productos[i].Codigo})
                    let data = {
                        Codigo: productos[i].Codigo, 
                        TipoProducto: "Amortiguador", 
                        ModeloProducto: amortiguador.ModeloProducto, 
                        Nombre: amortiguador.Nombre, 
                        Proveedor: amortiguador.Proveedor, 
                        Descripcion: amortiguador.Descripcion, 
                        PrecioFOB: productos[i].PrecioFOB, 
                        PrecioVenta: productos[i].PrecioVenta, 
                    }
                    tbody.push(data)
                }
                lineas = 8
                let data = {
                    thead,
                    tbody,
                    lineas
                }
                res.send(JSON.stringify(data))
            }
            if(Precio == "Venta"){
                let productos = await productosDB.find({Cantidad : 0, TipoProducto: "Amortiguador"})
                let thead = ["Código","Tipo de producto","Modelo de producto","Nombre","Proveedor", "Descripción","Precio venta"]
                let tbody = []
                for(i=0; i< productos.length; i++){
                    let amortiguador = await amortiguadoresDB.findOne({Codigo: productos[i].Codigo})
                    let data = {
                        Codigo: productos[i].Codigo, 
                        TipoProducto: "Amortiguador", 
                        ModeloProducto: amortiguador.ModeloProducto, 
                        Nombre: amortiguador.Nombre, 
                        Proveedor: amortiguador.Proveedor, 
                        Descripcion: amortiguador.Descripcion, 
                        Precio: productos[i].PrecioVenta, 
                    }
                    tbody.push(data)
                }
                lineas = 7
                let data = {
                    thead,
                    tbody,
                    lineas
                }
                res.send(JSON.stringify(data))

            }
            if(Precio == "FOB"){
                let productos = await productosDB.find({Cantidad : 0, TipoProducto: "Amortiguador"})
                let thead = ["Código","Tipo de producto","Modelo de producto","Nombre","Proveedor", "Descripción","Precio FOB"]
                let tbody = []
                for(i=0; i< productos.length; i++){
                    let amortiguador = await amortiguadoresDB.findOne({Codigo: productos[i].Codigo})
                    let data = {
                        Codigo: productos[i].Codigo, 
                        TipoProducto: "Amortiguador", 
                        ModeloProducto: amortiguador.ModeloProducto, 
                        Nombre: amortiguador.Nombre, 
                        Proveedor: amortiguador.Proveedor, 
                        Descripcion: amortiguador.Descripcion, 
                        Precio: productos[i].PrecioFOB, 
                    }
                    tbody.push(data)
                }
                lineas = 7
                let data = {
                    thead,
                    tbody,
                    lineas
                }
                res.send(JSON.stringify(data))
            }
        }
        if(TipoProducto == "Baterias"){
            if(Precio == "Todos"){
                //pendiente
            }
            if(Precio == "Venta"){
                //pendiente
            }
            if(Precio == "FOB"){
                //pendiente
            }
        }
        if(TipoProducto == "Bombas"){
            if(Precio == "Todos"){
                //pendiente
            }
            if(Precio == "Venta"){
                //pendiente
            }
            if(Precio == "FOB"){
                //pendiente
            }
        }
        if(TipoProducto == "Bujes"){
            if(Precio == "Todos"){
                //pendiente
            }
            if(Precio == "Venta"){
                //pendiente
            }
            if(Precio == "FOB"){
                //pendiente
            }
        }

    }
    if(Cantidad == 2){
        if(TipoProducto == 1){
            if(Precio == 0){
                let productos = await productosDB.find({Cantidad: {$gt : 0}})
                let thead = ["Código","Tipo de producto","Modelo de producto","Nombre","Proveedor", "Descripción","Precio FOB", "Precio venta"]
                let tbody = []
                for(i=0; i< productos.length; i++){
                    if(productos[i].TipoProducto == "Amortiguador"){
                       let amortiguador = await amortiguadoresDB.findOne({Codigo: productos[i].Codigo})
                       let data = {
                           Codigo: productos[i].Codigo, 
                           TipoProducto: "Amortiguador", 
                           ModeloProducto: amortiguador.ModeloProducto, 
                           Nombre: amortiguador.Nombre, 
                           Proveedor: amortiguador.Proveedor, 
                           Descripcion: amortiguador.Descripcion, 
                           PrecioFOB: productos[i].PrecioFOB, 
                           PrecioVenta: productos[i].PrecioVenta, 
                       }
                       tbody.push(data)
                    }
                    if(productos[i].TipoProducto == "Baterias"){
                        //pendiente
                    }
                    if(productos[i].TipoProducto == "Bombas"){
                        //pendiente
                    }
                    if(productos[i].TipoProducto == "Bujes"){
                        //pendiente
                    }
                }
                lineas = 8
                let data = {
                    thead,
                    tbody,
                    lineas
                }
                res.send(JSON.stringify(data))
            }
            if(Precio == "Venta"){
                let productos = await productosDB.find({Cantidad: {$gt : 0}})
                let thead = ["Código","Tipo de producto","Modelo de producto","Nombre","Proveedor", "Descripción","Precio venta"]
                let tbody = []
                for(i=0; i< productos.length; i++){
                    if(productos[i].TipoProducto == "Amortiguador"){
                       let amortiguador = await amortiguadoresDB.findOne({Codigo: productos[i].Codigo})
                       let data = {
                           Codigo: productos[i].Codigo, 
                           TipoProducto: "Amortiguador", 
                           ModeloProducto: amortiguador.ModeloProducto, 
                           Nombre: amortiguador.Nombre, 
                           Proveedor: amortiguador.Proveedor, 
                           Descripcion: amortiguador.Descripcion, 
                           Precio: productos[i].PrecioVenta, 
                       }
                       tbody.push(data)
                    }
                    if(productos[i].TipoProducto == "Baterias"){
                        //pendiente
                    }
                    if(productos[i].TipoProducto == "Bombas"){
                        //pendiente
                    }
                    if(productos[i].TipoProducto == "Bujes"){
                        //pendiente
                    }
                }
                lineas = 7
                let data = {
                    thead,
                    tbody,
                    lineas
                }
                res.send(JSON.stringify(data))

            }
            if(Precio == "FOB"){
                let productos = await productosDB.find({Cantidad: {$gt : 0}})
                let thead = ["Código","Tipo de producto","Modelo de producto","Nombre","Proveedor", "Descripción","Precio FOB"]
                let tbody = []
                for(i=0; i< productos.length; i++){
                    if(productos[i].TipoProducto == "Amortiguador"){
                       let amortiguador = await amortiguadoresDB.findOne({Codigo: productos[i].Codigo})
                       let data = {
                           Codigo: productos[i].Codigo, 
                           TipoProducto: "Amortiguador", 
                           ModeloProducto: amortiguador.ModeloProducto, 
                           Nombre: amortiguador.Nombre, 
                           Proveedor: amortiguador.Proveedor, 
                           Descripcion: amortiguador.Descripcion, 
                           Precio: productos[i].PrecioFOB, 
                       }
                       tbody.push(data)
                    }
                    if(productos[i].TipoProducto == "Baterias"){
                        //pendiente
                    }
                    if(productos[i].TipoProducto == "Bombas"){
                        //pendiente
                    }   
                    if(productos[i].TipoProducto == "Bujes"){
                        //pendiente
                    }
                }
                lineas = 7
                let data = {
                    thead,
                    tbody,
                    lineas
                }
                res.send(JSON.stringify(data))
            }
        }
        if(TipoProducto == "Amortiguador"){
            if(Precio == 0){
                let productos = await productosDB.find({Cantidad : {$gt : 0}, TipoProducto: "Amortiguador"})
                let thead = ["Código","Tipo de producto","Modelo de producto","Nombre","Proveedor", "Descripción","Precio FOB", "Precio venta"]
                let tbody = []
                for(i=0; i< productos.length; i++){
                    let amortiguador = await amortiguadoresDB.findOne({Codigo: productos[i].Codigo})
                    let data = {
                        Codigo: productos[i].Codigo, 
                        TipoProducto: "Amortiguador", 
                        ModeloProducto: amortiguador.ModeloProducto, 
                        Nombre: amortiguador.Nombre, 
                        Proveedor: amortiguador.Proveedor, 
                        Descripcion: amortiguador.Descripcion, 
                        PrecioFOB: productos[i].PrecioFOB, 
                        PrecioVenta: productos[i].PrecioVenta, 
                    }
                    tbody.push(data)
                }
                lineas = 8
                let data = {
                    thead,
                    tbody,
                    lineas
                }
                res.send(JSON.stringify(data))
            }
            if(Precio == "Venta"){
                let productos = await productosDB.find({Cantidad : {$gt : 0}, TipoProducto: "Amortiguador"})
                let thead = ["Código","Tipo de producto","Modelo de producto","Nombre","Proveedor", "Descripción","Precio venta"]
                let tbody = []
                for(i=0; i< productos.length; i++){
                    let amortiguador = await amortiguadoresDB.findOne({Codigo: productos[i].Codigo})
                    let data = {
                        Codigo: productos[i].Codigo, 
                        TipoProducto: "Amortiguador", 
                        ModeloProducto: amortiguador.ModeloProducto, 
                        Nombre: amortiguador.Nombre, 
                        Proveedor: amortiguador.Proveedor, 
                        Descripcion: amortiguador.Descripcion, 
                        Precio: productos[i].PrecioVenta, 
                    }
                    tbody.push(data)
                }
                lineas = 7
                let data = {
                    thead,
                    tbody,
                    lineas
                }
                res.send(JSON.stringify(data))

            }
            if(Precio == "FOB"){
                let productos = await productosDB.find({Cantidad : {$gt : 0}, TipoProducto: "Amortiguador"})
                let thead = ["Código","Tipo de producto","Modelo de producto","Nombre","Proveedor", "Descripción","Precio FOB"]
                let tbody = []
                for(i=0; i< productos.length; i++){
                    let amortiguador = await amortiguadoresDB.findOne({Codigo: productos[i].Codigo})
                    let data = {
                        Codigo: productos[i].Codigo, 
                        TipoProducto: "Amortiguador", 
                        ModeloProducto: amortiguador.ModeloProducto, 
                        Nombre: amortiguador.Nombre, 
                        Proveedor: amortiguador.Proveedor, 
                        Descripcion: amortiguador.Descripcion, 
                        Precio: productos[i].PrecioFOB, 
                    }
                    tbody.push(data)
                }
                lineas = 7
                let data = {
                    thead,
                    tbody,
                    lineas
                }
                res.send(JSON.stringify(data))
            }
        }
        if(TipoProducto == "Baterias"){
            if(Precio == "Todos"){
                //pendiente
            }
            if(Precio == "Venta"){
                //pendiente
            }
            if(Precio == "FOB"){
                //pendiente
            }
        }
        if(TipoProducto == "Bombas"){
            if(Precio == "Todos"){
                //pendiente
            }
            if(Precio == "Venta"){
                //pendiente
            }   
            if(Precio == "FOB"){
                //pendiente
            }
        }
        if(TipoProducto == "Bujes"){
            if(Precio == "Todos"){
                //pendiente
            }
            if(Precio == "Venta"){
                //pendiente
            }
            if(Precio == "FOB"){
                //pendiente
            }
        }

    }
})


router.get('/estructura-costos', isAuthenticatedInventario, async (req, res) => {
    res.render('admin/inventario/estructura-costos')
})

router.get('/importar-format-excel-estrcutura-costos', isAuthenticatedInventario, async (req, res) => {
    let productos = await productosDB.find().sort({Codigo: 1})
    const xl = require("excel4node");
        
    const wb = new xl.Workbook();

    const ws = wb.addWorksheet("Estructura de costos");

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
    ws.cell(1,1).string("Codigo").style(headers2)
    ws.cell(1,2).string("TipoProducto").style(headers2)
    ws.cell(1,3).string("Descripcion").style(headers2)
    ws.cell(1,4).string("PrecioVenta").style(headers2)
    ws.cell(1,5).string("PrecioVentaNuevo").style(headers3)
    ws.cell(1,6).string("PrecioFOB").style(headers2)
    ws.cell(1,7).string("PrecioFOBNuevo").style(headers3)

    let fila = 2
    for(i=0; i< productos.length; i++){
        columna = 1
        ws.cell(fila, columna++).string(productos[i].Codigo).style(lineas)
        ws.cell(fila, columna++).string(productos[i].TipoProducto).style(lineas)
        ws.cell(fila, columna++).string(productos[i].Descripcion).style(lineas)
        ws.cell(fila, columna++).number(productos[i].PrecioVenta).style(lineas)
        ws.cell(fila, columna++).string("").style(lineas)
        ws.cell(fila, columna++).number(productos[i].PrecioFOB).style(lineas)
        ws.cell(fila, columna++).string("").style(lineas)
        fila++
    }
    wb.write(`Estructura de costos.xlsx`, res);

})


router.post('/leer-estructura-costo', isAuthenticatedInventario,upload.single('Control'), async (req, res) => {
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
    let Productos 
    function leerExcel(ruta){
      const workbook = XLSX.readFile(ruta)
      const workbookSheets = workbook.SheetNames
      Sucursal = workbookSheets[0]
      const sheet = workbookSheets[0]
      const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
      Productos = dataExcel
  
    }
    leerExcel(path.join(__dirname, "controles", "control.xlsx"))
    for(i=0; i< Productos.length; i++){
        if(Productos[i].PrecioVentaNuevo == '' || Productos[i].PrecioFOBNuevo == '' || 
            Productos[i].Codigo  == '' || Productos[i].TipoProducto == ''  ||
            Productos[i].Descripcion  == '' ||  Productos[i].PrecioVenta  == '' || Productos[i].PrecioFOB == ''){
            req.flash("error", 'Los campos no pueden estar vacios. Por favor, valide el formato a cargar e intente de nuevo')
            res.redirect('/estructura-costos')
            return
        }
    }
    let dataProductos = []
    for(r=0; r< Productos.length; r++){
        await productosDB.findOneAndUpdate({Codigo: Productos[r].Codigo},{
            PrecioVenta : Productos[r].PrecioVentaNuevo,
            PrecioFOB : Productos[r].PrecioFOBNuevo
        })
        let data = {
            Codigo : Productos[r].Codigo,
            TipoProducto : Productos[r].TipoProducto,
            Descripcion : Productos[r].Descripcion,
            PrecioVentaAnterior : Productos[r].PrecioVenta,
            PrecioVentaNuevo : Productos[r].PrecioVentaNuevo,
            PrecioFOBAnterior : Productos[r].PrecioFOB,
            PrecioFOBNuevo : Productos[r].PrecioFOBNuevo,
        }
        dataProductos.push(data)
    }
    let ultimaEstructura = await estructuraCostosDB.find().sort({"Timestamp": -1})
    let Numero
    if(ultimaEstructura.length == 0){
        Numero = 20210001
    }else{
        Numero = +ultimaEstructura[0].Numero + 1
    }
    let nuevaEstructura = new estructuraCostosDB({
        Timestamp: Timestamp,
        Numero: Numero,
        Fecha: Fecha,
        Productos : dataProductos, 
    })
    await nuevaEstructura.save()
    req.flash("success","Precios guardados y actulizados correctamente")
    res.redirect("/estructura-costos")
  })


  router.get('/histoial-reestructuraciones', isAuthenticatedInventario, async (req, res) => {
      let estructuras = await estructuraCostosDB.find().sort({"Numero": -1})
      estructuras = estructuras.map((data)=> {
          return{
              Numero: data.Numero,
              Fecha: data.Fecha,
              _id: data._id,
          }
      })
      res.render('admin/inventario/historial-restrucutraciones',{
        estructuras
      })
  })

  router.get('/descargar-estructura/:id', isAuthenticatedInventario, async (req, res) => {
    let estructura = await estructuraCostosDB.findById(req.params.id)
    const xl = require("excel4node");
        
    const wb = new xl.Workbook();

    const ws = wb.addWorksheet("Estructura de costos");
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
    ws.cell(1,1).string("Codigo").style(headers2)
    ws.cell(1,2).string("TipoProducto").style(headers2)
    ws.cell(1,3).string("Descripcion").style(headers2)
    ws.cell(1,4).string("Precio venta anterior").style(headers2)
    ws.cell(1,5).string("Precio venta nuevo").style(headers2)
    ws.cell(1,6).string("Precio FOB anterior").style(headers2)
    ws.cell(1,7).string("Precio venta nuevo").style(headers2)
    let fila = 2
    for(i=0; i< estructura.Productos.length; i++){
        columna = 1
        ws.cell(fila, columna++).string(estructura.Productos[i].Codigo).style(lineas)
        ws.cell(fila, columna++).string(estructura.Productos[i].TipoProducto).style(lineas)
        ws.cell(fila, columna++).string(estructura.Productos[i].Descripcion).style(lineas)
        ws.cell(fila, columna++).number(estructura.Productos[i].PrecioVentaAnterior).style(lineas)
        ws.cell(fila, columna++).number(estructura.Productos[i].PrecioVentaNuevo).style(lineas)
        ws.cell(fila, columna++).number(estructura.Productos[i].PrecioFOBAnterior).style(lineas)
        ws.cell(fila, columna++).number(estructura.Productos[i].PrecioFOBNuevo).style(lineas)
        fila++
    }
    wb.write(`Estructura ${estructura.Numero} - ${estructura.Fecha}.xlsx`, res);

  })

router.get('/descarga-inventario', isAuthenticatedInventario, async (req, res) => {
    let productos = await productosDB.find().sort({"Codigo": 1})
    productos = productos.map((data) => {
        return{
            Codigo: data.Codigo,
        }
    })
    res.render('admin/inventario/descarga',{
        productos
    })
})
router.get('/carga-inventario', isAuthenticatedInventario, async (req, res) => {
    let productos = await productosDB.find().sort({"Codigo": 1})
    productos = productos.map((data) => {
        return{
            Codigo: data.Codigo,
        }
    })
    res.render('admin/inventario/carga',{
        productos
    })
})

router.post('/descargar-inventario', isAuthenticatedInventario, async (req, res) => {
    let {Codigo, Cantidad, Comentario} = req.body
    if(!Codigo || Codigo == "" || Codigo == 0 || !Cantidad || Cantidad == "" || Cantidad == 0 || !Comentario || Comentario == "" || Comentario == 0){
        req.flash("error", "Para poder realizar una descarga ningun campo puede estar vacío. Por favor, valide e intente de nuevo")
        res.redirect('/descarga-inventario')
    }else{
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
        let producto = await productosDB.findOne({Codigo: Codigo})
        let CantidadNueva = +producto.Cantidad - +Cantidad
        let HistorialMovimiento = {
            FechaMovimiento : Fecha,
            CantidadAnterior : producto.Cantidad,
            CantidadMovida : Cantidad,
            CantidadNueva : CantidadNueva,
            Comentario : Comentario,
            Timestamp : Timestamp,
            TipoMovimiento : "Descarga",
        }
        await productosDB.findByIdAndUpdate(producto._id,{
            Cantidad: CantidadNueva,
            $push: {HistorialMovimiento : HistorialMovimiento}
        })
        req.flash("success","Descarga procesada correctamente")
        res.redirect('/descarga-inventario')
    }

})


router.post('/carga-inventario', isAuthenticatedInventario, async (req, res) => {
    let {Codigo, Cantidad, Comentario} = req.body
    if(!Codigo || Codigo == "" || Codigo == 0 || !Cantidad || Cantidad == "" || Cantidad == 0 || !Comentario || Comentario == "" || Comentario == 0){
        req.flash("error", "Para poder realizar una carga ningun campo puede estar vacío. Por favor, valide e intente de nuevo")
        res.redirect('/carga-inventario')
    }else{
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
        let producto = await productosDB.findOne({Codigo: Codigo})
        let CantidadNueva = +producto.Cantidad + +Cantidad
        let HistorialMovimiento = {
            FechaMovimiento : Fecha,
            CantidadAnterior : producto.Cantidad,
            CantidadMovida : Cantidad,
            CantidadNueva : CantidadNueva,
            Comentario : Comentario,
            Timestamp : Timestamp,
            TipoMovimiento : "Carga",
        }
        await productosDB.findByIdAndUpdate(producto._id,{
            Cantidad: CantidadNueva,
            $push: {HistorialMovimiento : HistorialMovimiento}
        })
        req.flash("success","Carga procesada correctamente")
        res.redirect('/carga-inventario')
    }

})


router.post('/solicitar-cantidad', async (req, res) => {
    let {Codigo} = req.body
    let producto = await productosDB.findOne({Codigo:Codigo})
    let Cantidad = producto.Cantidad
    res.send(JSON.stringify(Cantidad))
})

router.get('/nueva-nota-entrega', isAuthenticatedFacturacion, async (req, res) => {
    let productos = await productosDB.find().sort({"Codigo":1})
    productos = productos.map((data) => {
        return{
            Codigo: data.Codigo,
            _id: data._id
        }
    })
 
    let transporte = await transporteDB.find().sort({"Empresa": -1})
    transporte = transporte.map((data) => {
        return{
            Empresa: data.Empresa,
            _id: data._id
        }
    }) 
    let Clientes = await clientesDB.find().sort({"Empresa": -1})
    Clientes = Clientes.map((data) => {
        return{
            Empresa: data.Empresa,
            _id: data._id
        }
    })
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
    res.render('admin/facturacion/nota-entrega',{
        Fecha,
        Clientes,
        transporte,
        productos
    })
})

router.post('/info-nueva-nota', isAuthenticatedFacturacion, async (req, res) => {
    let notaEntrega = await notasEntregaDB.find().sort({"Timestamp":-1})
    let cambioFacturacion = await cambioFacturacionDB.find()
    if(cambioFacturacion.length == 0){
        cambioFacturacion = 0
    }else{
        cambioFacturacion = cambioFacturacion[0].Cambio
    }
        
    let Numero = 0
    if(notaEntrega.length == 0){
        Numero = 20210000001
    }else{
        Numero = +notaEntrega[0].Numero + 1
    }
    let data = {
        notaEntrega : Numero,
        Cambio: cambioFacturacion
    }
    res.send(JSON.stringify(data))
})

router.post('/solicitar-info-cliente-facturacion', async (req, res) => {
    let {_idCliente} = req.body
    let Cliente = await clientesDB.findById(_idCliente)
    let saldoFavor = Cliente.SaldoFavor
    let garantias = await garantiasDB.find({$and: [{Estado:"Pendiente"},{Cliente:Cliente.Empresa}]})
    garantias = garantias.map((data) => {
        return{
            Codigo: data.Codigo,
            Cantidad:data.Cantidad,
            PrecioUnitario: (+data.Valor / +data.Cantidad).toFixed(2)
        }
    })
    let Vendedor = await vendedoresDB.findById(Cliente._idVendedor)
    let vendedores = await vendedoresDB.find().sort({Nombres: 1})
    
    let data = {
        Cliente,
        saldoFavor,
        garantias,
        Vendedor,
        vendedores
    }
    res.send(JSON.stringify(data))

})

router.post('/solicitar-info-transporte', isAuthenticatedFacturacion, async (req, res) => {
    let {_id} = req.body
    let transporte = await transporteDB.findById(_id)
    let Zonas = transporte.Tarifario
    res.send(JSON.stringify(Zonas))
})

router.post('/solicitar-info-producto', isAuthenticatedFacturacion, async (req, res) => {
    let {Codigo} = req.body
    let Producto = await productosDB.findOne({Codigo:Codigo})
    res.send(JSON.stringify(Producto))
})
router.post('/enviar-nota-entrega', isAuthenticatedFacturacion,async (req, res) => {
    let {
        Fecha, 
        Numero, 
        CambioBolivares, 
        Cliente, 
        Vendedor, 
        Transporte, 
        Zona, 
        Productos, 
        PrecioTotal, 
        Orden,
        Descuento,
        BaseImponible,
        Iva,
        TotalSinDescuento,
        Comentario,
        CantidadTotalFactura,
        Porcentaje,
        Vencimiento
    } = req.body

    let Timestamp = Date.now();
    let cambioFacturacion = await cambioFacturacionDB.find()
    let comision = await comisionesDB.find().sort({"Timestamp":-1})
    let cliente = await clientesDB.findById(Cliente)
    Cliente = cliente.Empresa
    let vendedor = await vendedoresDB.findById(cliente._idVendedor)
    let notasTransporte = await notastransporteDB.find().sort({"Timestamp":-1})
    let transporte = await transporteDB.findById(Transporte)
    Transporte = transporte.Empresa
    let notaTransporte = 0
    let CantidadBase = 0
    let CantidadGuardapolvo = 0
    let CantidadValvula = 0
    let CantidadBujias = 0
    let CantidadAmortiguadores = 0
    let CantidadBaterias = 0
    let CantidadBombas = 0
    let CantidadBujes = 0
    let valorBase = 0
    let valorGuardapolvo = 0
    let valorValvula = 0
    let valorBujias = 0
    let valorAmortiguadores = 0
    let valorBaterias = 0
    let valorBombas = 0
    let valorBujes = 0
    let valorUtilidadesBase = 0
    let valorUtilidadesBujias = 0
    let valorUtilidadesGuardapolvo = 0
    let valorUtilidadesValvula = 0
    let valorUtilidadesAmortiguadores = 0
    let valorUtilidadesBaterias = 0
    let valorUtilidadesBombas = 0
    let valorUtilidadesBujes = 0
    let ventasAmortiguadoresGeneral = await ventasAmortiguadoresGeneralDB.find()
    let ventasBujiasGeneral = await ventasBujiasGeneralDB.find()
    let ventasBasesGeneral = await ventasBasesGeneralDB.find()
    let ventasValvulasGeneral = await ventasValvulasGeneralDB.find()
    let ventasGuardapolvoGeneral = await ventasGuardapolvoGeneralDB.find()
    let ventasBasesMes = await ventasBasesMesDB.find()
    let ventasBujiasMes = await ventasBujiasMesDB.find()
    let ventasValvulasMes = await ventasValvulasMesDB.find()
    let ventasGuardapolvoMes = await ventasGuardapolvoMesDB.find()
    let ventasBateriasGeneral = await ventasBateriasGeneralDB.find()
    let ventasBombasGeneral = await ventasBombasGeneralDB.find()
    let ventasBujesGeneral = await ventasBujesGeneralDB.find()
    let ventasZonasGeneral = await ventasZonasDB.find()
    let ventasGeneral = await ventasGeneralDB.find()
    let ventasGeneralClientes = await ventasGeneralClientesDB.find()
    let utilidadesGeneral = await utilidadesGeneralDB.find()
    let ventasGeneralVendedores = await ventasGeneralVendedoresDB.find()
    let ventasAmortiguadoresMes = await ventasAmortiguadoresMesDB.find()
    let ventasBateriasMes = await ventasBateriasMesDB.find()
    let ventasBombasMes = await ventasBombasMesDB.find()
    let ventasBujesMes = await ventasBujesMesDB.find()
    let ventasMeses = await ventasMesesDB.find()
    let ventasMesesClientes = await ventasMesesClientesDB.find()
    let ventasMesesVendedores = await ventasMesesVendedoresDB.find()
    let ventasZonasMes = await ventasZonasMesDB.find()
    let utilidadesPorMes = await utilidadesPorMesDB.find()
    let NumeroMes = Fecha.substr(5,2)
    let Anio = Fecha.substr(0,4)
    let Mes
    if(NumeroMes == "01"){Mes = "ENERO"}
    if(NumeroMes == "02"){Mes = "FEBRERO"}
    if(NumeroMes == "03"){Mes = "MARZO"}
    if(NumeroMes == "04"){Mes = "ABRIL"}
    if(NumeroMes == "05"){Mes = "MAYO"}
    if(NumeroMes == "06"){Mes = "JUNIO"}
    if(NumeroMes == "07"){Mes = "JULIO"}
    if(NumeroMes == "08"){Mes = "AGOSTO"}
    if(NumeroMes == "09"){Mes = "SEPTIEMBRE"}
    if(NumeroMes == "10"){Mes = "OCTUBRE"}
    if(NumeroMes == "11"){Mes = "NOVIEMBRE"}
    if(NumeroMes == "12"){Mes = "DICIEMBRE"}


    for(i=0; i< Productos.length; i++){
        let producto = await productosDB.findOne({Codigo: Productos[i].Codigo})
        //crear historia y actualizar stock
        Productos[i].Producto = producto.TipoProducto
        Productos[i].Descripcion = producto.Descripcion
        let cantidadNueva = +producto.Cantidad - +Productos[i].Cantidad
        let HistorialMovimiento = {
            FechaMovimiento: Fecha,
            CantidadAnterior: producto.Cantidad,
            CantidadMovida: Productos[i].Cantidad,
            CantidadNueva: cantidadNueva,
            Comentario: `Descarga por generación de factura ${Numero}`,
            Timestamp: Timestamp,
            TipoMovimiento: "Descarga",
        }
        await productosDB.findByIdAndUpdate(producto._id,{
            Cantidad: cantidadNueva,
            $push: {HistorialMovimiento: HistorialMovimiento}
        })
        if(producto.TipoProducto == "Bujia"){
            CantidadBujias += +Productos[i].Cantidad
            valorBujias += +Productos[i].PrecioTotal
            let costoRestar = +producto.PrecioFOB * +Productos[i].Cantidad
            let utilidad = (+Productos[i].PrecioTotal - +costoRestar).toFixed(2)
            valorUtilidadesBujias += +utilidad
        }
        if(producto.TipoProducto == "Valvula"){
            CantidadValvula += +Productos[i].Cantidad
            valorValvula += +Productos[i].PrecioTotal
            let costoRestar = +producto.PrecioFOB * +Productos[i].Cantidad
            let utilidad = (+Productos[i].PrecioTotal - +costoRestar).toFixed(2)
            valorUtilidadesValvula += +utilidad
        }
        if(producto.TipoProducto == "Guardapolvo"){
            CantidadGuardapolvo += +Productos[i].Cantidad
            valorGuardapolvo += +Productos[i].PrecioTotal
            let costoRestar = +producto.PrecioFOB * +Productos[i].Cantidad
            let utilidad = (+Productos[i].PrecioTotal - +costoRestar).toFixed(2)
            valorUtilidadesGuardapolvo += +utilidad
        }
        if(producto.TipoProducto == "Base amortiguador"){
            CantidadBase += +Productos[i].Cantidad
            valorBase += +Productos[i].PrecioTotal
            let costoRestar = +producto.PrecioFOB * +Productos[i].Cantidad
            let utilidad = (+Productos[i].PrecioTotal - +costoRestar).toFixed(2)
            valorUtilidadesBase += +utilidad
        }
        if(producto.TipoProducto == "Amortiguador"){
            CantidadAmortiguadores += +Productos[i].Cantidad
            valorAmortiguadores += +Productos[i].PrecioTotal
            let costoRestar = +producto.PrecioFOB * +Productos[i].Cantidad
            let utilidad = (+Productos[i].PrecioTotal - +costoRestar).toFixed(2)
            valorUtilidadesAmortiguadores += +utilidad
        }
        if(producto.TipoProducto == "Bateria"){
            CantidadBaterias += +Productos[i].PrecioTotal
            valorBaterias += +Productos[i].PrecioTotal
            let costoRestar = +producto.PrecioFOB * +Productos[i].Cantidad
            let utilidad = (+Productos[i].PrecioTotal - +costoRestar).toFixed(2)
            valorUtilidadesBaterias += +utilidad
        }
        if(producto.TipoProducto == "Bomba"){
            CantidadBombas += +Productos[i].PrecioTotal
            valorBombas += +Productos[i].PrecioTotal
            let costoRestar = +producto.PrecioFOB * +Productos[i].Cantidad
            let utilidad = (+Productos[i].PrecioTotal - +costoRestar).toFixed(2)
            valorUtilidadesBombas += +utilidad
        }
        if(producto.TipoProducto == "Buje"){
            CantidadBujes += +Productos[i].PrecioTotal
            valorBujes += +Productos[i].PrecioTotal
            let costoRestar = +producto.PrecioFOB * +Productos[i].Cantidad
            let utilidad = (+Productos[i].PrecioTotal - +costoRestar).toFixed(2)
            valorUtilidadesBujes += +utilidad
        }
    }
    if(notasTransporte.length == 0){
        notaTransporte = 1000000001
    }else{
        notaTransporte = +notasTransporte[0].NumeroNota + 1
    }
    if(cambioFacturacion.length == 0){
        let cambioFacturacion = new cambioFacturacionDB({
            Cambio: CambioBolivares
        })
        await cambioFacturacion.save()
    }else{
        await cambioFacturacionDB.findById(cambioFacturacion[0]._id,{
            Cambio: CambioBolivares
        })
    }
    let numeroComision = 0
    if(comision.length == 0){
        numeroComision = 2021000001
    }else{
        numeroComision = +comision[0].NumeroComision + 1
    }
    let factorComision = 0
    if(+Porcentaje < 10){
        factorComision = `0.0${Porcentaje}`
    }else{
        factorComision = `0.${Porcentaje}`
    }
    let GananciasVendedor = (+BaseImponible * +factorComision).toFixed(2)
    let nuevaComision = new comisionesDB({
        Timestamp: Timestamp, 
        Fecha: Fecha, 
        NumeroComision: numeroComision, 
        NumeroFactura: Numero, 
        PrecioFactura: PrecioTotal, 
        PorcentajeGanancia: Porcentaje, 
        Comision: GananciasVendedor, 
        _idVendedor: vendedor._id, 
        Nombres: vendedor.Nombres, 
        Apellidos: vendedor.Apellidos, 
        Zona: Zona, 
        Cliente: Cliente, 
        SaldoComision: GananciasVendedor,
    })
    let PrecioTotalFacturaBS = (+PrecioTotal * +CambioBolivares).toFixed(2)
    let tarifa = transporte.Tarifario.find((data) => data.Ciudad ==  Zona)
    tarifa = tarifa.Porcentaje
    let factorTarifa = 0
    if(+tarifa < 10){
        factorTarifa = `0.0${tarifa}`
    }else{
        factorTarifa = `0.${tarifa}`
    }
    let PrecioPagarTarifa = (+PrecioTotalFacturaBS * +factorTarifa).toFixed(2)
    //await nuevoNotaTransporte.save()
    await nuevaComision.save()
    // Actualizando datos del dashboard 

    //creamos/actualizamos bases generales
    if(ventasBujiasGeneral.length == 0){
        //creamos nuevo general
        let nuevoventasBujiasGeneral = new ventasBujiasGeneralDB({
            CantidadTotal : CantidadBujias,
            MontoTotal : valorBujias,
            UtilidadesTotales : valorUtilidadesBujias,
        })
        await nuevoventasBujiasGeneral.save()

    }else{
        //actualzamos general existente
        let CantidadTotal = +ventasBujiasGeneral[0].CantidadTotal + +CantidadBujias
        let MontoTotal = +ventasBujiasGeneral[0].MontoTotal + +valorBujias
        let UtilidadesTotales = +ventasBujiasGeneral[0].UtilidadesTotales + +valorUtilidadesBujias
        await ventasBujiasGeneralDB.findByIdAndUpdate(ventasBujiasGeneral[0]._id,{
            CantidadTotal,
            MontoTotal,
            UtilidadesTotales 
        })
    }
    if(ventasGuardapolvoGeneral.length == 0){
        //creamos nuevo general
        let nuevoventasGuardapolvoGeneral = new ventasGuardapolvoGeneralDB({
            CantidadTotal : CantidadGuardapolvo,
            MontoTotal : valorGuardapolvo,
            UtilidadesTotales : valorUtilidadesGuardapolvo,
        })
        await nuevoventasGuardapolvoGeneral.save()

    }else{
        //actualzamos general existente
        let CantidadTotal = +ventasGuardapolvoGeneral[0].CantidadTotal + +CantidadGuardapolvo
        let MontoTotal = +ventasGuardapolvoGeneral[0].MontoTotal + +valorGuardapolvo
        let UtilidadesTotales = +ventasGuardapolvoGeneral[0].UtilidadesTotales + +valorUtilidadesGuardapolvo
        await ventasGuardapolvoGeneralDB.findByIdAndUpdate(ventasGuardapolvoGeneral[0]._id,{
            CantidadTotal,
            MontoTotal,
            UtilidadesTotales 
        })
    }

    if(ventasValvulasGeneral.length == 0){
        //creamos nuevo general
        let nuevoventasValvulasGeneral = new ventasValvulasGeneralDB({
            CantidadTotal : CantidadValvula,
            MontoTotal : valorValvula,
            UtilidadesTotales : valorUtilidadesValvula,
        })
        await nuevoventasValvulasGeneral.save()

    }else{
        //actualzamos general existente
        let CantidadTotal = +ventasValvulasGeneral[0].CantidadTotal + +CantidadValvula
        let MontoTotal = +ventasValvulasGeneral[0].MontoTotal + +valorValvula
        let UtilidadesTotales = +ventasValvulasGeneral[0].UtilidadesTotales + +valorUtilidadesValvula
        await ventasValvulasGeneralDB.findByIdAndUpdate(ventasValvulasGeneral[0]._id,{
            CantidadTotal,
            MontoTotal,
            UtilidadesTotales 
        })
    }
    if(ventasBasesGeneral.length == 0){
        //creamos nuevo general
        let nuevoventasBasesGeneral = new ventasBasesGeneralDB({
            CantidadTotal : CantidadBase,
            MontoTotal : valorBase,
            UtilidadesTotales : valorUtilidadesBase,
        })
        await nuevoventasBasesGeneral.save()

    }else{
        //actualzamos general existente
        let CantidadTotal = +ventasBasesGeneral[0].CantidadTotal + +CantidadBase
        let MontoTotal = +ventasBasesGeneral[0].MontoTotal + +valorBase
        let UtilidadesTotales = +ventasBasesGeneral[0].UtilidadesTotales + +valorUtilidadesBase
        await ventasAmortiguadoresGeneralDB.findByIdAndUpdate(ventasBasesGeneral[0]._id,{
            CantidadTotal,
            MontoTotal,
            UtilidadesTotales 
        })
    }
    if(ventasAmortiguadoresGeneral.length == 0){
        //creamos nuevo general
        let nuevoventasAmortiguadoresGeneral = new ventasAmortiguadoresGeneralDB({
            CantidadTotal : CantidadAmortiguadores,
            MontoTotal : valorAmortiguadores,
            UtilidadesTotales : valorUtilidadesAmortiguadores,
        })
        await nuevoventasAmortiguadoresGeneral.save()

    }else{
        //actualzamos general existente
        let CantidadTotal = +ventasAmortiguadoresGeneral[0].CantidadTotal + +CantidadAmortiguadores
        let MontoTotal = +ventasAmortiguadoresGeneral[0].MontoTotal + +valorAmortiguadores
        let UtilidadesTotales = +ventasAmortiguadoresGeneral[0].UtilidadesTotales + +valorUtilidadesAmortiguadores
        await ventasAmortiguadoresGeneralDB.findByIdAndUpdate(ventasAmortiguadoresGeneral[0]._id,{
            CantidadTotal,
            MontoTotal,
            UtilidadesTotales 
        })
    }
    if(ventasBateriasGeneral.length == 0){
        //creamos nuevo general
        let nuevoventasBateriasGeneral = new ventasBateriasGeneralDB({
            CantidadTotal : CantidadBaterias,
            MontoTotal : valorBaterias,
            UtilidadesTotales : valorUtilidadesBaterias,
        })
        await nuevoventasBateriasGeneral.save()

    }else{
        //actualzamos general existente
        let CantidadTotal = +ventasBateriasGeneral[0].CantidadTotal + +CantidadBaterias
        let MontoTotal = +ventasBateriasGeneral[0].MontoTotal + +valorBaterias
        let UtilidadesTotales = +ventasBateriasGeneral[0].UtilidadesTotales + +valorUtilidadesBaterias
        await ventasBateriasGeneralDB.findByIdAndUpdate(ventasBateriasGeneral[0]._id,{
            CantidadTotal,
            MontoTotal,
            UtilidadesTotales 
        })
    }
    if(ventasBombasGeneral.length == 0){
        //creamos nuevo general
        let nuevoventasBombasGeneral = new ventasBombasGeneralDB({
            CantidadTotal : CantidadBombas,
            MontoTotal : valorBombas,
            UtilidadesTotales : valorUtilidadesBombas,
        })
        await nuevoventasBombasGeneral.save()

    }else{
        let CantidadTotal = +ventasBombasGeneral[0].CantidadTotal + +CantidadBombas
        let MontoTotal = +ventasBombasGeneral[0].MontoTotal + +valorBombas
        let UtilidadesTotales = +ventasBombasGeneral[0].UtilidadesTotales + +valorUtilidadesBombas
        await ventasBombasGeneralDB.findByIdAndUpdate(ventasBombasGeneral[0]._id,{
            CantidadTotal,
            MontoTotal,
            UtilidadesTotales 
        })
    }
    if(ventasBujesGeneral.length == 0){
        //creamos nuevo general
        let nuevoventasBujesGeneral = new ventasBujesGeneralDB({
            CantidadTotal : CantidadBujes,
            MontoTotal : valorBujes,
            UtilidadesTotales : valorUtilidadesBujes,
        })
        await nuevoventasBujesGeneral.save()

    }else{
        //actualzamos general existente
        let CantidadTotal = +ventasBujesGeneral[0].CantidadTotal + +CantidadBujes
        let MontoTotal = +ventasBujesGeneral[0].MontoTotal + +valorBujes
        let UtilidadesTotales = +ventasBujesGeneral[0].UtilidadesTotales + +valorUtilidadesBujes
        await ventasBujesGeneralDB.findByIdAndUpdate(ventasBujesGeneral[0]._id,{
            CantidadTotal,
            MontoTotal,
            UtilidadesTotales 
        })
    }
    if(ventasZonasGeneral.length == 0){
        //creamos nuevo general
        let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
        let nuevoventasZonasGeneral = await ventasZonasDB({
            CantidadTotal: CantidadTotalFactura,
            MontoTotal: PrecioTotal,
            UtilidadesTotales: UtilidadesTotales,
            Zona: Zona,
        })
        await nuevoventasZonasGeneral.save()

    }else{
        //actualzamos general existente
        let validacion = ventasZonasGeneral.find((data) => data.Zona == Zona) 
        if(validacion){
            let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
            let CantidadTotal = +validacion.CantidadTotal + +CantidadTotalFactura
            let MontoTotal = +validacion.MontoTotal + +PrecioTotal
            UtilidadesTotales = +validacion.UtilidadesTotales + +UtilidadesTotales
            await ventasZonasDB.findByIdAndUpdate(validacion._id,{
                CantidadTotal,
                MontoTotal,
                UtilidadesTotales,
            })
        }else{
            let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
            let nuevoventasZonasGeneral = await ventasZonasDB({
                CantidadTotal: CantidadTotalFactura,
                MontoTotal: PrecioTotal,
                UtilidadesTotales: UtilidadesTotales,
                Zona: Zona,
            })
            await nuevoventasZonasGeneral.save()

        }
    }
    if(ventasGeneral.length == 0){
        //creamos nuevo general
        let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
        let nuevoventasGeneral = await ventasGeneralDB({
            CantidadTotal: CantidadTotalFactura,
            MontoTotal: PrecioTotal,
            UtilidadesTotales: UtilidadesTotales,
        })
        await nuevoventasGeneral.save()

    }else{
        //actualzamos general existente
        let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
        let CantidadTotal = +ventasGeneral[0].CantidadTotal + +CantidadTotalFactura
        let MontoTotal = +ventasGeneral[0].MontoTotal + +PrecioTotal
        UtilidadesTotales = +ventasGeneral[0].UtilidadesTotales + +UtilidadesTotales
        await ventasGeneralDB.findByIdAndUpdate(ventasGeneral[0]._id,{
            UtilidadesTotales,
            CantidadTotal,
            MontoTotal,
        })

    }
    if(ventasGeneralClientes.length == 0){
        //creamos nuevo general
        let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
        let nuevoventasGeneralClientes = new ventasGeneralClientesDB({
            Cliente: Cliente,
            _idCliente: cliente._id,
            CantidadTotal: CantidadTotalFactura,
            MontoTotal: PrecioTotal,
            UtilidadesTotales: UtilidadesTotales,
        })
        await nuevoventasGeneralClientes.save()

    }else{
        //actualzamos general existente
        let validacion = ventasGeneralClientes.find((data) => data._idCliente == cliente._id) 
        if(validacion){
            let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
            let CantidadTotal = +validacion.CantidadTotal + +CantidadTotalFactura
            let MontoTotal = +validacion.MontoTotal + +PrecioTotal
            UtilidadesTotales = +validacion.UtilidadesTotales + +UtilidadesTotales
            await ventasGeneralClientesDB.findByIdAndUpdate(validacion._id,{
                UtilidadesTotales,
                CantidadTotal,
                MontoTotal
            })
        }else{
            let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
            let nuevoventasGeneralClientes = new ventasGeneralClientesDB({
                Cliente: Cliente,
                _idCliente: cliente._id,
                CantidadTotal: CantidadTotalFactura,
                MontoTotal: PrecioTotal,
                UtilidadesTotales: UtilidadesTotales,
            })
            await nuevoventasGeneralClientes.save()
        }
    }
    if(ventasGeneralVendedores.length == 0){
        //creamos nuevo general
        let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
        let nuevventasGeneralVendedores = new ventasGeneralVendedoresDB({
            Vendedor: Vendedor,
            _idVendedor: vendedor._id,
            CantidadTotal: CantidadTotalFactura,
            MontoTotal: PrecioTotal,
            UtilidadesTotales: UtilidadesTotales,
        })
        await nuevventasGeneralVendedores.save()

    }else{
        //actualzamos general existente
        let validacion = ventasGeneralVendedores.find((data) => data._idVendedor == vendedor._id) 
        if(validacion){
            let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
            let CantidadTotal = +validacion.CantidadTotal + +CantidadTotalFactura
            let MontoTotal = +validacion.MontoTotal + +PrecioTotal
            UtilidadesTotales = +validacion.UtilidadesTotales + +UtilidadesTotales
            await ventasGeneralVendedoresDB.findByIdAndUpdate(ventasGeneralVendedores[0]._id,{
                UtilidadesTotales,
                CantidadTotal,
                MontoTotal
            })
        }else{
            let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
            let nuevventasGeneralVendedores = new ventasGeneralVendedoresDB({
                Vendedor: Vendedor,
                _idVendedor: vendedor._id,
                CantidadTotal: CantidadTotalFactura,
                MontoTotal: PrecioTotal,
                UtilidadesTotales: UtilidadesTotales,
            })
            await nuevventasGeneralVendedores.save()
        }
    }
    if(utilidadesGeneral.length == 0){
        //creamos nuevo general
        let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
        let nuevaUtilidadGeneral = await utilidadesGeneralDB({
            CantidadTotal: CantidadTotalFactura, 
            MontoTotal: PrecioTotal, 
            UtilidadesTotales: UtilidadesTotales, 
        })
        await nuevaUtilidadGeneral.save()

    }else{
        //actualzamos general existente
        let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
        let CantidadTotal = +utilidadesGeneral[0].CantidadTotal + +CantidadTotalFactura
        let MontoTotal = +utilidadesGeneral[0].MontoTotal + +PrecioTotal
        UtilidadesTotales = +utilidadesGeneral[0].UtilidadesTotales + +MontoTotal
        await utilidadesGeneralDB.findByIdAndUpdate(utilidadesGeneral[0]._id,{
            CantidadTotal,
            MontoTotal,
            UtilidadesTotales,
        })
    }
    //cerramos creacion/actualizacion bases generales

    //creamos/actualizamos bases por meses
    
    if(ventasBujiasMes.length == 0){
        //creamos nueva
        let nuevaventasBujiasMes = new ventasBujiasMesDB({
            Anio: Anio,
            NumeroMes: NumeroMes, 
            Mes: Mes,
            CantidadTotal: CantidadBujias,
            MontoTotal: valorBujias,
            UtilidadesTotales: valorUtilidadesBujias,
        })
        await nuevaventasBujiasMes.save()

    }else{
        //actualizamos existente
        let validacion = ventasBujiasMes.find((data) => data.Anio == Anio && data.Mes == Mes) 
        if(validacion){
            let CantidadTotal = +validacion.CantidadTotal + +CantidadBujias
            let MontoTotal = +validacion.MontoTotal + +valorBujias
            let UtilidadesTotales = +validacion.UtilidadesTotales + +valorUtilidadesBujias
            await ventasBujiasMesDB.findByIdAndUpdate(validacion._id,{
                CantidadTotal,
                MontoTotal,
                UtilidadesTotales,
            })
        }else{
            let nuevaventasBujiasMes = new ventasBujiasMesDB({
                Anio: Anio,
                NumeroMes: NumeroMes, 
                Mes: Mes,
                CantidadTotal: CantidadBujias,
                MontoTotal: valorBujias,
                UtilidadesTotales: valorUtilidadesBujias,
            })
            await nuevaventasBujiasMes.save()
        }
    }
    ///
    if(ventasGuardapolvoMes.length == 0){
        //creamos nueva
        let nuevaventasGuardapolvoMes = new ventasGuardapolvoMesDB({
            Anio: Anio,
            NumeroMes: NumeroMes, 
            Mes: Mes,
            CantidadTotal: CantidadGuardapolvo,
            MontoTotal: valorGuardapolvo,
            UtilidadesTotales: valorUtilidadesGuardapolvo,
        })
        await nuevaventasGuardapolvoMes.save()

    }else{
        //actualizamos existente
        let validacion = ventasGuardapolvoMes.find((data) => data.Anio == Anio && data.Mes == Mes) 
        if(validacion){
            let CantidadTotal = +validacion.CantidadTotal + +CantidadGuardapolvo
            let MontoTotal = +validacion.MontoTotal + +valorGuardapolvo
            let UtilidadesTotales = +validacion.UtilidadesTotales + +valorUtilidadesGuardapolvo
            await ventasGuardapolvoMesDB.findByIdAndUpdate(validacion._id,{
                CantidadTotal,
                MontoTotal,
                UtilidadesTotales,
            })
        }else{
            let nuevaventasGuardapolvoMes = new ventasValvulasMesDB({
                Anio: Anio,
                NumeroMes: NumeroMes, 
                Mes: Mes,
                CantidadTotal: CantidadGuardapolvo,
                MontoTotal: valorGuardapolvo,
                UtilidadesTotales: valorUtilidadesGuardapolvo,
            })
            await nuevaventasGuardapolvoMes.save()
        }
    }
    ///
    if(ventasValvulasMes.length == 0){
        //creamos nueva
        let nuevaventasValvulasMes = new ventasValvulasMesDB({
            Anio: Anio,
            NumeroMes: NumeroMes, 
            Mes: Mes,
            CantidadTotal: CantidadValvula,
            MontoTotal: valorValvula,
            UtilidadesTotales: valorUtilidadesValvula,
        })
        await nuevaventasValvulasMes.save()

    }else{
        //actualizamos existente
        let validacion = ventasValvulasMes.find((data) => data.Anio == Anio && data.Mes == Mes) 
        if(validacion){
            let CantidadTotal = +validacion.CantidadTotal + +CantidadValvula
            let MontoTotal = +validacion.MontoTotal + +valorValvula
            let UtilidadesTotales = +validacion.UtilidadesTotales + +valorUtilidadesValvula
            await ventasValvulasMesDB.findByIdAndUpdate(validacion._id,{
                CantidadTotal,
                MontoTotal,
                UtilidadesTotales,
            })
        }else{
            let nuevaventasValvulasMes = new ventasValvulasMesDB({
                Anio: Anio,
                NumeroMes: NumeroMes, 
                Mes: Mes,
                CantidadTotal: CantidadValvula,
                MontoTotal: valorValvula,
                UtilidadesTotales: valorUtilidadesValvula,
            })
            await nuevaventasValvulasMes.save()
        }
    }
    ///
    if(ventasBasesMes.length == 0){
        //creamos nueva
        let nuevaventasBasesMes = new ventasBasesMesDB({
            Anio: Anio,
            NumeroMes: NumeroMes, 
            Mes: Mes,
            CantidadTotal: CantidadBase,
            MontoTotal: valorBase,
            UtilidadesTotales: valorUtilidadesBase,
        })
        await nuevaventasBasesMes.save()

    }else{
        //actualizamos existente
        let validacion = ventasBasesMes.find((data) => data.Anio == Anio && data.Mes == Mes) 
        if(validacion){
            let CantidadTotal = +validacion.CantidadTotal + +CantidadBase
            let MontoTotal = +validacion.MontoTotal + +valorBase
            let UtilidadesTotales = +validacion.UtilidadesTotales + +valorUtilidadesBase
            await ventasBasesMesDB.findByIdAndUpdate(validacion._id,{
                CantidadTotal,
                MontoTotal,
                UtilidadesTotales,
            })
        }else{
            let nuevaventasBasesMes = new ventasAmortiguadoresMesDB({
                Anio: Anio,
                NumeroMes: NumeroMes, 
                Mes: Mes,
                CantidadTotal: CantidadBase,
                MontoTotal: valorBase,
                UtilidadesTotales: valorUtilidadesBase,
            })
            await nuevaventasBasesMes.save()
        }
    }
    ///
    if(ventasAmortiguadoresMes.length == 0){
        //creamos nueva
        let nuevaventasAmortiguadoresMes = new ventasAmortiguadoresMesDB({
            Anio: Anio,
            NumeroMes: NumeroMes, 
            Mes: Mes,
            CantidadTotal: CantidadAmortiguadores,
            MontoTotal: valorAmortiguadores,
            UtilidadesTotales: valorUtilidadesAmortiguadores,
        })
        await nuevaventasAmortiguadoresMes.save()

    }else{
        //actualizamos existente
        let validacion = ventasAmortiguadoresMes.find((data) => data.Anio == Anio && data.Mes == Mes) 
        if(validacion){
            let CantidadTotal = +validacion.CantidadTotal + +CantidadAmortiguadores
            let MontoTotal = +validacion.MontoTotal + +valorAmortiguadores
            let UtilidadesTotales = +validacion.UtilidadesTotales + +valorUtilidadesAmortiguadores
            await ventasAmortiguadoresMesDB.findByIdAndUpdate(validacion._id,{
                CantidadTotal,
                MontoTotal,
                UtilidadesTotales,
            })
        }else{
            let nuevaventasAmortiguadoresMes = new ventasAmortiguadoresMesDB({
                Anio: Anio,
                NumeroMes: NumeroMes, 
                Mes: Mes,
                CantidadTotal: CantidadAmortiguadores,
                MontoTotal: valorAmortiguadores,
                UtilidadesTotales: valorUtilidadesAmortiguadores,
            })
            await nuevaventasAmortiguadoresMes.save()
        }
    }
    if(ventasBateriasMes.length == 0){
        //creamos nueva
        let nuevaventasBateriasMes = new ventasBateriasMesDB({
            Anio: Anio,
            NumeroMes: NumeroMes, 
            Mes: Mes,
            CantidadTotal: CantidadBaterias,
            MontoTotal: valorBaterias,
            UtilidadesTotales: valorUtilidadesBaterias,
        })
        await nuevaventasBateriasMes.save()

    }else{
        //actualizamos existente
        let validacion = ventasBateriasMes.find((data) => data.Anio == Anio && data.Mes == Mes) 
        if(validacion){
            let CantidadTotal = +validacion.CantidadTotal + +CantidadBaterias
            let MontoTotal = +validacion.MontoTotal + +valorBaterias
            let UtilidadesTotales = +validacion.UtilidadesTotales + +valorUtilidadesBaterias
            await ventasBateriasMesDB.findByIdAndUpdate(validacion._id,{
                CantidadTotal,
                MontoTotal,
                UtilidadesTotales,
            })
        }else{
            let nuevaventasBateriasMes = new ventasBateriasMesDB({
                Anio: Anio,
                NumeroMes: NumeroMes, 
                Mes: Mes,
                CantidadTotal: CantidadBaterias,
                MontoTotal: valorBaterias,
                UtilidadesTotales: valorUtilidadesBaterias,
            })
            await nuevaventasBateriasMes.save()
        }
    }
    if(ventasBombasMes.length == 0){
        //creamos nueva
        let nuevaventasBombasMes = new ventasBombasMesDB({
            Anio: Anio,
            NumeroMes: NumeroMes, 
            Mes: Mes,
            CantidadTotal: CantidadBombas,
            MontoTotal: valorBombas,
            UtilidadesTotales: valorUtilidadesBombas,
        })
        await nuevaventasBombasMes.save()

    }else{
        //actualizamos existente
        let validacion = ventasBombasMes.find((data) => data.Anio == Anio && data.Mes == Mes) 
        if(validacion){
            let CantidadTotal = +validacion.CantidadTotal + +CantidadBombas
            let MontoTotal = +validacion.MontoTotal + +valorBombas
            let UtilidadesTotales = +validacion.UtilidadesTotales + +valorUtilidadesBombas
            await ventasBombasMesDB.findByIdAndUpdate(validacion._id,{
                CantidadTotal,
                MontoTotal,
                UtilidadesTotales,
            })
        }else{
            let nuevaventasBombasMes = new ventasBombasMesDB({
                Anio: Anio,
                NumeroMes: NumeroMes, 
                Mes: Mes,
                CantidadTotal: CantidadBombas,
                MontoTotal: valorBombas,
                UtilidadesTotales: valorUtilidadesBombas,
            })
            await nuevaventasBombasMes.save()
        }
    }
    if(ventasBujesMes.length == 0){
        //creamos nueva
        let nuevaventasBujesMes = new ventasBujesMesDB({
            Anio: Anio,
            NumeroMes: NumeroMes, 
            Mes: Mes,
            CantidadTotal: CantidadBujes,
            MontoTotal: valorBujes,
            UtilidadesTotales: valorUtilidadesBujes,
        })
        await nuevaventasBujesMes.save()

    }else{
        //actualizamos existente
        let validacion = ventasBujesMes.find((data) => data.Anio == Anio && data.Mes == Mes) 
        if(validacion){
            let CantidadTotal = +validacion.CantidadTotal + +CantidadBujes
            let MontoTotal = +validacion.MontoTotal + +valorBujes
            let UtilidadesTotales = +validacion.UtilidadesTotales + +valorUtilidadesBujes
            await ventasBujesMesDB.findByIdAndUpdate(validacion._id,{
                CantidadTotal,
                MontoTotal,
                UtilidadesTotales,
            })
        }else{
            let nuevaventasBujesMes = new ventasBujesMesDB({
                Anio: Anio,
                NumeroMes: NumeroMes, 
                Mes: Mes,
                CantidadTotal: CantidadBujes,
                MontoTotal: valorBujes,
                UtilidadesTotales: valorUtilidadesBujes,
            })
            await nuevaventasBujesMes.save()
        }
    }
    if(ventasMeses.length == 0){
        //creamos nueva
        let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
        let nuevaventasMeses = new ventasMesesDB({
            Anio: Anio,
            NumeroMes: NumeroMes,
            Mes: Mes,
            CantidadTotal: CantidadTotalFactura,
            MontoTotal: PrecioTotal,
            UtilidadesTotales: UtilidadesTotales,
        })
        await nuevaventasMeses.save()

    }else{
        //actualizamos existente
        let validacion = ventasMeses.find((data) => data.Anio == Anio && data.Mes == Mes)
        if(validacion){
            let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
            let CantidadTotal = +validacion.CantidadTotal + +CantidadTotalFactura
            let MontoTotal = +validacion.MontoTotal + +PrecioTotal
            UtilidadesTotales = +validacion.UtilidadesTotales + +UtilidadesTotales
            await ventasMesesDB.findByIdAndUpdate(validacion._id,{
                CantidadTotal,
                MontoTotal,
                UtilidadesTotales
            })
        }else{
            let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
            let nuevaventasMeses = new ventasMesesDB({
                Anio: Anio,
                NumeroMes: NumeroMes,
                Mes: Mes,
                CantidadTotal: CantidadTotalFactura,
                MontoTotal: PrecioTotal,
                UtilidadesTotales: UtilidadesTotales,
            })
            await nuevaventasMeses.save()
        }
    }
    if(ventasMesesClientes.length == 0){
        //creamos nueva
        let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
        let nuevaventasMesesClientes = new ventasMesesClientesDB({
            Cliente: Cliente,
            _idCliente: cliente._id,
            Anio: Anio,
            NumeroMes: NumeroMes,
            Mes: Mes,
            CantidadTotal: CantidadTotalFactura,
            MontoTotal: PrecioTotal,
            UtilidadesTotales: UtilidadesTotales,
        })
        await nuevaventasMesesClientes.save()

    }else{
        //actualizamos existente
        let validacion = ventasMesesClientes.find((data) => data.Anio == Anio && data.Mes == Mes && data._idCliente == cliente._id)
        if(validacion){
            let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
            let CantidadTotal = +validacion.CantidadTotal + +CantidadTotalFactura
            let MontoTotal = +validacion.MontoTotal + +PrecioTotal
            UtilidadesTotales = +validacion.UtilidadesTotales + +UtilidadesTotales

            await ventasMesesClientesDB.findByIdAndUpdate(validacion._id,{
                CantidadTotal,
                MontoTotal,
                UtilidadesTotales,
            })
        }else{
        //creamos nueva
        let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
        let nuevaventasMesesClientes = new ventasMesesClientesDB({
            Cliente: Cliente,
            _idCliente: cliente._id,
            Anio: Anio,
            NumeroMes: NumeroMes,
            Mes: Mes,
            CantidadTotal: CantidadTotalFactura,
            MontoTotal: PrecioTotal,
            UtilidadesTotales: UtilidadesTotales,
        })
        await nuevaventasMesesClientes.save()
        }
    }
    if(ventasMesesVendedores.length == 0){
        //creamos nueva
        let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
        let nuevaventasMesesVendedores = new ventasMesesVendedoresDB({
            Vendedor: Vendedor,
            _idVendedor: vendedor._id,
            Anio: Anio,
            NumeroMes: NumeroMes,
            Mes: Mes,
            CantidadTotal: CantidadTotalFactura,
            MontoTotal: PrecioTotal,
            UtilidadesTotales: UtilidadesTotales,
        })
        await nuevaventasMesesVendedores.save()
    }else{
        //actualizamos existente
        let validacion = ventasMesesVendedores.find((data) => data.Anio == Anio && data.Mes == Mes && data._idVendedor == vendedor._id)
        if(validacion){
            let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
            let CantidadTotal = +validacion.CantidadTotal + +CantidadTotalFactura
            let MontoTotal = +validacion.MontoTotal + +PrecioTotal
            UtilidadesTotales = +validacion.UtilidadesTotales + +UtilidadesTotales
            await ventasMesesVendedoresDB.findByIdAndUpdate(validacion._id,{
                CantidadTotal,
                MontoTotal,
                UtilidadesTotales,
            })
        }else{
        //creamos nueva
        let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
        let nuevaventasMesesVendedores = new ventasMesesVendedoresDB({
            Vendedor: Vendedor,
            _idVendedor: vendedor._id,
            Anio: Anio,
            NumeroMes: NumeroMes,
            Mes: Mes,
            CantidadTotal: CantidadTotalFactura,
            MontoTotal: PrecioTotal,
            UtilidadesTotales: UtilidadesTotales,
        })
        await nuevaventasMesesVendedores.save()
        }

    }
    if(ventasZonasMes.length == 0){
        //creamos nueva
        let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
        let nuevaventasZonasMes = new ventasZonasMesDB({
            Anio: Anio,
            NumeroMes: NumeroMes ,
            Mes: Mes,
            CantidadTotal: CantidadTotalFactura ,
            MontoTotal: PrecioTotal,
            UtilidadesTotales: UtilidadesTotales,
            Zona: Zona,
        })
        await nuevaventasZonasMes.save()
    }else{
        //actualizamos existente
        let validacion = ventasZonasMes.find((data) => data.Anio == Anio && data.Mes == Mes && data.Zona == Zona)
        if(validacion){
            let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
            let CantidadTotal = +validacion.CantidadTotal + +CantidadTotalFactura
            let MontoTotal = +validacion.MontoTotal + +PrecioTotal
            UtilidadesTotales = +validacion.UtilidadesTotales + +UtilidadesTotales
            await ventasZonasMesDB.findByIdAndUpdate(validacion._id,{
                CantidadTotal,
                MontoTotal,
                MontoTotal
            })
        }else{
            let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
            let nuevaventasZonasMes = new ventasZonasMesDB({
                Anio: Anio,
                NumeroMes: NumeroMes ,
                Mes: Mes,
                CantidadTotal: CantidadTotalFactura ,
                MontoTotal: PrecioTotal,
                UtilidadesTotales: UtilidadesTotales,
                Zona: Zona,
            })
            await nuevaventasZonasMes.save()
        }
    }
    if(utilidadesPorMes.length == 0){
        //creamos nueva
        let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
        let nuevautilidadesPorMes = new utilidadesPorMesDB({
            Anio: Anio,
            NumeroMes: NumeroMes,
            Mes: Mes,
            CantidadTotal: CantidadTotalFactura,
            MontoTotal: PrecioTotal,
            UtilidadesTotales: UtilidadesTotales,
        })
        await nuevautilidadesPorMes.save()
    }else{
        //actualizamos existente
        let validacion = utilidadesPorMes.find((data) => data.Anio == Anio && data.Mes == Mes)
        if(validacion){
            let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
            let CantidadTotal = +validacion.CantidadTotal + +CantidadTotalFactura
            let MontoTotal = +validacion.MontoTotal + +PrecioTotal
            UtilidadesTotales = +validacion.UtilidadesTotales + +UtilidadesTotales
            await utilidadesPorMesDB.findByIdAndUpdate(validacion._id,{
                UtilidadesTotales,
                CantidadTotal,
                MontoTotal,
            })
        }else{
            let UtilidadesTotales = (+valorUtilidadesBujes + +valorUtilidadesBombas + +valorUtilidadesBaterias + +valorUtilidadesAmortiguadores)
            let nuevautilidadesPorMes = new utilidadesPorMesDB({
                Anio: Anio,
                NumeroMes: NumeroMes,
                Mes: Mes,
                CantidadTotal: CantidadTotalFactura,
                MontoTotal: PrecioTotal,
                UtilidadesTotales: UtilidadesTotales,
            })
            await nuevautilidadesPorMes.save()
        }
    }

    //cerramos creacion/actualizacion bases por meses
    //cerrando actualizacion de datos del dashboard
    let calculoVencimiento = Date.now();
    calculoVencimiento = calculoVencimiento / 1000;
    calculoVencimiento = (calculoVencimiento + 86400 * Vencimiento).toFixed(0);
    calculoVencimiento = calculoVencimiento + "000";
    fechaVencimiento = +calculoVencimiento;
    Vencimiento = new Date(fechaVencimiento);

    let año = Vencimiento.getFullYear();
    if (Vencimiento.getDate() < 10) {
      dia = `0${Vencimiento.getDate()}`;
    } else {
      dia = Vencimiento.getDate();
    }
    if (Vencimiento.getMonth() + 1 < 10) {
      mes = `0${Vencimiento.getMonth() + 1}`;
    } else {
      mes = Vencimiento.getMonth() + 1;
    }
    Vencimiento = `${año}-${mes}-${dia}`;
    //creamos 3 tareas steven
    
    //para el vendedor
    let usuarioVendedor = await usersDB.findOne({email: vendedor.email})
    if(usuarioVendedor){
        let nuevaTareaVendedor = new tareasDB({
            Timestamp: Timestamp,
            user: usuarioVendedor.email,
            TipoTarea: "Cobranza",
            Empresa: Vendedor,
            NotaEntrega: Numero,
            Nombres: vendedor.Nombres,
            Apellidos:  vendedor.Nombres,
            Documento:  vendedor.Cedula,
            TipoUsuario: "Cobranza",
            _idPersona: usuarioVendedor._id,
            FechaEntrega: Vencimiento,
            Fecha:Fecha ,
            Descripcion: `Cobranza de nota de entrega #${Numero}`,
        })
        await nuevaTareaVendedor.save()
    }
    let usuarioCliente = await usersDB.findOne({email: cliente.email})
    
    //para el cliente
    if(usuarioCliente){

        let nuevaTareaCliente = new tareasDB({
            Timestamp: Timestamp,
            user: cliente.email,
            TipoTarea: "Pago",
            Empresa: Cliente,
            Nombres: cliente.Nombres,
            Apellidos:  cliente.Apellidos,
            Documento:  cliente.RIF,
            TipoUsuario: "Cobranza",
            NotaEntrega: Numero,
            _idPersona: usuarioCliente._id,
            FechaEntrega: Vencimiento,
            Fecha:Fecha ,
            Descripcion: `Pago de nota de entrega #${Numero}`,
        })
        await nuevaTareaCliente.save()
    }
    //para el personal administraitvo que ejecuto la nota de entrega
    let nuevaTareaAdmin = new tareasDB({
        Timestamp: Timestamp,
        user: req.user.email,
        TipoTarea: "Cobranza",
        Empresa: `${req.user.Nombres} ${req.user.Apellidos}`,
        Nombres: req.user.Nombres,
        Apellidos:  req.user.Apellidos,
        Documento:  req.user.Cedula,
        NotaEntrega: Numero,
        TipoUsuario: "Administrativo",
        _idPersona: req.user._id,
        FechaEntrega: Vencimiento,
        Fecha:Fecha ,
        Descripcion: `Cobranza de nota de entrega #${Numero}`,
    })
    await nuevaTareaAdmin.save()
    if(!Orden || Orden == ""){
        let nuevaNotadeEntrega = new notasEntregaDB({
            Timestamp: Timestamp,
            Fecha: Fecha,
            Numero: Numero,
            Cliente: Cliente,
            Documento: cliente.RIF,
            Direccion: cliente.Direccion,
            Celular: `(${cliente.CodigoCeular}) ${cliente.Celular}`,
            Zona: Zona,
            Iva: Iva,
            TotalSinDescuento: TotalSinDescuento,
            Neto: BaseImponible,
            Neto2: BaseImponible,
            Comentario: Comentario,
            BaseImponible: BaseImponible,
            Descuento: Descuento,
            Saldo: PrecioTotal,
            CantidadTotal: CantidadTotalFactura,
            Vendedor: Vendedor,
            _idVendedor: vendedor._id,
            PorcentajeGanancia: Porcentaje,
            GananciasVendedor: GananciasVendedor,
            SaldoGananciasVendedor: GananciasVendedor,
            Transporte: Transporte,
            Productos: Productos,
            Vencimiento: Vencimiento
        })
    
        await nuevaNotadeEntrega.save()
    }else{
        let nuevaNotadeEntrega = new notasEntregaDB({
            Timestamp: Timestamp,
            Fecha: Fecha,
            Numero: Numero,
            Cliente: Cliente,
            Documento: cliente.RIF,
            NumeroOrden: Orden,
            Direccion: cliente.Direccion,
            Celular: `(${cliente.CodigoCeular}) ${cliente.Celular}`,
            Zona: Zona,
            Iva: Iva,
            TotalSinDescuento: TotalSinDescuento,
            Neto: BaseImponible,
            Neto2: BaseImponible,
            Comentario: Comentario,
            BaseImponible: BaseImponible,
            Descuento: Descuento,
            Saldo: PrecioTotal,
            CantidadTotal: CantidadTotalFactura,
            Vendedor: Vendedor,
            _idVendedor: vendedor._id,
            PorcentajeGanancia: Porcentaje,
            GananciasVendedor: GananciasVendedor,
            SaldoGananciasVendedor: GananciasVendedor,
            Transporte: Transporte,
            Productos: Productos,
            Vencimiento: Vencimiento
        })
    
        await nuevaNotadeEntrega.save()

    }
    let data = {
        Numero,
        Cliente
    }
    res.send(JSON.stringify(data))

})

router.get('/todas-las-notas', isAuthenticatedFacturacion, async (req, res) => {
    let notasEntregas = await notasEntregaDB.find({Estado:"Por pagar"}).sort({"Timestamp":-1})
    let cantidadTotalGenerada = 0
    let netoTotalGenerado = 0
    let saldoTotalGenerado = 0
    for(i=0; i< notasEntregas.length; i++){
        cantidadTotalGenerada += +notasEntregas[i].CantidadTotal
        netoTotalGenerado += +notasEntregas[i].Neto
        saldoTotalGenerado += +notasEntregas[i].Saldo
    }
    saldoTotalGenerado = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(saldoTotalGenerado)
    netoTotalGenerado = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotalGenerado)
    notasEntregas = notasEntregas.map((data) => {
        return{
            Timestamp: data.Timestamp,
            Vencimiento: data.Vencimiento,
            Fecha: data.Fecha,
            Numero: data.Numero,
            Factura: data.Factura,
            Cliente: data.Cliente,
            Documento: data.Documento,
            Direccion: data.Direccion,
            Celular: data.Celular,
            Zona: data.Zona,
            Neto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Neto),
            Saldo: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Saldo),
            CantidadTotal: data.CantidadTotal,
            Vendedor: data.Vendedor,
            _idVendedor: data._idVendedor,
            PorcentajeGanancia: data.PorcentajeGanancia,
            GananciasVendedor: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.GananciasVendedor),
            EstadoComision: data.EstadoComision,
            Estado: data.Estado,
            Transporte: data.Transporte,
            EstadoTarifa: data.EstadoTarifa,
            _id: data._id
        }
    })
    res.render('admin/facturacion/todas-notas-entregas',{
        notasEntregas,
        cantidadTotalGenerada,
        netoTotalGenerado,
        saldoTotalGenerado
    })
})

router.post('/solicitar-notas-por-filtro', isAuthenticatedFacturacion, async (req, res) => {
    let {Estado} = req.body
    if(Estado == "Todas"){
        let notasEntregas = await notasEntregaDB.find().sort({"Timestamp":-1})
        let cantidadTotalGenerada = 0
        let netoTotalGenerado = 0
        let saldoTotalGenerado = 0
        for(i=0; i< notasEntregas.length; i++){
            cantidadTotalGenerada += +notasEntregas[i].CantidadTotal
            netoTotalGenerado += +notasEntregas[i].Neto
            saldoTotalGenerado += +notasEntregas[i].Saldo
        }
        saldoTotalGenerado = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(saldoTotalGenerado)
        netoTotalGenerado = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotalGenerado)
        notasEntregas = notasEntregas.map((data) => {
            return{
                Timestamp: data.Timestamp,
                Fecha: data.Fecha,
                Vencimiento: data.Vencimiento,
                Numero: data.Numero,
                Factura: data.Factura,
                Cliente: data.Cliente,
                Documento: data.Documento,
                Direccion: data.Direccion,
                Celular: data.Celular,
                Zona: data.Zona,
                Neto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Neto),
                Saldo: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Saldo),
                CantidadTotal: data.CantidadTotal,
                Vendedor: data.Vendedor,
                _idVendedor: data._idVendedor,
                PorcentajeGanancia: data.PorcentajeGanancia,
                GananciasVendedor: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.GananciasVendedor),
                EstadoComision: data.EstadoComision,
                Estado: data.Estado,
                Transporte: data.Transporte,
                EstadoTarifa: data.EstadoTarifa,
                _id: data._id
            }
        })
        let data = {
            cantidadTotalGenerada,
            netoTotalGenerado,
            saldoTotalGenerado,
            notasEntregas
        }
        res.send(JSON.stringify(data))
    }else{
        let notasEntregas = await notasEntregaDB.find({Estado:Estado}).sort({"Timestamp":-1})
        let cantidadTotalGenerada = 0
        let netoTotalGenerado = 0
        let saldoTotalGenerado = 0
        for(i=0; i< notasEntregas.length; i++){
            cantidadTotalGenerada += +notasEntregas[i].CantidadTotal
            netoTotalGenerado += +notasEntregas[i].Neto
            saldoTotalGenerado += +notasEntregas[i].Saldo
        }
        saldoTotalGenerado = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(saldoTotalGenerado)
        netoTotalGenerado = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotalGenerado)
        notasEntregas = notasEntregas.map((data) => {
            return{
                Timestamp: data.Timestamp,
                Fecha: data.Fecha,
                Vencimiento: data.Vencimiento,
                Numero: data.Numero,
                Cliente: data.Cliente,
                Documento: data.Documento,
                Direccion: data.Direccion,
                Celular: data.Celular,
                Zona: data.Zona,
                Neto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Neto),
                Saldo: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Saldo),
                CantidadTotal: data.CantidadTotal,
                Vendedor: data.Vendedor,
                _idVendedor: data._idVendedor,
                PorcentajeGanancia: data.PorcentajeGanancia,
                GananciasVendedor: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.GananciasVendedor),
                EstadoComision: data.EstadoComision,
                Estado: data.Estado,
                Transporte: data.Transporte,
                EstadoTarifa: data.EstadoTarifa,
                _id: data._id
            }
        })
        let data = {
            cantidadTotalGenerada,
            netoTotalGenerado,
            saldoTotalGenerado,
            notasEntregas
        }
        res.send(JSON.stringify(data))
    }
})

router.get('/ver-nota-entrega/:id', isAuthenticatedDuroc, async (req, res) => {
    let notaEntrega = await notasEntregaDB.findOne({Numero:req.params.id})
    if(notaEntrega.Estado == "Anulada"){
        notaEntrega = {
            Timestamp: notaEntrega.Timestamp,
            Fecha: notaEntrega.Fecha,
            Anulada: "Si",
            Vencimiento: notaEntrega.Vencimiento,
            Numero: notaEntrega.Numero,
            Cliente: notaEntrega.Cliente,
            Documento: notaEntrega.Documento,
            Descuento: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(notaEntrega.Descuento),
            BaseImponible: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(notaEntrega.BaseImponible),
            Iva: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(notaEntrega.Iva),
            TotalSinDescuento: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(notaEntrega.TotalSinDescuento),
            Direccion: notaEntrega.Direccion,
            Celular: notaEntrega.Celular,
            Zona: notaEntrega.Zona,
            Neto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(notaEntrega.Neto),
            Neto2: notaEntrega.Neto2,
            Saldo: notaEntrega.Saldo,
            CantidadTotal: notaEntrega.CantidadTotal,
            Vendedor: notaEntrega.Vendedor,
            Comentario: notaEntrega.Comentario,
            _idVendedor: notaEntrega._idVendedor,
            PorcentajeGanancia: notaEntrega.PorcentajeGanancia,
            GananciasVendedor: notaEntrega.GananciasVendedor,
            EstadoComision: notaEntrega.EstadoComision,
            Estado: notaEntrega.Estado,
            Transporte: notaEntrega.Transporte,
            EstadoTarifa: notaEntrega.EstadoTarifa,
            Productos: notaEntrega.Productos.map((data) => {
                return{
                    Codigo: data.Codigo,
                    Producto: data.Producto,
                    Descripcion: data.Descripcion,
                    Cantidad: data.Cantidad,
                    PrecioUnidad: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioUnidad),
                    PrecioTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotal),
                    PrecioTotal2: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotal2),
                }
            }),
        }
    }else{
        notaEntrega = {
            Timestamp: notaEntrega.Timestamp,
            Fecha: notaEntrega.Fecha,
            Vencimiento: notaEntrega.Vencimiento,
            Numero: notaEntrega.Numero,
            Cliente: notaEntrega.Cliente,
            Documento: notaEntrega.Documento,
            Direccion: notaEntrega.Direccion,
            Celular: notaEntrega.Celular,
            Zona: notaEntrega.Zona,
            Neto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(notaEntrega.Neto),
            Descuento: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(notaEntrega.Descuento),
            BaseImponible: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(notaEntrega.BaseImponible),
            Iva: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(notaEntrega.Iva),
            TotalSinDescuento: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(notaEntrega.TotalSinDescuento),
            Neto2: notaEntrega.Neto2,
            Saldo: notaEntrega.Saldo,
            CantidadTotal: notaEntrega.CantidadTotal,
            Vendedor: notaEntrega.Vendedor,
            Comentario: notaEntrega.Comentario,
            _idVendedor: notaEntrega._idVendedor,
            PorcentajeGanancia: notaEntrega.PorcentajeGanancia,
            GananciasVendedor: notaEntrega.GananciasVendedor,
            EstadoComision: notaEntrega.EstadoComision,
            Estado: notaEntrega.Estado,
            Transporte: notaEntrega.Transporte,
            EstadoTarifa: notaEntrega.EstadoTarifa,
            Productos: notaEntrega.Productos.map((data) => {
                return{
                    Codigo: data.Codigo,
                    Producto: data.Producto,
                    Descripcion: data.Descripcion,
                    Cantidad: data.Cantidad,
                    PrecioUnidad: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioUnidad),
                    PrecioTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotal),
                    PrecioTotal2: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotal2),
                }
            }),
        }
    }
    Titulo = `Proforma ${notaEntrega.Numero} ${notaEntrega.Cliente}`
    res.render('admin/archivos_pdf/nota-entrega',{
        notaEntrega,
        Titulo,
        layout:"reportes.hbs"
    })
})


router.get('/ver-historial-facturas/:id', isAuthenticatedDuroc, async (req, res) => {
    let notaEntrega = await facturasDB.findById(req.params.id)
    let Numero = notaEntrega.Numero
    let historial = notaEntrega.HistorialPago.map((data) => {
        return{
            Pago: data.Pago,
            Comentario: data.Comentario,
            Recibo: data.Recibo,
            Modalidad: data.Modalidad,
            FechaPago: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.FechaPago),
            user: data.user,
            Timestamp: data.Timestamp,
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
        historial,
        Numero
    })
})


router.get('/ver-historial-nota-entrega/:id', isAuthenticatedDuroc, async (req, res) => {
    let notaEntrega = await notasEntregaDB.findById(req.params.id)
    let Numero = notaEntrega.Numero
    let numeroControl = notaEntrega.Control
    let numeroFactura = notaEntrega.Factura
    let NumeroOrden = notaEntrega.NumeroOrden
    let orden = ""
    let linkOrden = false
    let linkFactura = false
    if(NumeroOrden != "-"){
        orden = await ordenComprasClientesDB.findOne({Numero: NumeroOrden})
        orden = orden._id
        linkOrden = `/ver-detalles-orden-compra/${orden}`
    }
    if(numeroFactura != "-"){
        linkFactura = `ver-factura/${numeroFactura}`
    }
    let saldo = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(notaEntrega.Saldo)
    let total = 0
    for(i=0; i< notaEntrega.HistorialPago.length; i++){
        total += +notaEntrega.HistorialPago[i].Pago
    }
    total = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(total)
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

    res.render('admin/facturacion/historial-notas',{
        historial,
        numeroControl,
        linkOrden,
        linkFactura,
        total,
        numeroFactura,
        NumeroOrden,
        orden,
        saldo,
        Numero,
    })
})
router.get('/calculo-comisiones', isAuthenticatedVendedor, async (req, res) => {
    let comisiones = await calculoComisonDB.find().sort({Timestamp: -1})
    comisiones = comisiones.map((data) => {
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
    
    res.render('admin/vendedores/calculo-comisiones',{
        comisiones,
    })
})

router.post('/solicitar-comisiones-vendedores', isAuthenticatedVendedor, async (req, res) => {
    let {_id} = req.body
    let comisiones = await notasComisionesDB.find({_idVendedor: _id}).sort({"Timestamp": -1})
    comisiones = comisiones.map((data) => {
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
                Facturas: data.Facturas.map((data2) => {
                    return{
                        NotaEntrega: data2.NotaEntrega,
                        Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data2.Monto),
                    }
                }),
            }
        })
    res.send(JSON.stringify(comisiones))
})


router.get('/generar-nueva-calculo', isAuthenticatedVendedor, async (req, res) => {
    let vendedores = await vendedoresDB.find().sort({Nombres: 1, Apellidos:1})
    vendedores = vendedores.map((data) => {
        return{
            Nombres: `${data.Nombres} ${data.Apellidos}`,
            _id: data._id,
        }
    })
    res.render('admin/vendedores/generar-nuevo-calculo-comision',{
        vendedores
    })
})

router.post('/generar-nuevo-documento-comision', isAuthenticatedVendedor, async (req, res) => {
    let {Vendedor, Comision, Monto} = req.body
    if(!Vendedor || Vendedor == 0 || !Comision || Comision == 0 || Comision == 0.00 || !Monto || Monto == 0 || Monto == 0.00){
        req.flash("error", "Debe llenar todos los campos para poder generar el documento de comisión.")
        res.redirect('/generar-nueva-comision')
        return
    }
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
    let Timestamp = Date.now();
    let notaComisionGeneral = await notasComisionesDB.find().sort({"Timestamp":-1})
    let Numero = 0 
    if(notaComisionGeneral.length == 0){
        Numero = 6000000001
    }else{
        Numero = +notaComisionGeneral[0].Numero + 1
    }
    let notaComision = await notasComisionesDB.find({_idVendedor: Vendedor}).sort({"Timestamp":-1})
    let vendedor = await vendedoresDB.findById(Vendedor)
    let notasEntrega = await notasEntregaDB.find({$and: [{Estado: "Cerrada"}, {EstadoComision:"Por pagar"}, 
    {_idVendedor:Vendedor}]})
    let CantidadTotalDocumentos = 0
    let ValorTotal = 0
    let facturas = []
    if(notaComision.length >0){
        if(notaComision[0].Pendiente > 0){
            ValorTotal += +notaComision[0].Pendiente 
            CantidadTotalDocumentos++
            let data = {
                NotaEntrega: `Nota de comisión #${notaComision[0].Numero}`, 
                Monto: notaComision[0].Pendiente
            }
            facturas.push(data)
        }
    }
    for(i=0; i< notasEntrega.length; i++){
        CantidadTotalDocumentos++
        ValorTotal += +notasEntrega[i].GananciasVendedor 
        let data = {
            NotaEntrega: `Nota de entrega #${notasEntrega[i].Numero}`,
            Monto: notasEntrega[i].GananciasVendedor,
        }
        facturas.push(data)
        await notasEntregaDB.findByIdAndUpdate(notasEntrega[i]._id,{
            EstadoComision: "Cerrada"
        })
    }
    ValorTotal = ValorTotal.toFixed(2)
    let Pendiente = (+ValorTotal - +Monto).toFixed(2)
    let nuevaNotaComision = new notasComisionesDB({
        Numero: Numero,
        Timestamp: Timestamp,
        Fecha: Fecha,
        Vendedor: `${vendedor.Nombres} ${vendedor.Apellidos}`,
        _idVendedor: vendedor._id,
        CantidadTotalDocumentos: CantidadTotalDocumentos,
        MontoCancelado: Monto,
        ValorTotal: ValorTotal,
        Pendiente: Pendiente,
        Facturas: facturas,
    })
    await nuevaNotaComision.save()
    res.redirect(`/nota-comision/${Numero}`)
})

router.get('/nota-comision/:id', isAuthenticatedDuroc,async (req, res) => {
    let notaComision = await notasComisionesDB.findOne({Numero: req.params.id})
    notaComision = {
        Numero: notaComision.Numero,
        Timestamp: notaComision.Timestamp,
        Fecha: notaComision.Fecha,
        Vendedor: notaComision.Vendedor,
        _idVendedor: notaComision._idVendedor,
        CantidadTotalDocumentos: notaComision.CantidadTotalDocumentos,
        MontoCancelado: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(notaComision.MontoCancelado),
        ValorTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(notaComision.ValorTotal),
        Pendiente: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(notaComision.Pendiente),
        Facturas: notaComision.Facturas.map((data)=> {
            return{
                NotaEntrega: data.NotaEntrega,
                Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Monto)
            }
            
        }),
    }
    res.render('admin/archivos_pdf/nota-comisiones',{
        notaComision,
        layout:"reportes.hbs"
    })
})


router.post('/solicitar-monto-comisiones', isAuthenticatedVendedor, async (req, res) => {
    let {_id} = req.body
    let notasEntrega = await notasEntregaDB.find({$and: [{Estado: "Cerrada"}, {EstadoComision:"Por pagar"}, 
    {_idVendedor:_id}]})
    let notaComision = await notasComisionesDB.find({_idVendedor: _id}).sort({"Timestamp":-1})
    let comisiones = 0
    for(i=0; i< notasEntrega.length; i++){
        comisiones += +notasEntrega[i].GananciasVendedor
    }
    if(notaComision.length> 0){
        comisiones += +notaComision[0].Pendiente
    }
    comisiones = comisiones.toFixed(2)
    res.send(JSON.stringify(comisiones))
})


router.post('/solicitar-info-comisiones', isAuthenticatedVendedor, async (req, res) => {
    let {_idVendedor} = req.body
    let comisiones = await comisionesDB.find({$and: [{_idVendedor: _idVendedor}, {Estado: "Pendiente"}]}).sort({"Timestamp":-1})
    res.send(JSON.stringify(comisiones))
})

router.post('/solicitar-info-comisiones-monto', isAuthenticatedVendedor, async (req, res) => {
    let {Factura} = req.body
    let comision = await comisionesDB.findOne({NumeroFactura: Factura})
    let Monto = comision.SaldoComision
    res.send(JSON.stringify(Monto))
})





router.get('/reporte-ventas', isAuthenticatedVendedor, async (req, res) => {
    let vendedores = await vendedoresDB.find().sort({"Nombres": -1})
    vendedores = vendedores.map((data) => {
        return{
            Nombres: data.Nombres,
            Apellidos: data.Apellidos,
            _id: data._id,
        }
    })
    res.render('admin/vendedores/reporte-vendedores',{
        vendedores
    })
})

router.post('/generar-reporte-vendedores', isAuthenticatedVendedor, async (req, res) =>{
    let {Vendedor, Hasta, Desde} = req.body
    if(!Hasta){
        let facturasNotas = []
        if(Vendedor == 0){
            let cantidadTotalGeneral = 0
            let netoTotalGeneral = 0
            let saldoTotalGeneral = 0
            let facturas = await facturasDB.find({}).sort({"Timestamp":-1})
            let notasEntregas = await notasEntregaDB.find({}).sort({"Timestamp":-1})
            for(i=0; i< facturas.length; i++){
                cantidadTotalGeneral += facturas[i].CantidadTotal
                netoTotalGeneral += facturas[i].Neto
                saldoTotalGeneral += facturas[i].Saldo
                facturasNotas.push(facturas[i])
            }
            for(i=0; i< notasEntregas.length; i++){
                cantidadTotalGeneral += notasEntregas[i].CantidadTotal
                netoTotalGeneral += notasEntregas[i].Neto
                saldoTotalGeneral += notasEntregas[i].Saldo
                facturasNotas.push(notasEntregas[i])
            }
            let vendedores = await vendedoresDB.find().sort({"Nombre":1})
            let todosVendedores = []
            for(i=0; i< vendedores.length; i++){
                let validacion = facturasNotas.filter((data) => data._idVendedor == vendedores[i]._id)
                if(validacion.length > 0){
                    let netoTotal = 0
                    let SaldoTotal = 0
                    let CantidadTotal = 0
                    for(r=0; r< validacion.length; r++){
                        netoTotal += +validacion[r].Neto
                        SaldoTotal += +validacion[r].Saldo
                        CantidadTotal += +validacion[r].CantidadTotal
                    }
                    let data = {
                        Vendedor: `${vendedores[i].Nombres} ${vendedores[i].Apellidos}`,
                        netoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotal),
                        SaldoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(SaldoTotal),
                        CantidadTotal: CantidadTotal,
                        facturas: validacion.map((data) => {
                            return{
                                Timestamp: data.Timestamp,
                                Fecha: data.Fecha,
                                Vencimiento: data.Vencimiento,
                                Numero: data.Numero,
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
                                EstadoComision: data.EstadoComision,
                                Estado: data.Estado,
                                Transporte: data.Transporte,
                                EstadoTarifa: data.EstadoTarifa,
                                Productos: data.Productos,
                            }
                        })
                    }
                    todosVendedores.push(data)
                }
            }
            let Titulo = `Reporte de ventas - Todos los vendedores`
            res.render('admin/archivos_pdf/reporte_vendedores',{
                todosVendedores,
                Titulo,
                cantidadTotalGeneral,
                netoTotalGeneral: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotalGeneral),
                saldoTotalGeneral :new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(saldoTotalGeneral),
                layout:"reportes.hbs"
            })
        }else{
            let cantidadTotalGeneral = 0
            let netoTotalGeneral = 0
            let saldoTotalGeneral = 0
            let facturas = await facturasDB.find({_idVendedor:Vendedor}).sort({"Timestamp":-1})
            let notasEntregas = await notasEntregaDB.find({_idVendedor:Vendedor}).sort({"Timestamp":-1})
            for(i=0; i< facturas.length; i++){
                cantidadTotalGeneral += facturas[i].CantidadTotal
                netoTotalGeneral += facturas[i].Neto
                saldoTotalGeneral += facturas[i].Saldo
                facturasNotas.push(facturas[i])
            }
            for(i=0; i< notasEntregas.length; i++){
                cantidadTotalGeneral += notasEntregas[i].CantidadTotal
                netoTotalGeneral += notasEntregas[i].Neto
                saldoTotalGeneral += notasEntregas[i].Saldo
                facturasNotas.push(notasEntregas[i])
            }
            let netoTotal = 0
            let SaldoTotal = 0
            let CantidadTotal = 0
            for(r=0; r< facturasNotas.length; r++){
                netoTotal += +facturasNotas[r].Neto
                SaldoTotal += +facturasNotas[r].Saldo
                CantidadTotal += +facturasNotas[r].CantidadTotal
            }
            let vendedor = await vendedoresDB.findById(Vendedor)
            let todosVendedores = []
            let data = {
                Vendedor: `${vendedor.Nombres} ${vendedor.Apellidos}`,
                netoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotal),
                SaldoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(SaldoTotal),
                CantidadTotal: CantidadTotal,
                facturas: facturasNotas.map((data) => {
                    return{
                        Timestamp: data.Timestamp,
                        Fecha: data.Fecha,
                        Vencimiento: data.Vencimiento,
                        Numero: data.Numero,
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
                        EstadoComision: data.EstadoComision,
                        Estado: data.Estado,
                        Transporte: data.Transporte,
                        EstadoTarifa: data.EstadoTarifa,
                        Productos: data.Productos,
                    }
                })
            }
            todosVendedores.push(data)
            let Titulo = `Reporte de ventas ${data.Vendedor}`
            res.render('admin/archivos_pdf/reporte_vendedores',{
                todosVendedores,
                Titulo,
                cantidadTotalGeneral,
                netoTotalGeneral: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotalGeneral),
                saldoTotalGeneral :new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(saldoTotalGeneral),
                layout:"reportes.hbs"

            })
        }
    }else{
        let fechaDesde = new Date(Desde).getTime();
        let fechaHasta = new Date(Hasta).getTime();
        let facturasNotas = []
        if(Vendedor == 0){
            let cantidadTotalGeneral = 0
            let netoTotalGeneral = 0
            let saldoTotalGeneral = 0
            let facturas = await facturasDB.find({$and: [{ Timestamp:{$gte: fechaDesde}},{Timestamp:{$lte: fechaHasta}}]}).sort({"Timestamp":-1})
            let notasEntregas = await notasEntregaDB.find({$and: [{Timestamp:{$gte: fechaDesde}},{Timestamp:{$lte: fechaHasta}}]}).sort({"Timestamp":-1})
            for(i=0; i< facturas.length; i++){
                cantidadTotalGeneral += facturas[i].CantidadTotal
                netoTotalGeneral += facturas[i].Neto
                saldoTotalGeneral += facturas[i].Saldo
                facturasNotas.push(facturas[i])
            }
            for(i=0; i< notasEntregas.length; i++){
                cantidadTotalGeneral += notasEntregas[i].CantidadTotal
                netoTotalGeneral += notasEntregas[i].Neto
                saldoTotalGeneral += notasEntregas[i].Saldo
                facturasNotas.push(notasEntregas[i])
            }
            let vendedores = await vendedoresDB.find().sort({"Nombre":1})
            let todosVendedores = []
            for(i=0; i< vendedores.length; i++){
                let validacion = facturasNotas.filter((data) => data._idVendedor == vendedores[i]._id)
                if(validacion.length > 0){
                    let netoTotal = 0
                    let SaldoTotal = 0
                    let CantidadTotal = 0
                    for(r=0; r< validacion.length; r++){
                        netoTotal += +validacion[r].Neto
                        SaldoTotal += +validacion[r].Saldo
                        CantidadTotal += +validacion[r].CantidadTotal
                    }
                    let data = {
                        Vendedor: `${vendedores[i].Nombres} ${vendedores[i].Apellidos}`,
                        netoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotal),
                        SaldoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(SaldoTotal),
                        CantidadTotal: CantidadTotal,
                        facturas: validacion.map((data) => {
                            return{
                                Timestamp: data.Timestamp,
                                Fecha: data.Fecha,
                                Vencimiento: data.Vencimiento,
                                Numero: data.Numero,
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
                                EstadoComision: data.EstadoComision,
                                Estado: data.Estado,
                                Transporte: data.Transporte,
                                EstadoTarifa: data.EstadoTarifa,
                                Productos: data.Productos,
                            }
                        })
                    }
                    todosVendedores.push(data)
                }
            }
            let Titulo = `Reporte de ventas - Todos los vendedores`
            res.render('admin/archivos_pdf/reporte_vendedores',{
                todosVendedores,
                Titulo,
                cantidadTotalGeneral,
                netoTotalGeneral: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotalGeneral),
                saldoTotalGeneral :new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(saldoTotalGeneral),
                layout:"reportes.hbs"

            })
        }else{
            let cantidadTotalGeneral = 0
            let netoTotalGeneral = 0
            let saldoTotalGeneral = 0
            let facturas = await facturasDB.find({$and: [{Timestamp:{$gte: fechaDesde}},{Timestamp:{$lte: fechaHasta}},{_idVendedor:Vendedor}]}).sort({"Timestamp":-1})
            let notasEntregas = await notasEntregaDB.find({$and: [{Timestamp:{$gte: fechaDesde}},{Timestamp:{$lte: fechaHasta}},{_idVendedor:Vendedor}]}).sort({"Timestamp":-1})
            for(i=0; i< facturas.length; i++){
                cantidadTotalGeneral += facturas[i].CantidadTotal
                netoTotalGeneral += facturas[i].Neto
                saldoTotalGeneral += facturas[i].Saldo
                facturasNotas.push(facturas[i])
            }
            for(i=0; i< notasEntregas.length; i++){
                cantidadTotalGeneral += notasEntregas[i].CantidadTotal
                netoTotalGeneral += notasEntregas[i].Neto
                saldoTotalGeneral += notasEntregas[i].Saldo
                facturasNotas.push(notasEntregas[i])
            }
            let netoTotal = 0
            let SaldoTotal = 0
            let CantidadTotal = 0
            for(r=0; r< facturasNotas.length; r++){
                netoTotal += +facturasNotas[r].Neto
                SaldoTotal += +facturasNotas[r].Saldo
                CantidadTotal += +facturasNotas[r].CantidadTotal
            }

            let vendedor = await vendedoresDB.findById(Vendedor)
            let todosVendedores = []
            let data = {
                Vendedor: `${vendedor.Nombres} ${vendedor.Apellidos}`,
                netoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotal),
                SaldoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(SaldoTotal),
                CantidadTotal: CantidadTotal,
                facturas: facturasNotas.map((data) => {
                    return{
                        Timestamp: data.Timestamp,
                        Fecha: data.Fecha,
                        Vencimiento: data.Vencimiento,
                        Numero: data.Numero,
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
                        EstadoComision: data.EstadoComision,
                        Estado: data.Estado,
                        Transporte: data.Transporte,
                        EstadoTarifa: data.EstadoTarifa,
                        Productos: data.Productos,
                    }
                })
            }
            todosVendedores.push(data)

            let Titulo = `Reporte de ventas ${data.Vendedor}`
            res.render('admin/archivos_pdf/reporte_vendedores',{
                todosVendedores,
                Titulo,
                cantidadTotalGeneral,
                netoTotalGeneral: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotalGeneral),
                saldoTotalGeneral :new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(saldoTotalGeneral),
                layout:"reportes.hbs"

            })
        }
    }
})


router.get('/reporte-compras', isAuthenticatedCliente, async (req, res) => {
    let clientes = await clientesDB.find().sort({"Empresa": -1})
    clientes = clientes.map((data) => {
        return{
            Empresa: data.Empresa,
            _id: data._id,
        }
    })
    res.render('admin/clientes/reporte_compras',{
        clientes
    })
})

router.post('/generar-reporte-clientes', isAuthenticatedCliente, async (req, res) =>{
    let {Cliente, Hasta, Desde} = req.body
    if(!Hasta){
        let facturasNotas = []
        if(Cliente == 0){
            let cantidadTotalGeneral = 0
            let netoTotalGeneral = 0
            let saldoTotalGeneral = 0
            let facturas = await facturasDB.find({}).sort({"Timestamp":-1})
            let notasEntregas = await notasEntregaDB.find({}).sort({"Timestamp":-1})
            for(i=0; i< facturas.length; i++){
                cantidadTotalGeneral += facturas[i].CantidadTotal
                netoTotalGeneral += facturas[i].Neto
                saldoTotalGeneral += facturas[i].Saldo
                facturasNotas.push(facturas[i])
            }
            for(i=0; i< notasEntregas.length; i++){
                cantidadTotalGeneral += notasEntregas[i].CantidadTotal
                netoTotalGeneral += notasEntregas[i].Neto
                saldoTotalGeneral += notasEntregas[i].Saldo
                facturasNotas.push(notasEntregas[i])
            }
            let clientes = await clientesDB.find().sort({"Empresa":1})
            let todosVendedores = []
            for(i=0; i< clientes.length; i++){
                let validacion = facturasNotas.filter((data) => data.Cliente == clientes[i].Empresa)
                if(validacion.length > 0){
                    let netoTotal = 0
                    let SaldoTotal = 0
                    let CantidadTotal = 0
                    for(r=0; r< validacion.length; r++){
                        netoTotal += +validacion[r].Neto
                        SaldoTotal += +validacion[r].Saldo
                        CantidadTotal += +validacion[r].CantidadTotal
                    }
                    let data = {
                        Vendedor: `${clientes[i].Empresa}`,
                        netoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotal),
                        SaldoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(SaldoTotal),
                        CantidadTotal: CantidadTotal,
                        facturas: validacion.map((data) => {
                            return{
                                Timestamp: data.Timestamp,
                                Fecha: data.Fecha,
                                Vencimiento: data.Vencimiento,
                                Numero: data.Numero,
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
                                EstadoComision: data.EstadoComision,
                                Estado: data.Estado,
                                Transporte: data.Transporte,
                                EstadoTarifa: data.EstadoTarifa,
                                Productos: data.Productos,
                            }
                        })
                    }
                    todosVendedores.push(data)
                }
            }
            let Titulo = `Reporte de compras - Todos los clientes`
            res.render('admin/archivos_pdf/reporte_vendedores',{
                todosVendedores,
                Titulo,
                cantidadTotalGeneral,
                netoTotalGeneral: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotalGeneral),
                saldoTotalGeneral :new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(saldoTotalGeneral),
                layout:"reportes.hbs"
            })
        }else{
            let cantidadTotalGeneral = 0
            let netoTotalGeneral = 0
            let saldoTotalGeneral = 0
            let facturas = await facturasDB.find({Cliente:Cliente}).sort({"Timestamp":-1})
            let notasEntregas = await notasEntregaDB.find({Cliente:Cliente}).sort({"Timestamp":-1})
            for(i=0; i< facturas.length; i++){
                cantidadTotalGeneral += facturas[i].CantidadTotal
                netoTotalGeneral += facturas[i].Neto
                saldoTotalGeneral += facturas[i].Saldo
                facturasNotas.push(facturas[i])
            }
            for(i=0; i< notasEntregas.length; i++){
                cantidadTotalGeneral += notasEntregas[i].CantidadTotal
                netoTotalGeneral += notasEntregas[i].Neto
                saldoTotalGeneral += notasEntregas[i].Saldo
                facturasNotas.push(notasEntregas[i])
            }
            let netoTotal = 0
            let SaldoTotal = 0
            let CantidadTotal = 0
            for(r=0; r< facturasNotas.length; r++){
                netoTotal += +facturasNotas[r].Neto
                SaldoTotal += +facturasNotas[r].Saldo
                CantidadTotal += +facturasNotas[r].CantidadTotal
            }
            let cliente = await clientesDB.findOne({Empresa: Cliente})
            let todosVendedores = []
            let data = {
                Vendedor: `${cliente.Empresa}`,
                netoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotal),
                SaldoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(SaldoTotal),
                CantidadTotal: CantidadTotal,
                facturas: facturasNotas.map((data) => {
                    return{
                        Timestamp: data.Timestamp,
                        Fecha: data.Fecha,
                        Vencimiento: data.Vencimiento,
                        Numero: data.Numero,
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
                        EstadoComision: data.EstadoComision,
                        Estado: data.Estado,
                        Transporte: data.Transporte,
                        EstadoTarifa: data.EstadoTarifa,
                        Productos: data.Productos,
                    }
                })
            }
            todosVendedores.push(data)
            let Titulo = `Reporte de compras ${data.Vendedor}`
            res.render('admin/archivos_pdf/reporte_vendedores',{
                todosVendedores,
                Titulo,
                cantidadTotalGeneral,
                netoTotalGeneral: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotalGeneral),
                saldoTotalGeneral :new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(saldoTotalGeneral),
                layout:"reportes.hbs"

            })
        }
    }else{
        let fechaDesde = new Date(Desde).getTime();
        let fechaHasta = new Date(Hasta).getTime();
        let facturasNotas = []
        if(Cliente == 0){
            let cantidadTotalGeneral = 0
            let netoTotalGeneral = 0
            let saldoTotalGeneral = 0
            let facturas = await facturasDB.find({$and: [{ Timestamp:{$gte: fechaDesde}},{Timestamp:{$lte: fechaHasta}}]}).sort({"Timestamp":-1})
            let notasEntregas = await notasEntregaDB.find({$and: [{Timestamp:{$gte: fechaDesde}},{Timestamp:{$lte: fechaHasta}}]}).sort({"Timestamp":-1})
            for(i=0; i< facturas.length; i++){
                cantidadTotalGeneral += facturas[i].CantidadTotal
                netoTotalGeneral += facturas[i].Neto
                saldoTotalGeneral += facturas[i].Saldo
                facturasNotas.push(facturas[i])
            }
            for(i=0; i< notasEntregas.length; i++){
                cantidadTotalGeneral += notasEntregas[i].CantidadTotal
                netoTotalGeneral += notasEntregas[i].Neto
                saldoTotalGeneral += notasEntregas[i].Saldo
                facturasNotas.push(notasEntregas[i])
            }
            let clientes = await clientesDB.find().sort({"Empresa":1})
            let todosVendedores = []
            for(i=0; i< clientes.length; i++){
                let validacion = facturasNotas.filter((data) => data.Cliente == clientes[i].Empresa)
                if(validacion.length > 0){
                    let netoTotal = 0
                    let SaldoTotal = 0
                    let CantidadTotal = 0
                    for(r=0; r< validacion.length; r++){
                        netoTotal += +validacion[r].Neto
                        SaldoTotal += +validacion[r].Saldo
                        CantidadTotal += +validacion[r].CantidadTotal
                    }
                    let data = {
                        Vendedor: `${clientes[i].Empresa}`,
                        netoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotal),
                        SaldoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(SaldoTotal),
                        CantidadTotal: CantidadTotal,
                        facturas: validacion.map((data) => {
                            return{
                                Timestamp: data.Timestamp,
                                Fecha: data.Fecha,
                                Vencimiento: data.Vencimiento,
                                Numero: data.Numero,
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
                                EstadoComision: data.EstadoComision,
                                Estado: data.Estado,
                                Transporte: data.Transporte,
                                EstadoTarifa: data.EstadoTarifa,
                                Productos: data.Productos,
                            }
                        })
                    }
                    todosVendedores.push(data)
                }
            }
            let Titulo = `Reporte de compras - Todos los clientes`
            res.render('admin/archivos_pdf/reporte_vendedores',{
                todosVendedores,
                Titulo,
                cantidadTotalGeneral,
                netoTotalGeneral: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotalGeneral),
                saldoTotalGeneral :new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(saldoTotalGeneral),
                layout:"reportes.hbs"

            })
        }else{
            let cantidadTotalGeneral = 0
            let netoTotalGeneral = 0
            let saldoTotalGeneral = 0
            let facturas = await facturasDB.find({$and: [{Timestamp:{$gte: fechaDesde}},{Timestamp:{$lte: fechaHasta}},{Cliente:Cliente}]}).sort({"Timestamp":-1})
            let notasEntregas = await notasEntregaDB.find({$and: [{Timestamp:{$gte: fechaDesde}},{Timestamp:{$lte: fechaHasta}},{Cliente:Cliente}]}).sort({"Timestamp":-1})
            for(i=0; i< facturas.length; i++){
                cantidadTotalGeneral += facturas[i].CantidadTotal
                netoTotalGeneral += facturas[i].Neto
                saldoTotalGeneral += facturas[i].Saldo
                facturasNotas.push(facturas[i])
            }
            for(i=0; i< notasEntregas.length; i++){
                cantidadTotalGeneral += notasEntregas[i].CantidadTotal
                netoTotalGeneral += notasEntregas[i].Neto
                saldoTotalGeneral += notasEntregas[i].Saldo
                facturasNotas.push(notasEntregas[i])
            }
            let netoTotal = 0
            let SaldoTotal = 0
            let CantidadTotal = 0
            for(r=0; r< facturasNotas.length; r++){
                netoTotal += +facturasNotas[r].Neto
                SaldoTotal += +facturasNotas[r].Saldo
                CantidadTotal += +facturasNotas[r].CantidadTotal
            }

            let cliente = await clientesDB.findOne({Empresa: Cliente})
            let todosVendedores = []
            let data = {
                Vendedor: `${cliente.Empresa}`,
                netoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotal),
                SaldoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(SaldoTotal),
                CantidadTotal: CantidadTotal,
                facturas: facturasNotas.map((data) => {
                    return{
                        Timestamp: data.Timestamp,
                        Fecha: data.Fecha,
                        Vencimiento: data.Vencimiento,
                        Numero: data.Numero,
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
                        EstadoComision: data.EstadoComision,
                        Estado: data.Estado,
                        Transporte: data.Transporte,
                        EstadoTarifa: data.EstadoTarifa,
                        Productos: data.Productos,
                    }
                })
            }
            todosVendedores.push(data)
            let Titulo = `Reporte de compras ${data.Vendedor}`
            res.render('admin/archivos_pdf/reporte_vendedores',{
                todosVendedores,
                Titulo,
                cantidadTotalGeneral,
                netoTotalGeneral: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotalGeneral),
                saldoTotalGeneral :new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(saldoTotalGeneral),
                layout:"reportes.hbs"

            })
        }
    }
})


router.get('/indicadores', isAuthenticatedEstadisticas, async (req, res) =>{
    let ventasBaterias = await ventasBateriasGeneralDB.find() 
    let ventasBujes = await  ventasBujesGeneralDB.find()
    let ventasAmortiguadores = await ventasAmortiguadoresGeneralDB.find()
    let ventasBombas = await ventasBombasGeneralDB.find()
    let ventasGenerales = await ventasGeneralDB.find()
    let utilidadesGenerales = await utilidadesGeneralDB.find()
    let ventasBases = await ventasBasesGeneralDB.find()
    let ventasGuardapolvo = await ventasGuardapolvoGeneralDB.find()
    let ventasValvulas = await ventasValvulasGeneralDB.find()
    let ventasBujias = await ventasBujiasGeneralDB.find()

    if(ventasBujias.length > 0){
        ventasBujias = {
            CantidadTotal: ventasBujias[0].CantidadTotal,
            MontoTotal: new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(ventasBujias[0].MontoTotal),
            UtilidadesTotales: new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(ventasBujias[0].UtilidadesTotales)
        }
    }
    if(ventasBases.length > 0){
        ventasBases = {
            CantidadTotal: ventasBases[0].CantidadTotal,
            MontoTotal: new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(ventasBases[0].MontoTotal),
            UtilidadesTotales: new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(ventasBases[0].UtilidadesTotales)
        }
    }
    if(ventasGuardapolvo.length > 0){
        ventasGuardapolvo = {
            CantidadTotal: ventasGuardapolvo[0].CantidadTotal,
            MontoTotal: new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(ventasGuardapolvo[0].MontoTotal),
            UtilidadesTotales: new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(ventasGuardapolvo[0].UtilidadesTotales)
        }
    }
    if(ventasValvulas.length > 0){
        ventasValvulas = {
            CantidadTotal: ventasValvulas[0].CantidadTotal,
            MontoTotal: new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(ventasValvulas[0].MontoTotal),
            UtilidadesTotales: new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(ventasValvulas[0].UtilidadesTotales)
        }
    }

    if(ventasGenerales.length > 0){

        ventasGenerales = {
            CantidadTotal: ventasGenerales[0].CantidadTotal, 
            MontoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(ventasGenerales[0].MontoTotal), 
            UtilidadesTotales: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(ventasGenerales[0].UtilidadesTotales), 
        }
    }
    if(utilidadesGenerales.length > 0){

        utilidadesGenerales = {
            CantidadTotal: utilidadesGenerales[0].CantidadTotal,
            MontoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(utilidadesGenerales[0].MontoTotal),
            UtilidadesTotales: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(utilidadesGenerales[0].UtilidadesTotales),
        }
    }
    if(ventasBaterias.length > 0){
        ventasBaterias = {
            CantidadTotal: ventasBaterias[0].CantidadTotal,
            MontoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(ventasBaterias[0].MontoTotal),
            UtilidadesTotales: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(ventasBaterias[0].UtilidadesTotales)
        }
    }
    if(ventasBujes.length > 0){
        ventasBujes = {
            CantidadTotal: ventasBujes[0].CantidadTotal,
            MontoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(ventasBujes[0].MontoTotal),
            UtilidadesTotales: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(ventasBujes[0].UtilidadesTotales)
        }
    }
    if(ventasAmortiguadores.length > 0){

        ventasAmortiguadores = {
            CantidadTotal: ventasAmortiguadores[0].CantidadTotal,
            MontoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(ventasAmortiguadores[0].MontoTotal),
            UtilidadesTotales: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(ventasAmortiguadores[0].UtilidadesTotales)
        }
    }
    if(ventasBombas.length > 0){
        ventasBombas = {
            CantidadTotal: ventasBombas[0].CantidadTotal,
            MontoTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(ventasBombas[0].MontoTotal),
            UtilidadesTotales: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(ventasBombas[0].UtilidadesTotales)
        }
    }

    res.render('admin/estadisticas',{
        ventasBaterias,
        ventasGenerales,
        utilidadesGenerales,
        ventasBujias,
        ventasBujes,
        ventasAmortiguadores,
        ventasBases,
        ventasGuardapolvo,
        ventasValvulas,
        ventasBombas,
    })
})

router.get('/calificacion-vendedores', isAuthenticatedVendedor, async (req, res) => {
    let calificaciones = await calificacionDB.find({TipoUsuario: "Vendedor"})
    let vendedores = await vendedoresDB.find()
    for(i=0; i<vendedores.length; i++){
        let validacion = calificaciones.find((data) => data._idPersona == vendedores[i]._id)
        if(!validacion){
            let nuevaCalificacion = new calificacionDB({
                user: vendedores[i].email ,
                Nombres: vendedores[i].Nombres ,
                Apellidos: vendedores[i].Apellidos ,
                Documento: vendedores[i].Cedula ,
                TipoUsuario: "Vendedor",
                _idPersona: vendedores[i]._id ,
            })
            await nuevaCalificacion.save()
        }
    }
    calificaciones = await calificacionDB.find({TipoUsuario: "Vendedor"}).sort({"CalificacionActual": -1})
    calificaciones = calificaciones.map((data) => {
        return{
            user: data.user,
            Nombres: data.Nombres,
            Apellidos: data.Apellidos,
            Documento: data.Documento,
            TipoUsuario: data.TipoUsuario,
            _idPersona: data._idPersona,
            CalificacionActual: data.CalificacionActual,
            _id: data._id,
        }
    })
    res.render('admin/vendedores/calificacion',{
        calificaciones
    })
})

router.get('/ver-historial-calificaciones/:id', isAuthenticatedDuroc, async (req, res) => {
    let calificacion = await calificacionDB.findById(req.params.id)
    let nombres = `${calificacion.Nombres} ${calificacion.Apellidos}`
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
    res.render('admin/vendedores/ver-historial-calificaciones',{
        historiaCalificaciones,
        _id : req.params.id,
        nombres
    })

})

router.post('/solicitar-info-grafica/:id', isAuthenticatedDuroc,async (req, res) => {
    let fechas = []
    let puntos = []
    let calificacion = await calificacionDB.findById(req.params.id)
    let historiaCalificaciones = calificacion.HistorialCalificaciones
    historiaCalificaciones.sort(function (a, b) {
        if (+a.Timestamp > +b.Timestamp) {
          return 1;
        }
        if (+a.Timestamp < +b.Timestamp) {
          return -1;
        }
        return 0;
    });
    for(i=0; i< historiaCalificaciones.length; i++){
        fechas.push(historiaCalificaciones[i].Fecha)
        puntos.push(historiaCalificaciones[i].Calificacion)
    }
    let data = {
        fechas,
        puntos
    }
    res.send(JSON.stringify(data))


})

router.get('/ver-tareas/:id', isAuthenticatedDuroc, async (req, res) => {
    let tareas = await tareasDB.find({_idPersona: req.params.id})
    let Nombres = "No hay tareas asigandas"
    let _idPersona = req.params.id
    if(tareas.length > 0){
        Nombres = `Tareas de ${tareas[0].Nombres} ${tareas[0].Apellidos}`
    }
    tareas = tareas.map((data) => {
        return{
            user: data.user,
            Nombres: data.Nombres,
            Apellidos: data.Apellidos,
            Documento: data.Documento,
            TipoUsuario: data.TipoUsuario,
            _idPersona: data._idPersona,
            FechaEntrega: data.FechaEntrega,
            Fecha: data.Fecha,
            FechaPospuesta: data.FechaPospuesta,
            Estado: data.Estado,
            Descripcion: data.Descripcion,
            _id: data._id,
        }
    })
    res.render('admin/vendedores/ver-tareas',{
        Nombres,
        _idPersona,
        tareas
    })
})


router.get('/calificacion-clientes', isAuthenticatedCliente, async (req, res) => {
    let calificaciones = await calificacionDB.find({TipoUsuario: "Cliente"})
    let clientes = await clientesDB.find()
    for(i=0; i<clientes.length; i++){
        let validacion = calificaciones.find((data) => data._idPersona == clientes[i]._id)
        if(!validacion){
            let nuevaCalificacion = new calificacionDB({
                user: clientes[i].email ,
                Nombres: clientes[i].Nombres ,
                Apellidos: clientes[i].Apellidos ,
                Empresa: clientes[i].Empresa ,
                Documento: clientes[i].RIF ,
                TipoUsuario: "Cliente",
                _idPersona: clientes[i]._id ,
            })
            await nuevaCalificacion.save()
        }
    }
    calificaciones = await calificacionDB.find({TipoUsuario: "Cliente"}).sort({"CalificacionActual": -1})
    calificaciones = calificaciones.map((data) => {
        return{
            user: data.user,
            Empresa: data.Empresa,
            Nombres: data.Nombres,
            Apellidos: data.Apellidos,
            Documento: data.Documento,
            TipoUsuario: data.TipoUsuario,
            _idPersona: data._idPersona,
            CalificacionActual: data.CalificacionActual,
            _id: data._id,
        }
    })
    res.render('admin/clientes/calificacion',{
        calificaciones
    })
})



router.get('/ver-historial-calificaciones-clientes/:id', isAuthenticatedCliente, async (req, res) => {
    let calificacion = await calificacionDB.findById(req.params.id)
    let nombres = `${calificacion.Empresa}`
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
    res.render('admin/vendedores/ver-historial-calificaciones',{
        historiaCalificaciones,
        _id : req.params.id,
        nombres
    })

})

router.get('/manager-tareas', isAuthenticatedTareas, async (req, res) => {
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
    let tareas = await tareasDB.find({Estado:"Pendiente"}).sort({"Timestamp":-1})
    tareas = tareas.map((data) => {
        if(data.FechaEntrega < Fecha){
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
                _id: data._id,
                Class: "text-danger"
            }
        }
        else{
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
                _id: data._id,
                Class: "text-dark"
            }

        }
    })
    res.render('admin/manager-tareas',{
        tareas
    })
})

router.get('/crear-nueva-tarea', isAuthenticatedTareas, async (req, res) => {
    res.render('admin/nueva-tarea')
})

router.post('/solicitar-usuarios', isAuthenticatedDuroc, async (req, res) => {
    let {TipoUsuario} = req.body
    let Usuario = [] 
    if(TipoUsuario == "Admin"){
        let usuario = await usersDB.find({"TipoUsuario": "Administrador"}).sort({"Nombres":1})
        for(i=0; i< usuario.length; i++){
            let data = {
                Nombres: `${usuario[i].Nombres} ${usuario[i].Apellidos}`,
                _id: usuario[i]._id
            }
            Usuario.push(data)
        }
    }
    if(TipoUsuario == "Cliente"){
        let clientes = await clientesDB.find().sort({"Empresa": 1})
        for(i=0; i< clientes.length; i++){
            let data= {
                Nombres: clientes[i].Empresa,
                _id: clientes[i]._id,
            }
            Usuario.push(data)
        }
    }
    if(TipoUsuario == "Vendedor"){
        let vendedores = await vendedoresDB.find().sort({"Nombres": 1})
        for(i=0; i< vendedores.length; i++){
            let data = {
                Nombres: `${vendedores[i].Nombres} ${vendedores[i].Apellidos}`,
                _id: vendedores[i]._id
            }
            Usuario.push(data)
        }
    }
    res.send(JSON.stringify(Usuario))
})

router.post('/nueva-tarea', isAuthenticatedTareas, async (req, res) =>{
    let {TipoUsuario, Usuario, FechaEstimada, Descripcion} = req.body
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

    if(TipoUsuario == "Admin"){
        let user = await usersDB.findById(Usuario)
        let nuevaTarea = new tareasDB({
            Timestamp: Timestamp,
            user: user.email,
            Empresa: `${vendedor.Nombres} ${vendedor.Apellidos}`,
            Nombres: user.Nombres,
            Apellidos:  user.Apellidos,
            Documento:  user.Cedula,
            TipoUsuario: "Administrativo",
            _idPersona: user._id,
            FechaEntrega: FechaEstimada,
            Fecha:Fecha ,
            Descripcion: Descripcion,
        })
        await nuevaTarea.save()
    }
    if(TipoUsuario == "Cliente"){
        let cliente = await clientesDB.findById(Usuario)
        let nuevaTarea = new tareasDB({
            Timestamp: Timestamp,
            user: cliente.email,
            Nombres: cliente.Nombres,
            Empresa: cliente.Empresa,
            Apellidos: cliente.Apellidos,
            Documento: cliente.RIF,
            TipoUsuario: "Cliente",
            _idPersona: cliente._id,
            FechaEntrega: FechaEstimada,
            Fecha: Fecha,
            Descripcion: Descripcion ,
        })
        await nuevaTarea.save()

    }
    if(TipoUsuario == "Vendedor"){
        let vendedor = await vendedoresDB.findById(Usuario)
        let nuevaTarea = new tareasDB({
            Timestamp: Timestamp,
            user: vendedor.emails,
            Nombres: vendedor.Nombres,
            Empresa: `${vendedor.Nombres} ${vendedor.Apellidos}`,
            Apellidos: vendedor.Apellidos,
            Documento: vendedor.Cedula,
            TipoUsuario: "Vendedor",
            _idPersona: vendedor._id,
            FechaEntrega: FechaEstimada ,
            Fecha:Fecha ,
            Descripcion: Descripcion,
        })
        await nuevaTarea.save()
    }

    req.flash("success", "Tarea registrada correctamente")
    res.redirect("/crear-nueva-tarea")

})

router.post('/posponer-tarea/:id', isAuthenticatedTareas, async (req, res) => {
    let {FechaPospuesta} = req.body
    await tareasDB.findByIdAndUpdate(req.params.id,{
        FechaPospuesta
    }) 
    req.flash("success","Fecha pospuesta correctamente")
    res.redirect('/manager-tareas')
})

router.get('/completar-tarea/:id', isAuthenticatedTareas, async (req, res) => {
    let tarea = await tareasDB.findById(req.params.id)
    await tareasDB.findByIdAndUpdate(tarea._id,{
        Estado: "Entregada"
    })
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
    if(tarea.FechaPospuesta == "-"){
        let calificacion = await calificacionDB.findOne({user: tarea.user})
        if(calificacion){
            if(calificacion.CalificacionActual != 10){
                let CalificacionActual = +calificacion.CalificacionActual + 1
                let HistorialCalificaciones ={
                    Puntos: 1, 
                    Calificacion: CalificacionActual, 
                    Motivo: "Cumplio tarea dentro del tiempo", 
                    Fecha: Fecha, 
                    Timestamp: Timestamp,
                }
                await calificacionDB.findByIdAndUpdate(calificacion._id,{
                    CalificacionActual : CalificacionActual,
                    $push : {HistorialCalificaciones: HistorialCalificaciones}
                })
            }else{
                let HistorialCalificaciones ={
                    Puntos: 1, 
                    Calificacion: 10, 
                    Motivo: "Cumplio tarea dentro del tiempo", 
                    Fecha: Fecha, 
                    Timestamp: Timestamp,
                }
                await calificacionDB.findByIdAndUpdate(calificacion._id,{
                    $push : {HistorialCalificaciones: HistorialCalificaciones}
                })
            }
            req.flash("success",`La tarea fue entregada correctamente y el usuario ${tarea.Empresa} tuvo +1 punto`)
            res.redirect('/manager-tareas')
        }else{
            let nuevaCalificacion = new calificacionDB({
                user: tarea.user ,
                Nombres: tarea.Nombres ,
                Apellidos: tarea.Apellidos ,
                Documento: tarea.Cedula ,
                TipoUsuario: tarea.TipoUsuario,
                _idPersona: tarea._idPersona ,
            })
            await nuevaCalificacion.save()
            let HistorialCalificaciones ={
                Puntos: 1, 
                Calificacion: 10, 
                Motivo: "Cumplio tarea dentro del tiempo", 
                Fecha: Fecha, 
                Timestamp: Timestamp,
            }
            await calificacionDB.findOneAndUpdate({_idPersona: tarea._idPersona},{
                $push : {HistorialCalificaciones : HistorialCalificaciones}
            })
            req.flash("success",`La tarea fue entregada correctamente y el usuario ${tarea.Empresa} tuvo +1 punto`)
            res.redirect('/manager-tareas')
        }
    }else{
        if(tarea.FechaPospuesta >= Fecha){
            let calificacion = await calificacionDB.findOne({user: tarea.user})
            if(calificacion){
                if(calificacion.CalificacionActual != 10){
                    let CalificacionActual = +calificacion.CalificacionActual + 0.5 
                    let HistorialCalificaciones ={
                        Puntos: 0.5, 
                        Calificacion: CalificacionActual, 
                        Motivo: "Cumplio tarea dentro del tiempo", 
                        Fecha: Fecha, 
                        Timestamp: Timestamp,
                    }
                    await calificacionDB.findByIdAndUpdate(calificacion._id,{
                        CalificacionActual : CalificacionActual,
                        $push : {HistorialCalificaciones: HistorialCalificaciones}
                    })
                }else{
                    let HistorialCalificaciones ={
                        Puntos: 0.5, 
                        Calificacion: 10, 
                        Motivo: "Cumplio tarea dentro del tiempo", 
                        Fecha: Fecha, 
                        Timestamp: Timestamp,
                    }
                    await calificacionDB.findByIdAndUpdate(calificacion._id,{
                        $push : {HistorialCalificaciones: HistorialCalificaciones}
                    })
                }
                req.flash("success",`La tarea fue entregada correctamente y el usuario ${tarea.Empresa} tuvo +0.5 punto`)
                res.redirect('/manager-tareas')
            }else{
                let nuevaCalificacion = new calificacionDB({
                    user: tarea.user ,
                    Nombres: tarea.Nombres ,
                    Apellidos: tarea.Apellidos ,
                    Documento: tarea.Cedula ,
                    TipoUsuario: tarea.TipoUsuario,
                    _idPersona: tarea._idPersona ,
                })
                await nuevaCalificacion.save()
                let HistorialCalificaciones ={
                    Puntos: 0.5, 
                    Calificacion: 10, 
                    Motivo: "Cumplio tarea dentro del tiempo", 
                    Fecha: Fecha, 
                    Timestamp: Timestamp,
                }
                await calificacionDB.findOneAndUpdate({_idPersona: tarea._idPersona},{
                    $push : {HistorialCalificaciones : HistorialCalificaciones}
                })
                req.flash("success",`La tarea fue entregada correctamente y el usuario ${tarea.Empresa} tuvo 0.5 punto`)
                res.redirect('/manager-tareas')
            }

        }else{

            let calificacion = await calificacionDB.findOne({user: tarea.user})
            if(calificacion){
                if(calificacion.CalificacionActual != 10){
                    let CalificacionActual = +calificacion.CalificacionActual - 1 
                    let HistorialCalificaciones ={
                        Puntos: -1, 
                        Calificacion: CalificacionActual, 
                        Motivo: "Cumplio tarea dentro del tiempo", 
                        Fecha: Fecha, 
                        Timestamp: Timestamp,
                    }
                    await calificacionDB.findByIdAndUpdate(calificacion._id,{
                        CalificacionActual : CalificacionActual,
                        $push : {HistorialCalificaciones: HistorialCalificaciones}
                    })
                }else{
                    let HistorialCalificaciones ={
                        Puntos: -1, 
                        Calificacion: 9, 
                        Motivo: "Cumplio tarea dentro del tiempo", 
                        Fecha: Fecha, 
                        Timestamp: Timestamp,
                    }
                    await calificacionDB.findByIdAndUpdate(calificacion._id,{
                        $push : {HistorialCalificaciones: HistorialCalificaciones}
                    })
                }
                req.flash("success",`La tarea fue entregada correctamente y el usuario ${tarea.Empresa} tuvo -1 punto`)
                res.redirect('/manager-tareas')
            }else{
                let nuevaCalificacion = new calificacionDB({
                    user: tarea.user ,
                    Nombres: tarea.Nombres ,
                    Apellidos: tarea.Apellidos ,
                    Documento: tarea.Cedula ,
                    TipoUsuario: tarea.TipoUsuario,
                    _idPersona: tarea._idPersona ,
                })
                await nuevaCalificacion.save()
                let HistorialCalificaciones ={
                    Puntos: -1, 
                    Calificacion: 9, 
                    Motivo: "Cumplio tarea dentro del tiempo", 
                    Fecha: Fecha, 
                    Timestamp: Timestamp,
                }
                await calificacionDB.findOneAndUpdate({_idPersona: tarea._idPersona},{
                    $push : {HistorialCalificaciones : HistorialCalificaciones}
                })
                req.flash("success",`La tarea fue entregada correctamente y el usuario ${tarea.Empresa} tuvo -1 punto`)
                res.redirect('/manager-tareas')
            }
        }
    }

})

router.get('/realizar-orden', isAuthenticatedProveedor, async (req, res) => {
    let proveedores = await proveedorDB.find().sort({"Empresa" : 1})
    proveedores = proveedores.map((data) => {
        return{
            Empresa: data.Empresa,
            _id: data._id
        }
    })
    res.render('admin/proveedores/realizar-orden',{
        proveedores
    })
})

router.post('/solicitar-info-proveedor', isAuthenticatedProveedor, async (req, res) => {
    let {Proveedor} = req.body
    let productos = await productosDB.find({Proveedor:Proveedor})
    res.send(JSON.stringify(productos))
})


router.post('/enviar-productos-orden',isAuthenticatedProveedor, async (req, res) => {
    let {Codigo, TipoProducto, PrecioFOBUnitario, Cantidad, PrecioFOBTotal, MetrosCubicosUnidad, 
        MetrosCubicosTotal, PesoUnidad, PesoTotal, Descripcion, Proveedor, Referencia} = req.body
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
    let ordenProveedorTemporal = await ordenProveedorTemporalDB.find()
    if(ordenProveedorTemporal.length == 0){
        let Numero = 1
        let data = {
            Codigo, 
            Referencia, 
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
        let nuevaOrdenProveedorTemporal = new ordenProveedorTemporalDB({
            Numero: Numero,
            Fecha: Fecha,
            Proveedor: Proveedor,
            MetrosCubicos: MetrosCubicosTotal,
            Peso: PesoTotal,
            CantidadTotal: Cantidad,
            PrecioTotal: PrecioFOBTotal,
        })
        await nuevaOrdenProveedorTemporal.save()


        await ordenProveedorTemporalDB.findOneAndUpdate({Numero:Numero},{
            $push : {Productos: data}
        })
        let ok = "ok"
        res.send(JSON.stringify(ok))

        
    }else{
        let validacion = ordenProveedorTemporal[0].Productos.find((data) => data.Codigo == Codigo)
        if(validacion){
            let error = "El código a agregar ya se encuentra en la lista. Por favor, valide e intente de nuevo"
            res.send(JSON.stringify(error))
        }else{
            if(ordenProveedorTemporal[0].Proveedor != Proveedor){
                let error = `Ya existe una orden con el proveedor ${ordenProveedorTemporal[0].Proveedor}. Por favor, valide en "Ver Lista de compra" e intente de nuevo.`
                res.send(JSON.stringify(error))
            }else{
                let MetrosCubicos = +ordenProveedorTemporal[0].MetrosCubicos + +MetrosCubicosTotal
                let Peso = +ordenProveedorTemporal[0].Peso + +PesoTotal
                let CantidadTotal = +ordenProveedorTemporal[0].CantidadTotal + +Cantidad
                let PrecioTotal = +ordenProveedorTemporal[0].PrecioTotal + +PrecioFOBTotal
                let data = {
                    Codigo, 
                    Referencia, 
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
                await ordenProveedorTemporalDB.findByIdAndUpdate(ordenProveedorTemporal[0]._id,{
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

    }
})

router.get('/ver-lista-compra-proveedor', isAuthenticatedProveedor, async (req, res) => {
    let ordenProveedorTemporal = await ordenProveedorTemporalDB.find()
    if(ordenProveedorTemporal.length == 0){
        req.flash("error", "No hay lista de compra existente. Para poder generar una lista de compra debe agregar como minimo un producto.")
        res.redirect('/realizar-orden')
    }else{
        ordenProveedorTemporal = {
            Numero: ordenProveedorTemporal[0].Numero, 
            Fecha: ordenProveedorTemporal[0].Fecha, 
            Proveedor: ordenProveedorTemporal[0].Proveedor, 
            MetrosCubicos: ordenProveedorTemporal[0].MetrosCubicos, 
            Peso: ordenProveedorTemporal[0].Peso, 
            CantidadTotal: ordenProveedorTemporal[0].CantidadTotal, 
            PrecioTotal2: ordenProveedorTemporal[0].PrecioTotal, 
            PrecioTotal:  new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(ordenProveedorTemporal[0].PrecioTotal), 
            Productos: ordenProveedorTemporal[0].Productos.map((data) => {
                return{
                    Codigo: data.Codigo,
                    Referencia: data.Referencia,
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
            }), 
        }
        res.render('admin/proveedores/ver-orden-temporal',{
            ordenProveedorTemporal
        })
    }
})

router.post('/cambiando-cantidad-orden-temporal-proveedor', isAuthenticatedProveedor, async (req, res) => {
    let {MetrosCubicos, Peso, CantidadTotal, PrecioTotal, Producto }= req.body

    let ordenTemporalProveedor = await ordenProveedorTemporalDB.find()
    let MetrosCubicosActualizados = (+ordenTemporalProveedor[0].MetrosCubicos + MetrosCubicos).toFixed(10)
    let PesoActualizados = (+ordenTemporalProveedor[0].Peso + Peso).toFixed(2)
    let CantidadTotalActualizados = +ordenTemporalProveedor[0].CantidadTotal + CantidadTotal
    let PrecioTotalActualizados = (+ordenTemporalProveedor[0].PrecioTotal + PrecioTotal).toFixed(2)
    let ProductosActualizados = ordenTemporalProveedor[0].Productos.filter((data) => data.Codigo != Producto.Codigo)
    ProductosActualizados.push(Producto)
     
    await ordenProveedorTemporalDB.findByIdAndUpdate(ordenTemporalProveedor[0]._id,{
        MetrosCubicos: MetrosCubicosActualizados, 
        Peso: PesoActualizados, 
        CantidadTotal: CantidadTotalActualizados, 
        PrecioTotal: PrecioTotalActualizados, 
        Productos: ProductosActualizados, 
    })

    res.send(JSON.stringify("ok"))
})


router.post('/eliminar-codigo-orden-temporal-proveedor', isAuthenticatedProveedor, async (req, res) => {
    let {Codigo} = req.body
    let ordenTemporalProveedor = await ordenProveedorTemporalDB.find()
    let Producto = ordenTemporalProveedor[0].Productos.find((data) => data.Codigo == Codigo)
    let MetrosCubicosActualizados = (+ordenTemporalProveedor[0].MetrosCubicos - +Producto.MetrosCubicosTotal).toFixed(10)
    let PesoActualizados = (+ordenTemporalProveedor[0].Peso - +Producto.PesoTotal).toFixed(2)
    let CantidadTotalActualizados = +ordenTemporalProveedor[0].CantidadTotal - +Producto.Cantidad
    let PrecioTotalActualizados = (+ordenTemporalProveedor[0].PrecioTotal - +Producto.PrecioFOBTotal).toFixed(2)
    let ProductosActualizados = ordenTemporalProveedor[0].Productos.filter((data) => data.Codigo != Codigo)
    if(ProductosActualizados.length == 0){
        await ordenProveedorTemporalDB.findByIdAndDelete(ordenTemporalProveedor[0]._id) 
        res.send(JSON.stringify("ok"))

    }else{
        await ordenProveedorTemporalDB.findByIdAndUpdate(ordenTemporalProveedor[0]._id,{
            MetrosCubicos: MetrosCubicosActualizados, 
            Peso: PesoActualizados, 
            CantidadTotal: CantidadTotalActualizados, 
            PrecioTotal: PrecioTotalActualizados, 
            Productos: ProductosActualizados, 
        })
        res.send(JSON.stringify("ok"))

    }
})

router.get('/generar-orden-compra-proveedor', isAuthenticatedProveedor, async (req, res) => {
    let Timestamp = Date.now();
    let Fecha = new Date();
    let dia;
    let mes;
    let año = Fecha.getFullYear();
    let ordenProveedor = await ordenProveedorDB.find().sort({"Timestamp": -1})
    let ordenProveedorTemporal = await ordenProveedorTemporalDB.find()
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
    if(ordenProveedor.length == 0){
        Numero = 20210001
    }else{
        Numero = +ordenProveedor[0].Numero + 1
    }
    let nuevaOrdenProveedor = new ordenProveedorDB({
        Numero: Numero,
        Fecha: Fecha,
        Timestamp: Timestamp,
        Proveedor: ordenProveedorTemporal[0].Proveedor,
        MetrosCubicos: ordenProveedorTemporal[0].MetrosCubicos,
        Peso: ordenProveedorTemporal[0].Peso,
        CantidadTotal: ordenProveedorTemporal[0].CantidadTotal,
        PrecioTotal: ordenProveedorTemporal[0].PrecioTotal,
        Productos: ordenProveedorTemporal[0].Productos
    })
    await nuevaOrdenProveedor.save()
    await ordenProveedorTemporalDB.findByIdAndDelete(ordenProveedorTemporal[0]._id)

    req.flash("success", `Orden de compra al proveedor #${Numero} generada correctamente`)
    res.redirect('/realizar-orden')

})

router.get('/reporte-compras-proveedor', isAuthenticatedProveedor, async (req, res) => {
    let ordenesComprasProveedor = await ordenProveedorDB.find().sort({Numero: -1})
    let Proveedores = []
    for(i=0; i< ordenesComprasProveedor.length; i++){
        let validacion = Proveedores.find((data) => data == ordenesComprasProveedor[i].Proveedor)
        if(!validacion){
            Proveedores.push(ordenesComprasProveedor[i].Proveedor)
        }
    }
    res.render('admin/proveedores/reporte-compras-proveedor',{
        Proveedores
    })
})

router.post('/solicitar-info-grafica-ordenes-proveedor', isAuthenticatedProveedor, async (req, res) => {
    let {Proveedor} = req.body
    let ordenes = await ordenProveedorDB.find({Proveedor:Proveedor}).sort({Numero:-1})
    let Fechas = []
    let Precios = []
    for(i=0; i< ordenes.length; i++){
        Fechas.push(ordenes[i].Fecha)
        Precios.push(ordenes[i].PrecioTotal)
    } 
    
    let data= {
        Fechas,
        Precios,
        ordenes
    }
    res.send(JSON.stringify(data))
})


router.get('/descargar-excel-orden-compra-proveedor/:id', isAuthenticatedProveedor, async (req, res) => {
    let orden  = await ordenProveedorDB.findByIdAndUpdate(req.params.id)
    const xl = require("excel4node");
        
    const wb = new xl.Workbook();

    const ws = wb.addWorksheet(`Compra ${orden.Numero}`);

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
    ws.cell(1,1).string("Fecha").style(headers2)
    ws.cell(1,5).string("Número").style(headers2)
    ws.cell(1,9).string("Proveedor").style(headers2)
    ws.cell(3,1).string("Metros cubicos totales").style(headers2)
    ws.cell(3,5).string("Peso total").style(headers2)
    ws.cell(3,9).string("Precio total").style(headers2)
    ws.cell(1,2).string(orden.Fecha)
    ws.cell(1,6).number(orden.Numero)
    ws.cell(1,10).string(orden.Proveedor)
    ws.cell(3,2).number(orden.MetrosCubicos)
    ws.cell(3,6).number(orden.Peso)
    ws.cell(3,10).number(orden.PrecioTotal)


    ws.cell(5,1).string("Código").style(headers2)
    ws.cell(5,2).string("Referencia").style(headers2)
    ws.cell(5,3).string("Tipo producto").style(headers2)
    ws.cell(5,4).string("Descripción").style(headers2)
    ws.cell(5,5).string("Metros cubicos unitarios").style(headers2)
    ws.cell(5,6).string("Metros cubicos totales").style(headers2)
    ws.cell(5,7).string("Peso Unidad").style(headers2)
    ws.cell(5,8).string("Peso Total").style(headers2)
    ws.cell(5,9).string("Precio FOB unitario").style(headers2)
    ws.cell(5,10).string("Cantidad").style(headers2)
    ws.cell(5,11).string("Precio FOB total").style(headers2)


    let fila = 6
    for(i=0; i< orden.Productos.length; i++){
        columna = 1
        ws.cell(fila, columna++).string(orden.Productos[i].Codigo).style(lineas)
        ws.cell(fila, columna++).string(orden.Productos[i].Referencia).style(lineas)
        ws.cell(fila, columna++).string(orden.Productos[i].TipoProducto).style(lineas)
        ws.cell(fila, columna++).string(orden.Productos[i].Descripcion).style(lineas)
        ws.cell(fila, columna++).string(orden.Productos[i].MetrosCubicosUnidad).style(lineas)
        ws.cell(fila, columna++).string(orden.Productos[i].MetrosCubicosTotal).style(lineas)
        ws.cell(fila, columna++).string(orden.Productos[i].PesoUnidad).style(lineas)
        ws.cell(fila, columna++).string(orden.Productos[i].PesoTotal).style(lineas)
        ws.cell(fila, columna++).number(+orden.Productos[i].PrecioFOBUnitario).style(lineas)
        ws.cell(fila, columna++).number(+orden.Productos[i].Cantidad).style(lineas)
        ws.cell(fila, columna++).number(+orden.Productos[i].PrecioFOBTotal).style(lineas)
        fila++
    }
    wb.write(`Compra ${orden.Numero}.xlsx`, res);
})


router.get('/estado-de-ordenes', isAuthenticatedProveedor, async (req, res) => {
    let ordenes = await ordenProveedorDB.find({Estado : {$ne: "Inventario"}}).sort({"Numero": 1})
    ordenes = ordenes.map((data) => {
        return{
            Numero: data.Numero 
        }
    })
    res.render('admin/proveedores/estado-ordenes',{
        ordenes
    })
})

router.post('/solicitar-orden-proveedor', isAuthenticatedProveedor, async (req, res) => {
    let {Numero} = req.body
    let orden = await ordenProveedorDB.findOne({Numero: Numero})
    res.send(JSON.stringify(orden))
})


router.post('/guardar-cambios-estado-orden', isAuthenticatedProveedor, async (req, res) => {
    let {Productos, Numero, Estado} = req.body
    let orden = await ordenProveedorDB.findOne({Numero: Numero})
    let ProductosValidados = []
    let CantidadTotal = 0
    let PrecioTotal = 0
    let MetrosCubicos = 0
    let Peso = 0
    for(i=0; i< Productos.length; i++){
        let validacion = orden.Productos.find((data) => data.Codigo == Productos[i].Codigo)
        validacion.PrecioFOBTotal = (+validacion.PrecioFOBUnitario * Productos[i].Cantidad).toFixed(2)
        validacion.MetrosCubicosTotal = (+validacion.MetrosCubicosUnidad * Productos[i].Cantidad).toFixed(10)
        validacion.PesoTotal = (+validacion.PesoUnidad * Productos[i].Cantidad).toFixed(2)
        validacion.Cantidad = Productos[i].Cantidad
        CantidadTotal += +Productos[i].Cantidad
        PrecioTotal += +validacion.PrecioFOBTotal
        MetrosCubicos += +validacion.MetrosCubicosTotal
        Peso += +validacion.PesoTotal
        ProductosValidados.push(validacion)
    }
    await ordenProveedorDB.findByIdAndUpdate(orden._id,{
        MetrosCubicos: MetrosCubicos,
        Peso: Peso,
        CantidadTotal: CantidadTotal,
        Estado: Estado,
        PrecioTotal: PrecioTotal,
        Productos: ProductosValidados,
    })
    if(Estado == "Inventario"){
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

        for(i=0; i<  Productos.length; i++ ){
            let stock = await productosDB.findOne({Codigo: Productos[i].Codigo})
            let CantidadNueva = +stock.Cantidad + +Productos[i].Cantidad
            let HistorialMovimiento = {
                FechaMovimiento : Fecha,
                CantidadAnterior : stock.Cantidad,
                CantidadMovida : Productos[i].Cantidad,
                CantidadNueva : CantidadNueva,
                Comentario : `Ingreso por orden de compra al proveedor #${Numero}`,
                Timestamp : Timestamp,
                TipoMovimiento : "Carga",
            }
            await productosDB.findByIdAndUpdate(stock._id,{
                Cantidad: CantidadNueva,
                $push: {HistorialMovimiento:HistorialMovimiento}
            })
        }
    }
    res.send(JSON.stringify("ok"))
})


router.post('/solicitar-info-grafica-estadisticas', isAuthenticatedEstadisticas, async (req, res)=>{
    let ventasPorMes = await ventasMesesDB.find().sort({"Anio":1, "NumeroMes":1})
    let bateriasPorMes = await ventasBateriasMesDB.find().sort({"Anio":1, "NumeroMes":1})
    let amortiguadoresPorMes = await ventasAmortiguadoresMesDB.find().sort({"Anio":1, "NumeroMes":1})
    let bombasPorMes = await ventasBombasMesDB.find().sort({"Anio":1, "NumeroMes":1})
    let bujesPorMes = await ventasBujesMesDB.find().sort({"Anio":1, "NumeroMes":1})
    let basesPorMes = await ventasBasesMesDB.find().sort({"Anio":1, "NumeroMes":1})
    let guardapolvosPorMes = await ventasGuardapolvoMesDB.find().sort({"Anio":1, "NumeroMes":1})
    let valvulasPorMes = await ventasValvulasMesDB.find().sort({"Anio":1, "NumeroMes":1})
    let bujiasPorMes = await ventasBujiasMesDB.find().sort({"Anio":1, "NumeroMes": 1})
    let bujiasMes = []
    let basesMes = []
    let guardapolvosMes = []
    let valvulasMes = []
    let ventasMes = []
    let montoVentasMes = []
    let UtilidadesVentasMes = []
    let bateriasMes = []
    let montoBateriasMes = []
    let amortiguadoresMes = []
    let montoAmortiguadoresMes = []
    let bombasMes = []
    let montoBombasMes = []
    let bujesMes = []
    let montoBujias = []
    let montoBujes = []
    let montoBases = []
    let montoGuardapolvos = []
    let montoValvulas = []
    
    for(i=0; i< ventasPorMes.length; i++){
        ventasMes.push(ventasPorMes[i].Mes)
        montoVentasMes.push(ventasPorMes[i].MontoTotal)
        UtilidadesVentasMes.push(ventasPorMes[i].UtilidadesTotales)
    }
    for(i=0; i< bateriasPorMes.length; i++){
        bateriasMes.push(bateriasPorMes[i].Mes)
        montoBateriasMes.push(bateriasPorMes[i].MontoTotal)
    }
    for(i=0; i< bujiasPorMes.length; i++){
        bujiasMes.push(bujiasPorMes[i].Mes)
        montoBujias.push(bujiasPorMes[i].MontoTotal)
    }
    for(i=0; i< amortiguadoresPorMes.length; i++){
        amortiguadoresMes.push(amortiguadoresPorMes[i].Mes)
        montoAmortiguadoresMes.push(amortiguadoresPorMes[i].MontoTotal)
    }
    for(i=0; i< bombasPorMes.length; i++){
        bombasMes.push(bombasPorMes[i].Mes)
        montoBombasMes.push(bombasPorMes[i].MontoTotal)
    }
    for(i=0; i< bujesPorMes.length; i++){
        bujesMes.push(bujesPorMes[i].Mes)
        montoBujes.push(bujesPorMes[i].MontoTotal)
    }
    for(i=0; i< basesPorMes.length; i++){
        basesMes.push(basesPorMes[i].Mes)
        montoBases.push(basesPorMes[i].MontoTotal)
    }
    for(i=0; i< guardapolvosPorMes.length; i++){
        guardapolvosMes.push(guardapolvosPorMes[i].Mes)
        montoGuardapolvos.push(guardapolvosPorMes[i].MontoTotal)
    }
    for(i=0; i< valvulasPorMes.length; i++){
        valvulasMes.push(valvulasPorMes[i].Mes)
        montoValvulas.push(valvulasPorMes[i].MontoTotal)
    }
    let data = {
        ventasMes,
        montoVentasMes,
        UtilidadesVentasMes,
        bateriasMes,
        montoBateriasMes,
        amortiguadoresMes,
        montoAmortiguadoresMes,
        bombasMes,
        montoBombasMes,
        bujesMes,
        montoBujes,
        basesMes,
        guardapolvosMes,
        bujiasMes,
        montoBujias,
        valvulasMes,
        montoBases,
        montoGuardapolvos,
        montoValvulas
    }
    res.send(JSON.stringify(data))

})

router.post('/solicitar-info-categoria', isAuthenticatedEstadisticas, async (req, res) => {
    let {Categoria} = req.body
    let data = []
    if(Categoria == "Clientes"){
        let clientesPorMes = await ventasMesesClientesDB.find().sort({"Cliente": 1})
        for(i=0; i< clientesPorMes.length; i++){
            let validacion = data.find((doc) => doc == clientesPorMes[i].Cliente)
            if(!validacion){
                data.push(clientesPorMes[i].Cliente)
            }
        }
    }
    if(Categoria == "Vendedores"){
        let vendedoresPorMes = await ventasMesesVendedoresDB.find().sort({"Cliente": 1})
        for(i=0; i< vendedoresPorMes.length; i++){
            let validacion = data.find((doc) => doc == vendedoresPorMes[i].Vendedor)
            if(!validacion){
                data.push(vendedoresPorMes[i].Vendedor)
            }
        }
            
    }
    if(Categoria == "Zonas"){
        let zonasPorMes = await ventasZonasMesDB.find().sort({"Zona":1})
        for(i=0; i< zonasPorMes.length; i++){
            let validacion = data.find((doc) => doc == zonasPorMes[i].Zona)
            if(!validacion){
                data.push(zonasPorMes[i].Zona)
            }
        }
    }
    res.send(JSON.stringify(data))
})


router.post('/solicitar-info-grafica-personalizada', isAuthenticatedEstadisticas, async (req, res) => {
    let {Categoria, Dato} = req.body
    let dataFecha = []
    let dataMonto = []
    
    if(Categoria == "Clientes"){
        let clientesPorMes = await ventasMesesClientesDB.find({Cliente:Dato}).sort({"Anio":1, "NumeroMes":1})
        for(i=0; i< clientesPorMes.length; i++){
            dataFecha.push(clientesPorMes[i].Mes)
            dataMonto.push(clientesPorMes[i].MontoTotal)
        }

    }
    if(Categoria == "Vendedores"){
        let vendedoresPorMes = await ventasMesesVendedoresDB.find({Vendedor:Dato}).sort({"Anio":1, "NumeroMes":1})
        for(i=0; i< vendedoresPorMes.length; i++){
            dataFecha.push(vendedoresPorMes[i].Mes)
            dataMonto.push(vendedoresPorMes[i].MontoTotal)
        }
    }
    if(Categoria == "Zonas"){
        let zonasPorMes = await ventasZonasMesDB.find({Zona:Dato}).sort({"Anio":1, "NumeroMes":1})
        for(i=0; i< zonasPorMes.length; i++){
            dataFecha.push(zonasPorMes[i].Mes)
            dataMonto.push(zonasPorMes[i].MontoTotal)
        }
    }
    let data = {
        dataFecha,
        dataMonto  
    }
    res.send(JSON.stringify(data))
})
router.get('/ver-historial-movimientos/:id', isAuthenticatedInventario, async (req, res) => {
    let producto = await productosDB.findById(req.params.id)
    let Codigo= producto.Codigo
    let historialMovimiento = producto.HistorialMovimiento.map((data) => {
        return{
            FechaMovimiento: data.FechaMovimiento,
            CantidadAnterior: data.CantidadAnterior,
            CantidadMovida: data.CantidadMovida,
            CantidadNueva: data.CantidadNueva,
            Comentario: data.Comentario,
            Timestamp: data.Timestamp,
            TipoMovimiento: data.TipoMovimiento,
        }
    })
    historialMovimiento.sort(function (a, b) {
        if (+a.Timestamp > +b.Timestamp) {
          return -1;
        }
        if (+a.Timestamp < +b.Timestamp) {
          return 1;
        }
        return 0;
    }); 

    res.render('admin/inventario/historial-movimientos',{
        Codigo,
        historialMovimiento
    })

})

router.get('/nueva-factura', isAuthenticatedFacturacion, async (req, res) => {
    let productos = await productosDB.find().sort({"Codigo":1})
    productos = productos.map((data) => {
        return{
            Codigo: data.Codigo,
            _id: data._id
        }
    })
 
    let transporte = await transporteDB.find().sort({"Empresa": -1})
    transporte = transporte.map((data) => {
        return{
            Empresa: data.Empresa,
            _id: data._id
        }
    }) 
    let Clientes = await clientesDB.find().sort({"Empresa": -1})
    Clientes = Clientes.map((data) => {
        return{
            Empresa: data.Empresa,
            _id: data._id
        }
    })
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
    res.render('admin/facturacion/nueva-factura',{
        Fecha,
        Clientes,
        transporte,
        productos
    })
    
})


router.get('/todas-las-facturas', isAuthenticatedFacturacion, async (req, res) => {
    let facturas = await facturasDB.find().sort({"Timestamp": -1})
    facturas = facturas.map((data) => {
        return{
            Timestamp: data.Timestamp,
            Fecha: data.Fecha,
            Vencimiento: data.Vencimiento,
            Cambio: data.Cambio,
            NumeroFactura: data.NumeroFactura,
            NumeroNota: data.NumeroNota,
            NumeroControl: data.NumeroControl,
            Cliente: data.Cliente,
            Documento: data.Documento,
            Direccion: data.Direccion,
            Celular: data.Celular,
            Zona: data.Zona,
            NetoUSD:  new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.NetoUSD),
            NetoBS: new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(data.NetoBS),
            CantidadTotal: data.CantidadTotal,
            Vendedor: data.Vendedor,
            _idVendedor: data._idVendedor,
            Estado: data.Estado,
            Transporte: data.Transporte,
            PrecioTarifaUSD: data.PrecioTarifaUSD,
            PrecioTarifaBS: data.PrecioTarifaBS,
            EstadoTarifa: data.EstadoTarifa,
        }
    })
    res.render('admin/facturacion/todas-las-facturas',{
        facturas
    })
})

router.post('/solicitar-facturas-por-filtro', isAuthenticatedFacturacion, async (req, res) => {
    let {Estado} = req.body
    if(Estado == "Todas"){
        let notasEntregas = await facturasDB.find().sort({"Timestamp":-1})
        let cantidadTotalGenerada = 0
        let netoTotalGenerado = 0
        let saldoTotalGenerado = 0
        for(i=0; i< notasEntregas.length; i++){
            cantidadTotalGenerada += +notasEntregas[i].CantidadTotal
            netoTotalGenerado += +notasEntregas[i].Neto
            saldoTotalGenerado += +notasEntregas[i].Saldo
        }
        saldoTotalGenerado = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(saldoTotalGenerado)
        netoTotalGenerado = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotalGenerado)
        notasEntregas = notasEntregas.map((data) => {
            return{
                Timestamp: data.Timestamp,
                Fecha: data.Fecha,
                Vencimiento: data.Vencimiento,
                Numero: data.Numero,
                Cliente: data.Cliente,
                Documento: data.Documento,
                Direccion: data.Direccion,
                Celular: data.Celular,
                Zona: data.Zona,
                Neto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Neto),
                Saldo: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Saldo),
                CantidadTotal: data.CantidadTotal,
                Vendedor: data.Vendedor,
                _idVendedor: data._idVendedor,
                PorcentajeGanancia: data.PorcentajeGanancia,
                GananciasVendedor: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.GananciasVendedor),
                EstadoComision: data.EstadoComision,
                Estado: data.Estado,
                Transporte: data.Transporte,
                EstadoTarifa: data.EstadoTarifa,
                _id: data._id
            }
        })
        let data = {
            cantidadTotalGenerada,
            netoTotalGenerado,
            saldoTotalGenerado,
            notasEntregas
        }
        res.send(JSON.stringify(data))
    }else{
        let notasEntregas = await facturasDB.find({Estado:Estado}).sort({"Timestamp":-1})
        let cantidadTotalGenerada = 0
        let netoTotalGenerado = 0
        let saldoTotalGenerado = 0
        for(i=0; i< notasEntregas.length; i++){
            cantidadTotalGenerada += +notasEntregas[i].CantidadTotal
            netoTotalGenerado += +notasEntregas[i].Neto
            saldoTotalGenerado += +notasEntregas[i].Saldo
        }
        saldoTotalGenerado = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(saldoTotalGenerado)
        netoTotalGenerado = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotalGenerado)
        notasEntregas = notasEntregas.map((data) => {
            return{
                Timestamp: data.Timestamp,
                Fecha: data.Fecha,
                Vencimiento: data.Vencimiento,
                Numero: data.Numero,
                Cliente: data.Cliente,
                Documento: data.Documento,
                Direccion: data.Direccion,
                Celular: data.Celular,
                Zona: data.Zona,
                Neto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Neto),
                Saldo: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Saldo),
                CantidadTotal: data.CantidadTotal,
                Vendedor: data.Vendedor,
                _idVendedor: data._idVendedor,
                PorcentajeGanancia: data.PorcentajeGanancia,
                GananciasVendedor: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.GananciasVendedor),
                EstadoComision: data.EstadoComision,
                Estado: data.Estado,
                Transporte: data.Transporte,
                EstadoTarifa: data.EstadoTarifa,
                _id: data._id
            }
        })
        let data = {
            cantidadTotalGenerada,
            netoTotalGenerado,
            saldoTotalGenerado,
            notasEntregas
        }
        res.send(JSON.stringify(data))
    }
})

router.get('/ver-factura/:id', isAuthenticatedDuroc, async (req, res) => {
    let notaEntrega = await facturasDB.findOne({NumeroFactura:req.params.id})
    if(notaEntrega.Estado == "Por pagar"){
        notaEntrega = {
            Timestamp: notaEntrega.Timestamp, 
            Fecha: notaEntrega.Fecha, 
            Vencimiento: notaEntrega.Vencimiento, 
            DescuentoBS: new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(notaEntrega.DescuentoBS),
            BaseImponibleBS: new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(notaEntrega.BaseImponibleBS),
            IvaBS: new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(notaEntrega.IvaBS),
            TotalSinDescuentoBS: new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(notaEntrega.TotalSinDescuentoBS),
            Cambio: notaEntrega.Cambio, 
            NumeroFactura: notaEntrega.NumeroFactura, 
            NumeroNota: notaEntrega.NumeroNota, 
            NumeroControl: notaEntrega.NumeroControl, 
            Cliente: notaEntrega.Cliente, 
            Documento: notaEntrega.Documento, 
            Direccion: notaEntrega.Direccion, 
            Celular: notaEntrega.Celular, 
            Zona: notaEntrega.Zona, 
            NetoUSD: notaEntrega.NetoUSD, 
            NetoBS: new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(notaEntrega.NetoBS), 
            CantidadTotal: notaEntrega.CantidadTotal, 
            Vendedor: notaEntrega.Vendedor, 
            _idVendedor: notaEntrega._idVendedor, 
            Estado: notaEntrega.Estado, 
            Transporte: notaEntrega.Transporte, 
            PrecioTarifaUSD: notaEntrega.PrecioTarifaUSD, 
            PrecioTarifaBS:  new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(notaEntrega.PrecioTarifaBS), 
            EstadoTarifa: notaEntrega.EstadoTarifa, 
            Productos : notaEntrega.Productos.map((data) =>{
                return{
                    Codigo: data.Codigo,
                    Producto: data.Producto,
                    Descripcion: data.Descripcion,
                    Cantidad: data.Cantidad,
                    PrecioUnidadUSD: data.PrecioUnidadUSD,
                    PrecioUnidadBS:  new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(data.PrecioUnidadBS),
                    PrecioTotalUSD: data.PrecioTotalUSD,
                    PrecioTotalBS:  new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(data.PrecioTotalBS),
                }
            })
        }
    }else{
        notaEntrega = {
            Timestamp: notaEntrega.Timestamp, 
            Fecha: notaEntrega.Fecha, 
            Anulada: true,
            Vencimiento: notaEntrega.Vencimiento, 
            DescuentoBS: new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(notaEntrega.DescuentoBS),
            BaseImponibleBS: new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(notaEntrega.BaseImponibleBS),
            IvaBS: new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(notaEntrega.IvaBS),
            TotalSinDescuentoBS: new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(notaEntrega.TotalSinDescuentoBS),
            Cambio: notaEntrega.Cambio, 
            NumeroFactura: notaEntrega.NumeroFactura, 
            NumeroNota: notaEntrega.NumeroNota, 
            NumeroControl: notaEntrega.NumeroControl, 
            Cliente: notaEntrega.Cliente, 
            Documento: notaEntrega.Documento, 
            Direccion: notaEntrega.Direccion, 
            Celular: notaEntrega.Celular, 
            Zona: notaEntrega.Zona, 
            NetoUSD: notaEntrega.NetoUSD, 
            NetoBS: new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(notaEntrega.NetoBS), 
            CantidadTotal: notaEntrega.CantidadTotal, 
            Vendedor: notaEntrega.Vendedor, 
            _idVendedor: notaEntrega._idVendedor, 
            Estado: notaEntrega.Estado, 
            Transporte: notaEntrega.Transporte, 
            PrecioTarifaUSD: notaEntrega.PrecioTarifaUSD, 
            PrecioTarifaBS:  new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(notaEntrega.PrecioTarifaBS), 
            EstadoTarifa: notaEntrega.EstadoTarifa, 
            Productos : notaEntrega.Productos.map((data) =>{
                return{
                    Codigo: data.Codigo,
                    Producto: data.Producto,
                    Descripcion: data.Descripcion,
                    Cantidad: data.Cantidad,
                    PrecioUnidadUSD: data.PrecioUnidadUSD,
                    PrecioUnidadBS:  new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(data.PrecioUnidadBS),
                    PrecioTotalUSD: data.PrecioTotalUSD,
                    PrecioTotalBS:  new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(data.PrecioTotalBS),
                }
            })
        }
    }
    Titulo = `Proforma ${notaEntrega.NumeroFactura} ${notaEntrega.Cliente}`
    res.render('admin/archivos_pdf/facturas',{
        notaEntrega,
        Titulo,
        layout:"reportes.hbs"
    })
})

router.get('/ver-historial-factura/:id', isAuthenticatedDuroc, async (req, res) => {
    let notaEntrega = await facturasDB.findById(req.params.id)
    let Numero = notaEntrega.Numero
    let historial = notaEntrega.HistorialPago.map((data) => {
        return{
            Pago: data.Pago,
            Comentario: data.Comentario,
            Recibo: data.Recibo,
            Modalidad: data.Modalidad,
            FechaPago: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.FechaPago),
            user: data.user,
            Timestamp: data.Timestamp,
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
        historial,
        Numero
    })
})

router.get('/directorio-transporte', isAuthenticatedTransporte, async (req, res) => {
    let transporte = await transporteDB.find().sort({"Empresa" : 1})
    transporte = transporte.map((data) => {
        return{
            Empresa: data.Empresa,
            Direccion: data.Direccion,
            Celular: data.Celular,
            Telefono: data.Telefono,
            email: data.email,
            _id: data._id,
        }
    })
    res.render('admin/transporte/directorio',{
        transporte
    })
})

router.get('/ver-transporte/:id', isAuthenticatedTransporte, async (req, res) =>{
    let transporte = await transporteDB.findById(req.params.id)
    transporte = {
        Empresa: transporte.Empresa,
        CodigoTelefono: transporte.CodigoTelefono,
        CodigoCelular: transporte.CodigoCelular,
        Direccion: transporte.Direccion,
        Celular: transporte.Celular,
        Telefono: transporte.Telefono,
        email: transporte.email,
        _id: transporte._id,
        Tarifario: transporte.Tarifario.map((data) =>{
            return{
                Ciudad: data.Ciudad,
                Porcentaje: data.Porcentaje,
            }
        }),
    }
    res.render('admin/transporte/ver-transporte',{
        transporte
    })
})


router.post('/actualizar-transporte/:id', isAuthenticatedTransporte, async (req, res) => {
    let {Empresa, Direccion, Celular, Telefono, CodigoTelefono, CodigoCelular, email, Tarifario} = req.body
    await transporteDB.findByIdAndUpdate(req.params.id,{
        Empresa, 
        Direccion, 
        Celular, 
        CodigoTelefono, 
        CodigoCelular,
        Telefono, 
        email, 
        Tarifario
    })
    res.send(JSON.stringify("ok"))
})

router.get('/notas-transporte', isAuthenticatedTransporte, async (req, res) => {
    let notasTransporte = await notastransporteDB.find({Estado:"Pendiente"}).sort({NumeroNota: -1})
    notasTransporte = notasTransporte.map((data) => {
        return{
            Timestamp: data.Timestamp,
            Fecha: data.Fecha,
            EmpresaTransporte: data.EmpresaTransporte,
            NumeroFactura: data.NumeroFactura,
            NumeroNota: data.NumeroNota,
            CambioBolivares: new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(data.CambioBolivares),
            PrecioTotalFactura:  new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotalFactura),
            PrecioTotalFacturaBS: new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(data.PrecioTotalFacturaBS),
            Estado: data.Estado,
            Zona: data.Zona,
            Tarifa: data.Tarifa,
            PrecioPagar: data.PrecioPagar,
            _id: data._id,
        }
    })
    res.render('admin/transporte/notas-transporte',{
        notasTransporte
    })
})


router.post('/solicitar-notas-de-transporte', isAuthenticatedTransporte, async (req, res) => {
    let {Estado} = req.body
    let notasTransporte = await notastransporteDB.find({Estado:Estado}).sort({NumeroNota: -1})
    notasTransporte = notasTransporte.map((data) => {
        return{
            Timestamp: data.Timestamp,
            Fecha: data.Fecha,
            EmpresaTransporte: data.EmpresaTransporte,
            NumeroFactura: data.NumeroFactura,
            NumeroNota: data.NumeroNota,
            CambioBolivares: new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(data.CambioBolivares),
            PrecioTotalFactura:  new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotalFactura),
            PrecioTotalFacturaBS: new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(data.PrecioTotalFacturaBS),
            Estado: data.Estado,
            Zona: data.Zona,
            Tarifa: data.Tarifa,
            PrecioPagar: data.PrecioPagar,
            _id: data._id,
        }
    })
    res.send(JSON.stringify(notasTransporte))

})

router.get('/pagar-notas', isAuthenticatedTransporte, async (req, res) =>{
    let notasTransporte = await notastransporteDB.find({Estado:"Pendiente"}).sort({NumeroNota: -1})
    notasTransporte = notasTransporte.map((data) => {
        return{
            NumeroFactura: data.NumeroFactura,
        }
    })
    res.render('admin/transporte/pagar-notas',{
        notasTransporte
    })
})


router.post('/solicitar-monto-transporte',isAuthenticatedTransporte,  async (req, res) => {
    let {Factura} = req.body
    let notasTransporte = await notastransporteDB.findOne({NumeroFactura:Factura}).sort({NumeroNota: -1})
    let monto = new Intl.NumberFormat("es-VE", {  style: "currency",  currency: "VEF",}).format(notasTransporte.PrecioTotalFacturaBS)
    res.send(JSON.stringify(monto))

})

router.post('/pagar-nota-transporte', isAuthenticatedTransporte, async (req, res) => {
    let {Factura} = req.body
    await notastransporteDB.findOneAndUpdate({NumeroFactura: Factura},{
        Estado: "Cerrado"
    })
    let tareas = await tareasDB.find({NotaEntrega: Factura})
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
    for(i=0; i< tareas.length; i++){
        if(tareas[i].Estado != "Entregada"){
            await tareasDB.findByIdAndUpdate(tareas[i]._id,{
                Estado: "Entregada"
            })
            if(tareas[i].FechaPospuesta == "-"){
                let calificacion = await calificacionDB.findOne({_idPersona: tareas[i]._idPersona})
                if(calificacion){
                    if(calificacion.CalificacionActual != 10){
                        let CalificacionActual = +calificacion.CalificacionActual + 1
                        let HistorialCalificaciones ={
                            Puntos: 1, 
                            Calificacion: CalificacionActual, 
                            Motivo: "Cumplio tarea dentro del tiempo", 
                            Fecha: Fecha, 
                            Timestamp: Timestamp,
                        }
                        await calificacionDB.findByIdAndUpdate(calificacion._id,{
                            CalificacionActual : CalificacionActual,
                            $push : {HistorialCalificaciones: HistorialCalificaciones}
                        })
                    }else{
                        let HistorialCalificaciones ={
                            Puntos: 1, 
                            Calificacion: 10, 
                            Motivo: "Cumplio tarea dentro del tiempo", 
                            Fecha: Fecha, 
                            Timestamp: Timestamp,
                        }
                        await calificacionDB.findByIdAndUpdate(calificacion._id,{
                            $push : {HistorialCalificaciones: HistorialCalificaciones}
                        })
                    }
                }else{
                    let nuevaCalificacion = new calificacionDB({
                        user: tareas[i].user ,
                        Nombres: tareas[i].Nombres ,
                        Apellidos: tareas[i].Apellidos ,
                        Documento: tareas[i].Cedula ,
                        TipoUsuario: tareas[i].TipoUsuario,
                        _idPersona: tareas[i]._idPersona ,
                    })
                    await nuevaCalificacion.save()
                    let HistorialCalificaciones ={
                        Puntos: 1, 
                        Calificacion: 10, 
                        Motivo: "Cumplio tarea dentro del tiempo", 
                        Fecha: Fecha, 
                        Timestamp: Timestamp,
                    }
                    await calificacionDB.findOneAndUpdate({_idPersona: tareas[i]._idPersona},{
                        $push : {HistorialCalificaciones : HistorialCalificaciones}
                    })
                }
            }else{
                if(tareas[i].FechaPospuesta >= Fecha){
                    let calificacion = await calificacionDB.findOne({_idPersona: tareas[i]._idPersona})
                    if(calificacion){
                        if(calificacion.CalificacionActual != 10){
                            let CalificacionActual = +calificacion.CalificacionActual + 0.5 
                            let HistorialCalificaciones ={
                                Puntos: 0.5, 
                                Calificacion: CalificacionActual, 
                                Motivo: "Cumplio tarea dentro del tiempo", 
                                Fecha: Fecha, 
                                Timestamp: Timestamp,
                            }
                            await calificacionDB.findByIdAndUpdate(calificacion._id,{
                                CalificacionActual : CalificacionActual,
                                $push : {HistorialCalificaciones: HistorialCalificaciones}
                            })
                        }else{
                            let HistorialCalificaciones ={
                                Puntos: 0.5, 
                                Calificacion: 10, 
                                Motivo: "Cumplio tarea dentro del tiempo", 
                                Fecha: Fecha, 
                                Timestamp: Timestamp,
                            }
                            await calificacionDB.findByIdAndUpdate(calificacion._id,{
                                $push : {HistorialCalificaciones: HistorialCalificaciones}
                            })
                        }
                    }else{
                        let nuevaCalificacion = new calificacionDB({
                            user: tareas[i].user ,
                            Nombres: tareas[i].Nombres ,
                            Apellidos: tareas[i].Apellidos ,
                            Documento: tareas[i].Cedula ,
                            TipoUsuario: tareas[i].TipoUsuario,
                            _idPersona: tareas[i]._idPersona ,
                        })
                        await nuevaCalificacion.save()
                        let HistorialCalificaciones ={
                            Puntos: 0.5, 
                            Calificacion: 10, 
                            Motivo: "Cumplio tarea dentro del tiempo", 
                            Fecha: Fecha, 
                            Timestamp: Timestamp,
                        }
                        await calificacionDB.findOneAndUpdate({_idPersona: tareas[i]._idPersona},{
                            $push : {HistorialCalificaciones : HistorialCalificaciones}
                        })
                    }
        
                }else{
        
                    let calificacion = await calificacionDB.findOne({_idPersona: tareas[i]._idPersona})
                    if(calificacion){
                        if(calificacion.CalificacionActual != 10){
                            let CalificacionActual = +calificacion.CalificacionActual - 1 
                            let HistorialCalificaciones ={
                                Puntos: -1, 
                                Calificacion: CalificacionActual, 
                                Motivo: "Cumplio tarea dentro del tiempo", 
                                Fecha: Fecha, 
                                Timestamp: Timestamp,
                            }
                            await calificacionDB.findByIdAndUpdate(calificacion._id,{
                                CalificacionActual : CalificacionActual,
                                $push : {HistorialCalificaciones: HistorialCalificaciones}
                            })
                        }else{
                            let HistorialCalificaciones ={
                                Puntos: -1, 
                                Calificacion: 9, 
                                Motivo: "Cumplio tarea dentro del tiempo", 
                                Fecha: Fecha, 
                                Timestamp: Timestamp,
                            }
                            await calificacionDB.findByIdAndUpdate(calificacion._id,{
                                $push : {HistorialCalificaciones: HistorialCalificaciones}
                            })
                        }
                    }else{
                        let nuevaCalificacion = new calificacionDB({
                            user: tareas[i].user ,
                            Nombres: tareas[i].Nombres ,
                            Apellidos: tareas[i].Apellidos ,
                            Documento: tareas[i].Cedula ,
                            TipoUsuario: tareas[i].TipoUsuario,
                            _idPersona: tareas[i]._idPersona ,
                        })
                        await nuevaCalificacion.save()
                        let HistorialCalificaciones ={
                            Puntos: -1, 
                            Calificacion: 9, 
                            Motivo: "Cumplio tarea dentro del tiempo", 
                            Fecha: Fecha, 
                            Timestamp: Timestamp,
                        }
                        await calificacionDB.findOneAndUpdate({_idPersona: tareas[i]._idPersona},{
                            $push : {HistorialCalificaciones : HistorialCalificaciones}
                        })
                    }
                }
            }

        }
    }
    req.flash("success", `La nota de transporte de la factura #${Factura} fue pagada correctamente.`)
    res.redirect('/pagar-notas')
})
router.post('/registrar-usuario-incio', async (req, res) => {
    let {email} = req.body
    let vendedor = await vendedoresDB.findOne({email:email})
    if(!vendedor){
        let cliente = await clientesDB.findOne({email:email})
        if(cliente){
            let data = {
                Usuario : "Cliente",
                email:email
            }
            res.render('login/ingreso-datos-registro',{
                layout:"sign-in",
                data
            })
        }else{
            req.flash("error", "El correo ingresado no se encuentra en nuestra base de dato. Por favor, valide e intente de nuevo")
            res.redirect('/registro-usuarios')
        }
    }else{
        let data = {
            Usuario : "Vendedor",
            email:email
        }
        res.render('login/ingreso-datos-registro',{
            layout:"sign-in",
            data
        })
    }
})

router.post('/registrar-datos-usuarios', async (req,res) => {
    let {email, TipoUsuario, contrasenia, Repitacontrasenia} = req.body
    if(contrasenia != Repitacontrasenia){
        let data = {
            email,
            TipoUsuario,
            contrasenia,
            Repitacontrasenia
        }
        let error = "Las contraseñas ingresadas no coinciden. Por favor, valide e intente de nuevo."
        res.render('login/ingreso-datos-registro',{
            layout:"sign-in.hbs",
            data,
            error
        })
    }else{
        let Role = ""
        let Nombres = ""
        let Apellidos = ""
        let Cedula = ""
        let Empresa = ""
        let password = contrasenia
        if(TipoUsuario == "Vendedor"){
            let vendedor = await vendedoresDB.findOne({email:email})
            Role = "Seller"
            Nombres = vendedor.Nombres,
            Apellidos = vendedor.Apellidos,
            Cedula = vendedor.Cedula,
            Empresa = `${vendedor.Nombres} ${vendedor.Apellidos}`
        }else{
            let cliente = await clientesDB.findOne({email:email})
            Role = "Client"
            Nombres = cliente.Nombres,
            Apellidos = cliente.Apellidos,
            Cedula = cliente.Cedula,
            Empresa = cliente.Empresa
        }

        email = email.toLowerCase()
        let nuevoUsuario = new usersDB({
            Nombres, 
            Apellidos, 
            Cedula, 
            Empresa,
            TipoUsuario,
            Role, 
            email, 
            password,
        })
        nuevoUsuario.password = await nuevoUsuario.encryptPassword(password);
        nuevoUsuario.save()
        req.flash("success", "Usuario registrado correctamente. Por favor, introduzca sus datos para iniciar sesión")
        res.redirect("/iniciar-sesion")

    }
})


router.get('/tareas', isAuthenticatedDuroc ,async (req, res) => {
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
    res.render('admin/mis-tareas',{
        tareas
    })
})

router.get('/nueva-tarea-personal', isAuthenticatedDuroc ,async (req, res) =>{
    res.render('admin/nueva-tarea-personal')
})


router.post('/nueva-tarea-personal', isAuthenticatedDuroc, async (req, res) => {
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
    res.redirect('/nueva-tarea-personal')
})

router.get('/perfil', isAuthenticatedDuroc, async (req, res) => {
    let usuario = await usersDB.findOne({email: req.user.email})
    usuario = {
        Nombres: usuario.Empresa,
        email: usuario.email,
        password: usuario.password,
        _id: usuario._id
    }
    res.render('admin/perfil',{
        usuario
    })

})

router.post('/actualizar-datos-usuario/:id', isAuthenticatedDuroc, async (req, res) => {
    let {email, emailConfirm, password, passwordConfirm} = req.body
    if(email != emailConfirm){
        req.flash("error", "Los correos ingresados no coinciden. Por favor, valide e intente de nuevo")
        res.redirect('/perfil')
        return
    }
    if(password != passwordConfirm){
        req.flash("error", "Las contraseñas ingresadas no coinciden. Por favor, valide e intente de nuevo")
        res.redirect('/perfil')
        return
    }
    let validacionUsuario = await usersDB.findById(req.params.id)
    if(validacionUsuario.password == password){
        await usersDB.findByIdAndUpdate(validacionUsuario._id,{
            email: email
        })
        req.flash("success", "Usuario actualizado correctamente")
        res.redirect('/perfil')

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
        res.redirect('/perfil')
    }
} )


router.post('/solicitar-ordenes-compra-numero', isAuthenticatedDuroc ,async (req, res) => {
    let ordenComprasClientes = await ordenComprasClientesDB.find({$or : [{Estado:"En proceso"},{Estado: "Procesada"}]})
    let solicitudesClientes = await solicitudesClientesDB.find().sort({})
    let solicitudesEgresos = await solicitudesEgresosDB.find({Estado: "Pendiente"}).sort()
    let solicitudesPagos = await solicitudesPagoDB.find({Estado: "Pendiente"})
    solicitudesEgresos = solicitudesEgresos.length
    solicitudesPagos = solicitudesPagos.length 
    solicitudesClientes = solicitudesClientes.length
    let solicitudes = await solicitudesDevolucionesDB.find({Estado: "Pendiente"})
    let cantidad = +ordenComprasClientes.length + +solicitudes.length + +solicitudesPagos + +solicitudesEgresos
    let garantias = await garantiasDB.find({Estado: "Pendiente"})
    let reportePagos = +solicitudesEgresos + +solicitudesPagos
    garantias = garantias.length
    let data= {
        General: cantidad,
        solicitudesClientes: solicitudesClientes,
        Ordenes: ordenComprasClientes.length,
        garantias: garantias,
        reportePagos: reportePagos,
        Solicitudes : solicitudes.length
    }
    res.send(JSON.stringify(data))
})

router.get('/procesar-ordenes', isAuthenticatedFacturacion, async (req, res) => {
    let ordenComprasClientes = await ordenComprasClientesDB.find({Estado: "En proceso"})
    ordenComprasClientes = ordenComprasClientes.map((data) => {
        return{
            Numero: data.Numero,
            Timestamp: data.Timestamp,
            Fecha: data.Fecha,
            Cliente: data.Cliente,
            Factura: data.Factura,
            Vendedor: data.Vendedor,
            _idUsuarioVendedor: data._idUsuarioVendedor,
            SolicitadoPor: data.SolicitadoPor,
            MetrosCubicos: data.MetrosCubicos,
            Peso: data.Peso,
            CantidadTotal: data.CantidadTotal,
            Estado: data.Estado,
            PrecioTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotal),
            _id: data._id,
        }
    })
    res.render('admin/facturacion/procesar-ordenes',{
        ordenComprasClientes
    })
})

router.get('/ver-detalles-orden-compra/:id', isAuthenticatedFacturacion, async (req, res) => {
    let ordenesComprasClientes = await ordenComprasClientesDB.findById(req.params.id)
    ordenesComprasClientes = {
        Numero: ordenesComprasClientes.Numero,
        Timestamp: ordenesComprasClientes.Timestamp,
        Fecha: ordenesComprasClientes.Fecha,
        Cliente: ordenesComprasClientes.Cliente,
        Factura: ordenesComprasClientes.Factura,
        Vendedor: ordenesComprasClientes.Vendedor,
        _idUsuarioVendedor: ordenesComprasClientes._idUsuarioVendedor,
        SolicitadoPor: ordenesComprasClientes.SolicitadoPor,
        MetrosCubicos: ordenesComprasClientes.MetrosCubicos,
        Peso: ordenesComprasClientes.Peso,
        CantidadTotal: ordenesComprasClientes.CantidadTotal,
        Estado: ordenesComprasClientes.Estado,
        PrecioTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(ordenesComprasClientes.PrecioTotal),
        _id: ordenesComprasClientes._id,
        Productos : ordenesComprasClientes.Productos.map((data) => {
            return{
                Codigo: data.Codigo,
                Cantidad: data.Cantidad,
                PrecioFOBUnitario: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioFOBUnitario),
                PrecioFOBTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioFOBTotal),
                MetrosCubicosUnidad: data.MetrosCubicosUnidad,
                MetrosCubicosTotal: data.MetrosCubicosTotal,
                PesoUnidad: data.PesoUnidad,
                PesoTotal: data.PesoTotal,
                Descripcion: data.Descripcion,
                TipoProducto: data.TipoProducto,
            }
        })
    }
    let titulo = `Orden de compra ${ordenesComprasClientes.Numero} - ${ordenesComprasClientes.Cliente}`
    res.render('admin/archivos_pdf/ver-detalles-orden-compra',{
        ordenesComprasClientes,
        titulo,
        layout:"reportes.hbs"
    })
})


router.post('/cambiar-estado-orden/:id',isAuthenticatedFacturacion,  async (req, res)=> {
    let {Estado} = req.body
    await ordenComprasClientesDB.findByIdAndUpdate(req.params.id,{
        Estado:Estado
    })
    req.flash("success", "Cambio de estado procesado correctamente.")
    res.redirect("/procesar-ordenes")
})


router.post('/solicitar-ordenes-clientes-por-estado', isAuthenticatedFacturacion, async (req, res) => {
    let {Estado} = req.body
    let ordenes = await ordenComprasClientesDB.find({Estado: Estado})
    ordenes = ordenes.map((data) => {
        return{
            Numero: data.Numero,
            Timestamp: data.Timestamp,
            Fecha: data.Fecha,
            Cliente: data.Cliente,
            Factura: data.Factura,
            Vendedor: data.Vendedor,
            _idUsuarioVendedor: data._idUsuarioVendedor,
            SolicitadoPor: data.SolicitadoPor,
            MetrosCubicos: data.MetrosCubicos,
            Peso: data.Peso,
            CantidadTotal: data.CantidadTotal,
            Estado: data.Estado,
            PrecioTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotal),
            _id: data._id,
        }
    })
    res.send(JSON.stringify(ordenes))
})


router.get('/facturar-orden/:id', isAuthenticatedFacturacion, async (req, res) => {
    let orden = await ordenComprasClientesDB.findById(req.params.id)
    let notaEntrega = await notasEntregaDB.find().sort({Numero: -1})
    let NumeroInicial = notaEntrega[0].Numero
    let listaProductos = await productosDB.find().sort({})
    listaProductos = listaProductos.map((data) => {
        return{
            Codigo: data.Codigo
        }
    })
    if(notaEntrega.length == 0){
        NumeroInicial = 20210000001
    }else{
        NumeroInicial = +notaEntrega[0].Numero + 1
    }
    let transporte = await transporteDB.find().sort({"Empresa": 1})
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
    transporte = transporte.map((data) => {
        return{
            Empresa: data.Empresa,
            _id: data._id,
        }
    })
    let cambioBolivares = await cambioFacturacionDB.find()
    let cambio = cambioBolivares[0].Cambio
    if(orden.Estado == "Procesada"){
        let productos = await productosDB.find()
        let MontoGeneralAtendible = 0
        let CantidadGeneralAtendible = 0
        for(i=0; i< orden.Productos.length; i++){
            let codigo = productos.find((data) => data.Codigo == orden.Productos[i].Codigo)
            orden.Productos[i].CantidadEnStock = codigo.Cantidad
            if(+codigo.Cantidad == +orden.Productos[i].Cantidad){
                orden.Productos[i].CantidadAtendible = codigo.Cantidad
                orden.Productos[i].MontoAtendible = (+codigo.Cantidad * +orden.Productos[i].PrecioFOBUnitario).toFixed(2)
                MontoGeneralAtendible = +MontoGeneralAtendible + (+codigo.Cantidad * +orden.Productos[i].PrecioFOBUnitario)
                CantidadGeneralAtendible += +codigo.Cantidad
            }
            if(+codigo.Cantidad > +orden.Productos[i].Cantidad){
                orden.Productos[i].CantidadAtendible = orden.Productos[i].Cantidad
                orden.Productos[i].MontoAtendible = (+orden.Productos[i].Cantidad * +orden.Productos[i].PrecioFOBUnitario).toFixed(2)
                CantidadGeneralAtendible += +orden.Productos[i].Cantidad
                MontoGeneralAtendible = +MontoGeneralAtendible + (+orden.Productos[i].Cantidad * +orden.Productos[i].PrecioFOBUnitario)

            }
            if(+codigo.Cantidad < +orden.Productos[i].Cantidad){
                orden.Productos[i].CantidadAtendible = codigo.Cantidad
                orden.Productos[i].MontoAtendible = (+codigo.Cantidad * +orden.Productos[i].PrecioFOBUnitario).toFixed(2)
                MontoGeneralAtendible = +MontoGeneralAtendible + (+codigo.Cantidad * +orden.Productos[i].PrecioFOBUnitario)
                CantidadGeneralAtendible += +codigo.Cantidad
            }
        }
        let cliente = await clientesDB.findOne({Empresa: orden.Cliente})
        let vendedor = await vendedoresDB.findById(cliente._idVendedor)
        let vendedores = await vendedoresDB.find().sort({"Nombres":1})
        vendedores = vendedores.map((data) => {
            return{
                Nombres: data.Nombres,
                Apellidos: data.Apellidos,
            }
        })

        orden = {
            Numero: orden.Numero,
            Timestamp: orden.Timestamp,
            Fecha: orden.Fecha,
            DiasCredito:orden.DiasCredito, 
            CantidadGeneralAtendible: CantidadGeneralAtendible,
            MontoGeneralAtendible: MontoGeneralAtendible,
            Cliente: orden.Cliente,
            _idCliente: cliente._id,
            Factura: orden.Factura,
            Vendedor: orden.Vendedor,
            Porcentaje: vendedor.Porcentaje,
            MaximoDias : cliente.MaximoCredito, 
            _idUsuarioVendedor: orden._idUsuarioVendedor,
            SolicitadoPor: orden.SolicitadoPor,
            MetrosCubicos: orden.MetrosCubicos,
            Peso: orden.Peso,
            CantidadTotal: orden.CantidadTotal,
            Estado: orden.Estado,
            PrecioTotal: orden.PrecioTotal,
            Productos: orden.Productos.map((data) => {
                if(data.CantidadAtendible == 0){
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
                        CantidadEnStock: data.CantidadEnStock,
                        CantidadAtendible: data.CantidadAtendible,
                        MontoAtendible: data.MontoAtendible,
                        clase: "text-danger",
                    }
                }else{
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
                        CantidadEnStock: data.CantidadEnStock,
                        CantidadAtendible: data.CantidadAtendible,
                        MontoAtendible: data.MontoAtendible,
                        clase: "text-dark"
                    }
                }
            })
        }
        res.render('admin/facturacion/facturacion-de-ordenes',{
            orden,
            NumeroInicial,
            listaProductos,
            cambio,
            vendedores,
            Fecha,
            transporte
        })

    }else{
        req.flash("error", 'La orden no se encuentra en estado "Procesada". Por favor, valide e intente de nuevo')
        res.redirect('/procesar-ordenes')
    }
})


router.post('/solicitar-numero-nota-entrega', isAuthenticatedFacturacion, async (req, res) => {
    
    let notasEntrega  = await notasEntregaDB.find().sort({"Timestamp":-1})
    let numero = 0
    if(notasEntrega.length == 0){
        numero = 20210000001
    }else{
        numero = +notasEntrega[i].Numero + 1
    }
    res.send(JSON.stringify(numero))
})


router.post('/cambiar-estado-orden-facturada/:id', isAuthenticatedFacturacion, async (req, res) => {
    let {Factura} = req.body 
    await ordenComprasClientesDB.findOneAndUpdate({Numero: req.params.id},{
        Factura: Factura,
        Estado: "Facturada"
    })
    res.send(JSON.stringify("ok"))
})

router.get('/reporte-de-pagos', isAuthenticatedVendedor, async (req, res) => {
    let vendedores = []
    const reportes = await reportesDB.find().sort({Vendedor:1})
    for(i=0; i< reportes.length; i++ ){
        let validacion = vendedores.find((data) => data == reportes[i].Vendedor)
        if(!validacion){
            vendedores.push(reportes[i].Vendedor)
        }
    } 
    res.render('admin/vendedores/reportes-pagos',{
        vendedores
    })
})


router.post('/solicitar-info-reportes-pagos-vendedores-e-i', isAuthenticatedVendedor, async (req, res) => {
    let {Vendedor} = req.body
    let reportes = await reportesDB.find({Vendedor:Vendedor}).sort({"Timestamp":-1})
    res.send(JSON.stringify(reportes))
})

router.post('/solicitar-cambio-bolivares', isAuthenticatedDuroc, async (req, res) => {
    let cambioBolivares = await cambioFacturacionDB.find()
    if(cambioBolivares.length == 0){
        let nuevoCambioBolivares = new cambioFacturacionDB({
            Cambio: 0,
            Estado: "Desactualizado",
            FechaActualizacion: "",
            NumeroActualizacionDiaria: 1 ,
        })
        await nuevoCambioBolivares.save()
    }
    cambioBolivares = await cambioFacturacionDB.find()
    if(cambioBolivares[0].Estado == "Desactualizado"){
        let data = {
            Cambio: cambioBolivares[0].Cambio,
            Estado: true
        }
        res.send(JSON.stringify(data))
    }else{
        let data = {
            Estado: false
        }
        res.send(JSON.stringify(false))
    }
})

router.post('/actualizar-precio-cambio-bolivares', isAuthenticatedDuroc, async (req, res) => {
    let {Cambio} = req.body
    let cambioBolivares = await cambioFacturacionDB.find()
    let NumeroActualizacionDiaria = 0
    if(cambioBolivares[0].NumeroActualizacionDiaria == 2){
        NumeroActualizacionDiaria = 1
    }
    if(cambioBolivares[0].NumeroActualizacionDiaria == 1){
        NumeroActualizacionDiaria = 2
        
    }
    if(cambioBolivares[0].NumeroActualizacionDiaria == 0){
        NumeroActualizacionDiaria = 1
    }

    let Fecha = new Date()
    await cambioFacturacionDB.findByIdAndUpdate(cambioBolivares[0]._id,{
        Cambio : Cambio,
        Estado : "Actualizado",
        FechaActualizacion : Fecha,
        NumeroActualizacionDiaria : NumeroActualizacionDiaria,

    })
    res.redirect(req.headers.referer)
})

router.get('/ver-garantias', isAuthenticatedInventario, async (req, res) => {
    let garantias = await garantiasDB.find().sort({"Timestamp":-1})
    garantias = garantias.map((data) => {
        return{
            Timestamp: data.Timestamp,
            Fecha: data.Fecha,
            Codigo: data.Codigo,
            Valor: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Valor),
            TipoProducto: data.TipoProducto,
            Cantidad: data.Cantidad,
            Cliente: data.Cliente,
            Vendedor: data.Vendedor,
            _idVendedor: data._idVendedor,
            Estado: data.Estado,
            _id: data._id,
        }
    })
    res.render('admin/inventario/ver-garantias',{
        garantias
    })
})


router.get('/registrar-nueva-garantia', isAuthenticatedInventario, async (req, res) => {
    let Fecha = new Date();
    let dia;
    let mes;
    let año = Fecha.getFullYear();
    let clientes = await clientesDB.find().sort({"Empresa" :1})
    let productos = await productosDB.find().sort({"Codigo":1})
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
    productos = productos.map((data) => {
        return{
            Codigo: data.Codigo,
            _id: data._id,
        }
    })
    clientes = clientes.map((data) => {
        return{
            Empresa: data.Empresa,
            _id: data._id
        }
    })
    res.render('admin/inventario/registrar-garantia',{
        clientes,
        Fecha,
        productos
    })
})

router.post('/registrar-nueva-garantia', isAuthenticatedInventario, async (req, res) => {
    let {Cliente, Fecha, Codigo, Cantidad} = req.body
    let Timestamp = Date.now();
    let cliente = await clientesDB.findOne({Empresa: Cliente})
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
        Cliente: Cliente,
        Vendedor: vendedor,
        _idVendedor: cliente._idVendedor,
    })
    await nuevaGarantia.save()
    req.flash("success", "Garantía registrada correctamente")
    res.redirect("/registrar-nueva-garantia")

})


router.post('/rechazar-garantia/:id', isAuthenticatedInventario, async (req, res) => {
    await garantiasDB.findByIdAndUpdate(req.params.id,{
        Estado: "Rechazada"
    })
    req.flash("success","Garantia rechazada correctamente")
    res.redirect('/ver-garantias')
})


router.post('/solicitar-garantia-por-filtro', isAuthenticatedInventario, async (req, res) => {
    let {Estado} = req.body
    let garantias = await garantiasDB.find({Estado: Estado}).sort({"Timestamp":-1})
    garantias = garantias.map((data) => {
        return{
            Timestamp: data.Timestamp,
            Fecha: data.Fecha,
            Codigo: data.Codigo,
            Valor: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Valor),
            TipoProducto: data.TipoProducto,
            Cantidad: data.Cantidad,
            Cliente: data.Cliente,
            Vendedor: data.Vendedor,
            _idVendedor: data._idVendedor,
            Estado: data.Estado,
            _id: data._id,
        }
    })

    res.send(JSON.stringify(garantias))

})


router.get('/realizar-cobranza', isAuthenticatedFacturacion, async (req, res) => {
    let clientes = await clientesDB.find().sort({"Empresa": 1})
    clientes = clientes.map((data) => {
        return{
            Empresa: data.Empresa,
        }
    })
    res.render('admin/facturacion/realizar-cobranza',{
        clientes
    })
})
router.post('/registrar-nuevo-reporte-de-pago-admin', isAuthenticatedFacturacion ,async (req, res) => {
    let {Fecha, SaldoFavor, Timestamp, MontoTotal, Cliente, Modalidad, NumeroTransaccion, Comentario, Facturas} = req.body
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
        Estado: "Enviada", 
        Transaccion: NumeroTransaccion, 
        Monto: MontoTotal, 
        Modalidad: Modalidad, 
        Comentario: Comentario, 
        Cliente: Cliente, 
        Documento: datosCliente.Documento, 
        Direccion: datosCliente.Direccion, 
        Celular: datosCliente.Celular, 
    })
    await nuevaSolicitud.save()
    res.send(JSON.stringify("ok"))
})




router.get('/reportar-pago', isAuthenticatedFacturacion, async (req, res) => {
    let solicitudesPago = await solicitudesPagoDB.find({}).sort({Estado: 1, Timestamp: -1, })
    let solicitudesEgresos = await solicitudesEgresosDB.find({}).sort({Estado: 1,Timestamp: -1, })
    let solicitud = []
    for(i=0; i< solicitudesPago.length; i++){
        let data = {
            Fecha: solicitudesPago[i].Fecha,
            Cliente: solicitudesPago[i].Cliente,
            Vendedor: solicitudesPago[i].Vendedor,
            SolicitadoPor: solicitudesPago[i].SolicitadoPor,
            Tipo: "Ingreso",
            link: `/ver-solicitud-de-pago/${solicitudesPago[i]._id}`,
            Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(solicitudesPago[i].Monto),
            Estado: solicitudesPago[i].Estado, 
            _id: solicitudesPago[i]._id,
        }
        solicitud.push(data)
    }
    for(i=0; i< solicitudesEgresos.length; i++){
        let data = {
            Fecha: solicitudesEgresos[i].Fecha,
            Cliente: "-",
            Vendedor: solicitudesEgresos[i].Vendedor,
            SolicitadoPor: "Vendedor",
            Tipo: "Egreso",
            link: `/ver-solicitud-de-egreso/${solicitudesEgresos[i]._id}`,
            Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(solicitudesEgresos[i].MontoTotal),
            Estado: solicitudesEgresos[i].Estado, 
            _id: solicitudesEgresos[i]._id,
        }
        solicitud.push(data)
    }


    res.render('admin/facturacion/cobranza',{
        solicitud
    })
})



router.post('/solicitar-notas-de-entrega-cobranza', isAuthenticatedDuroc,async (req, res) => {
    let { Cliente} = req.body
    let notas = await notasEntregaDB.find({$and : [{Cliente: Cliente},{Estado:"Por pagar"}]}).sort({Numero: 1})
    res.send(notas)
})

router.post('/solicitar-numero-transaccion-cobranza', isAuthenticatedDuroc, async (req, res) => {
    let {Transaccion} = req.body
    let transaciones = await transaccionesCobranzaDB.findOne({Transaccion: Transaccion})
    if(transaciones){
        let data = {
            Existe: true,
            NotaEntrega: transaciones.NotaEntrega
        }
        res.send(JSON.stringify(data))

    }else{
        let data = {
            Existe : false
        }
        res.send(JSON.stringify(data))
    }
})


router.post('/registrar-nueva-cobranza' , isAuthenticatedFacturacion, async (req, res) => {
    let {Fecha, Timestamp, SaldoFavor, Cliente, Modalidad, NumeroTransaccion, Comentario, Facturas, MontoTotal} = req.body
    let datosCliente = await clientesDB.findOne({Empresa: Cliente})
    let notasClientes = await notasEntregaDB.find({$and : [{Cliente: Cliente},{Estado:"Por pagar"}]}).sort({Numero: 1})
    let notasPagos = await notasPagoDB.find().sort({Recibo: -1})
    let Recibo = 0
    if(notasPagos.length == 0){
        Recibo = 5000001
    }else{
        Recibo = +notasPagos[0].Recibo + 1
    }
    if(Modalidad != "Efectivo"){
        let nuevaTransaccion = new transaccionesCobranzaDB({
            Modalidad: Modalidad,
            Timestamp: Timestamp,
            Tipo: "Recibo de pago", 
            Monto: MontoTotal,
            Fecha: Fecha,
            Numero: Recibo,
            Transaccion: NumeroTransaccion
        })
        await nuevaTransaccion.save()
    }

    if(+SaldoFavor > 0){
        let HistorialSaldoFavor = {
            Modalidad : "Nota de pago",
            Numero: Recibo,
            Monto: SaldoFavor
        }
        let SaldoFavorIncluir = (+SaldoFavor + + datosCliente.SaldoFavor).toFixed(2)
        await clientesDB.findByIdAndUpdate(datosCliente._id,{
            SaldoFavor: SaldoFavorIncluir,
            $push : {HistorialSaldoFavor: HistorialSaldoFavor}
        })

    }

    for(i=0; i< Facturas.length; i++){
        let notas = await notasEntregaDB.findOne({Numero:Facturas[i].NotaEntrega})
        let Saldo = (+notas.Saldo - +Facturas[i].Monto).toFixed(2) 
        if(+Saldo < 0 ){
            Saldo = 0
        }
        let HistorialPago = {
            Pago: MontoTotal,
            Comentario: Comentario,
            Modalidad: "Pago",
            Recibo:Recibo,
            FechaPago:Fecha,
            Timestamp:Timestamp,
          }
            if(Facturas[i].Comentario == "Abono"){
                await notasEntregaDB.findByIdAndUpdate(notas._id,{
                    Saldo: Saldo,
                    $push : {HistorialPago:HistorialPago}
                })
            }else{
                let tareas = await tareasDB.find({NotaEntrega: notas.Numero})
                for(x=0; x< tareas.length; x++){
                    if(tareas[x].Estado != "Entregada"){
                        await tareasDB.findByIdAndUpdate(tareas[x]._id,{
                            Estado: "Entregada"
                        })
                        if(tareas[x].FechaPospuesta == "-"){
                            let calificacion = await calificacionDB.findOne({user: tareas[x].user})
                            if(calificacion){
                                if(calificacion.CalificacionActual != 10){
                                    let CalificacionActual = +calificacion.CalificacionActual + 1
                                    let HistorialCalificaciones ={
                                        Puntos: 1, 
                                        Calificacion: CalificacionActual, 
                                        Motivo: "Cumplio tarea dentro del tiempo", 
                                        Fecha: Fecha, 
                                        Timestamp: Timestamp,
                                    }
                                    await calificacionDB.findByIdAndUpdate(calificacion._id,{
                                        CalificacionActual : CalificacionActual,
                                        $push : {HistorialCalificaciones: HistorialCalificaciones}
                                    })
                                }else{
                                    let HistorialCalificaciones ={
                                        Puntos: 1, 
                                        Calificacion: 10, 
                                        Motivo: "Cumplio tarea dentro del tiempo", 
                                        Fecha: Fecha, 
                                        Timestamp: Timestamp,
                                    }
                                    await calificacionDB.findByIdAndUpdate(calificacion._id,{
                                        $push : {HistorialCalificaciones: HistorialCalificaciones}
                                    })
                                }
                            }else{
                                let nuevaCalificacion = new calificacionDB({
                                    user: tareas[x].user ,
                                    Nombres: tareas[x].Nombres ,
                                    Apellidos: tareas[x].Apellidos ,
                                    Documento: tareas[x].Cedula ,
                                    TipoUsuario: tareas[x].TipoUsuario,
                                    _idPersona: tareas[x]._idPersona ,
                                })
                                await nuevaCalificacion.save()
                                let HistorialCalificaciones ={
                                    Puntos: 1, 
                                    Calificacion: 10, 
                                    Motivo: "Cumplio tarea dentro del tiempo", 
                                    Fecha: Fecha, 
                                    Timestamp: Timestamp,
                                }
                                await calificacionDB.findOneAndUpdate({_idPersona: tareas[x]._idPersona},{
                                    $push : {HistorialCalificaciones : HistorialCalificaciones}
                                })
                            }
                        }else{
                            if(tareas[x].FechaPospuesta >= Fecha){
                                let calificacion = await calificacionDB.findOne({user: tareas[x].user})
                                if(calificacion){
                                    if(calificacion.CalificacionActual != 10){
                                        let CalificacionActual = +calificacion.CalificacionActual + 0.5 
                                        let HistorialCalificaciones ={
                                            Puntos: 0.5, 
                                            Calificacion: CalificacionActual, 
                                            Motivo: "Cumplio tarea dentro del tiempo", 
                                            Fecha: Fecha, 
                                            Timestamp: Timestamp,
                                        }
                                        await calificacionDB.findByIdAndUpdate(calificacion._id,{
                                            CalificacionActual : CalificacionActual,
                                            $push : {HistorialCalificaciones: HistorialCalificaciones}
                                        })
                                    }else{
                                        let HistorialCalificaciones ={
                                            Puntos: 0.5, 
                                            Calificacion: 10, 
                                            Motivo: "Cumplio tarea dentro del tiempo", 
                                            Fecha: Fecha, 
                                            Timestamp: Timestamp,
                                        }
                                        await calificacionDB.findByIdAndUpdate(calificacion._id,{
                                            $push : {HistorialCalificaciones: HistorialCalificaciones}
                                        })
                                    }
                                }else{
                                    let nuevaCalificacion = new calificacionDB({
                                        user: tareas[x].user ,
                                        Nombres: tareas[x].Nombres ,
                                        Apellidos: tareas[x].Apellidos ,
                                        Documento: tareas[x].Cedula ,
                                        TipoUsuario: tareas[x].TipoUsuario,
                                        _idPersona: tareas[x]._idPersona ,
                                    })
                                    await nuevaCalificacion.save()
                                    let HistorialCalificaciones ={
                                        Puntos: 0.5, 
                                        Calificacion: 10, 
                                        Motivo: "Cumplio tarea dentro del tiempo", 
                                        Fecha: Fecha, 
                                        Timestamp: Timestamp,
                                    }
                                    await calificacionDB.findOneAndUpdate({_idPersona: tareas[x]._idPersona},{
                                        $push : {HistorialCalificaciones : HistorialCalificaciones}
                                    })
                                }
                    
                            }else{
                                let calificacion = await calificacionDB.findOne({user: tareas[x].user})
                                if(calificacion){
                                    if(calificacion.CalificacionActual != 10){
                                        let CalificacionActual = +calificacion.CalificacionActual - 1 
                                        let HistorialCalificaciones ={
                                            Puntos: -1, 
                                            Calificacion: CalificacionActual, 
                                            Motivo: "Cumplio tarea dentro del tiempo", 
                                            Fecha: Fecha, 
                                            Timestamp: Timestamp,
                                        }
                                        await calificacionDB.findByIdAndUpdate(calificacion._id,{
                                            CalificacionActual : CalificacionActual,
                                            $push : {HistorialCalificaciones: HistorialCalificaciones}
                                        })
                                    }else{
                                        let HistorialCalificaciones ={
                                            Puntos: -1, 
                                            Calificacion: 9, 
                                            Motivo: "Cumplio tarea dentro del tiempo", 
                                            Fecha: Fecha, 
                                            Timestamp: Timestamp,
                                        }
                                        await calificacionDB.findByIdAndUpdate(calificacion._id,{
                                            $push : {HistorialCalificaciones: HistorialCalificaciones}
                                        })
                                    }
                                }else{
                                    let nuevaCalificacion = new calificacionDB({
                                        user: tareas[x].user ,
                                        Nombres: tareas[x].Nombres ,
                                        Apellidos: tareas[x].Apellidos ,
                                        Documento: tareas[x].Cedula ,
                                        TipoUsuario: tareas[x].TipoUsuario,
                                        _idPersona: tareas[x]._idPersona ,
                                    })
                                    await nuevaCalificacion.save()
                                    let HistorialCalificaciones ={
                                        Puntos: -1, 
                                        Calificacion: 9, 
                                        Motivo: "Cumplio tarea dentro del tiempo", 
                                        Fecha: Fecha, 
                                        Timestamp: Timestamp,
                                    }
                                    await calificacionDB.findOneAndUpdate({_idPersona: tareas[x]._idPersona},{
                                        $push : {HistorialCalificaciones : HistorialCalificaciones}
                                    })
                                }
                            }
                        }
    
                    }
                }
                Saldo = Saldo.toFixed(2)
                await notasEntregaDB.findByIdAndUpdate(notas._id,{
                    Saldo: Saldo,
                    Estado: "Cerrada",
                    $push : {HistorialPago:HistorialPago}
                })
            }
    }
    notasClientes = await notasEntregaDB.find({$and : [{Cliente: Cliente},{Estado:"Por pagar"}]}).sort({Numero: 1})
    let PendienteAPagar = 0
    for(i=0; i< notasClientes.length; i++){
        PendienteAPagar += notasClientes[i].Saldo
    }
    PendienteAPagar = PendienteAPagar.toFixed(2)
    let nuevaNotaPago = new notasPagoDB({
        Fecha : Fecha,
        Timestamp : Timestamp,
        Recibo : Recibo,
        Facturas : Facturas,
        Transaccion : NumeroTransaccion,
        Monto : MontoTotal,
        Modalidad : Modalidad,
        Comentario : Comentario,
        Cliente : Cliente,
        Documento : datosCliente.Documento,
        Direccion : datosCliente.Direccion,
        Celular : datosCliente.Celular,
        PendienteAPagar : PendienteAPagar,
    })
    await nuevaNotaPago.save()
    res.send(JSON.stringify(Recibo))
})


router.get('/ver-nota-de-pago/:id',  isAuthenticatedDuroc ,async (req, res) => {
    let notaPago = await notasPagoDB.findOne({Recibo: req.params.id})
    if(notaPago.Estado == "Anulada"){
        notaPago ={
            Fecha: notaPago.Fecha,
            Timestamp: notaPago.Timestamp,
            Recibo: notaPago.Recibo,
            Anulada: "Si",
            Transaccion: notaPago.Transaccion,
            Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(notaPago.Monto),
            Modalidad: notaPago.Modalidad,
            Comentario: notaPago.Comentario,
            Cliente: notaPago.Cliente,
            Documento: notaPago.Documento,
            Direccion: notaPago.Direccion,
            Celular: notaPago.Celular,
            PendienteAPagar: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(notaPago.PendienteAPagar),
            Facturas: notaPago.Facturas.map((data2) => {
                return{
                    NotaEntrega: data2.NotaEntrega,
                    Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data2.Monto),
                    SaldoFavor: data2.SaldoFavor,
                    Modalidad: data2.Modalidad,
                    Comentario: data2.Comentario,
                }
            }),
        }
    }else{
        notaPago ={
            Fecha: notaPago.Fecha,
            Timestamp: notaPago.Timestamp,
            Recibo: notaPago.Recibo,
            Transaccion: notaPago.Transaccion,
            Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(notaPago.Monto),
            Modalidad: notaPago.Modalidad,
            Comentario: notaPago.Comentario,
            Cliente: notaPago.Cliente,
            Documento: notaPago.Documento,
            Direccion: notaPago.Direccion,
            Celular: notaPago.Celular,
            PendienteAPagar: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(notaPago.PendienteAPagar),
            Facturas: notaPago.Facturas.map((data2) => {
                return{
                    NotaEntrega: data2.NotaEntrega,
                    Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data2.Monto),
                    SaldoFavor: data2.SaldoFavor,
                    Modalidad: data2.Modalidad,
                    Comentario: data2.Comentario,
                }
            }),
        }
    }
    res.render('admin/archivos_pdf/ver-nota-pago',{
        layout:"reportes.hbs",
        notaPago
    })
})


router.get('/solicitud-devoluciones-clientes', isAuthenticatedFacturacion, async (req, res) => {
    let solitudesDevolucion = await solicitudesDevolucionesDB.find().sort({"Timestamp":-1})
  
    solitudesDevolucion = solitudesDevolucion.map((data) => {
        return{
            Fecha: data.Fecha,
            Timestamp: data.Timestamp,
            Cliente: data.Cliente,
            Vendedor: data.Vendedor,
            _idVendedor: data._idVendedor,
            CantidadTotal: data.CantidadTotal,
            PrecioTotal: data.PrecioTotal,
            Estado: data.Estado,
            _id : data._id,
        }
    })
    res.render('admin/facturacion/devolucion',{
        solitudesDevolucion
    })
})

router.get('/ver-detalles-solicitud-devolucion/:id', isAuthenticatedDuroc, async (req, res) => {
    let solicitudesDevolucion = await solicitudesDevolucionesDB.findById(req.params.id)
    solicitudesDevolucion = {
        Fecha: solicitudesDevolucion.Fecha,
        Timestamp: solicitudesDevolucion.Timestamp,
        Cliente: solicitudesDevolucion.Cliente,
        Vendedor: solicitudesDevolucion.Vendedor,
        _idVendedor: solicitudesDevolucion._idVendedor,
        CantidadTotal: solicitudesDevolucion.CantidadTotal,
        PrecioTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(solicitudesDevolucion.PrecioTotal),
        Estado: solicitudesDevolucion.Estado,
        Productos : solicitudesDevolucion.Productos.map((data) => {
            return{
                Codigo: data.Codigo,
                TipoProducto: data.TipoProducto,
                Descripcion: data.Descripcion,
                Cantidad: data.Cantidad,
                PrecioUnidad: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioUnidad),
                PrecioTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotal),
                }
        })
    }
    res.render('admin/archivos_pdf/detalle-solicitud-devolucion',{
        layout: "reportes.hbs",
        solicitudesDevolucion
    })
})


router.get('/procesar-devolucion/:id', isAuthenticatedFacturacion, async (req, res) => {
    let solicitudesDevolucion = await solicitudesDevolucionesDB.findById(req.params.id)
    let productos = await productosDB.find().sort({"Codigo":1})
    productos = productos.map((data) => {
        return{
            Codigo: data.Codigo,
        }
    })

    if(solicitudesDevolucion.Estado == "Pendiente" || solicitudesDevolucion.Estado == "Aceptado en proceso"){
  
        solicitudesDevolucion = {
            Fecha: solicitudesDevolucion.Fecha,
            Timestamp: solicitudesDevolucion.Timestamp,
            Cliente: solicitudesDevolucion.Cliente,
            Vendedor: solicitudesDevolucion.Vendedor,
            _idVendedor: solicitudesDevolucion._idVendedor,
            CantidadTotal: solicitudesDevolucion.CantidadTotal,
            PrecioTotal: solicitudesDevolucion.PrecioTotal,
            _id: solicitudesDevolucion._id,
            Estado: solicitudesDevolucion.Estado,
            Productos : solicitudesDevolucion.Productos.map((data) => {
                return{
                    Codigo: data.Codigo,
                    TipoProducto: data.TipoProducto,
                    Descripcion: data.Descripcion,
                    Cantidad: data.Cantidad,
                    PrecioUnidad:data.PrecioUnidad,
                    PrecioTotal:data.PrecioTotal,
                    }
            })
        }
        let Estados = []
        if(solicitudesDevolucion.Estado == "Pendiente"){
            Estados.push("Pendiente","Aceptado en proceso","Rechazada")
        }
        if(solicitudesDevolucion.Estado == "Aceptado en proceso"){
            Estados.push("Aceptado en proceso","Procesada","Rechazada")
        }
        res.render('admin/facturacion/procesar-solicitud-devoluciones',{
            solicitudesDevolucion,
            productos,
            Estados
        })

    }else{
        req.flash("error", `La solicitud no puede ser procesada porque se encuentra en estado ${solicitudesDevolucion.Estado}`)
        res.redirect('/devolucion')
    }
})


router.post('/solicitar-info-codigo-procesar-devolucion', isAuthenticatedFacturacion, async (req, res) => {
    let {Codigo, Cantidad} = req.body
    let producto = await productosDB.findOne({Codigo: Codigo})
    let data = {
        Cantidad,
        producto 
    }
    res.send(JSON.stringify(data))
})

router.post('/guardar-cambios-solicitud-devolucion', isAuthenticatedFacturacion, async (req, res) => {
    let {_id, CantidadTotal, PrecioTotal, Productos, Estado} = req.body
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

    if(Estado == "Procesada"){
        /**
         * Procesamos la orden y realizamos el pago de las facturas abiertas correspondientes
         * De quedar saldo a favor del cliente se lo sumamos
         */
         await solicitudesDevolucionesDB.findByIdAndUpdate(_id,{
            CantidadTotal,
            PrecioTotal,
            Productos,
            Estado
        })
        let solicitud = await solicitudesDevolucionesDB.findById(_id)
        let notasEntrega = await notasEntregaDB.find({$and: [{Cliente: solicitud.Cliente}, {Estado: "Por pagar"}]}).sort({"Numero":1})
        let notasDevolucion = await notasDevolucionDB.find().sort({"Timestamp": -1})
        let datosCliente = await clientesDB.findOne({Empresa: solicitud.Cliente})
        let Recibo = 0
        if(notasDevolucion.length == 0){
            Recibo = 300000001
        }else{
            Recibo = +notasDevolucion[0].Recibo + 1
        }
        for(i=0; i< Productos.length; i++){
            let item = await productosDB.findOne({Codigo: Productos[i].Codigo}) 
            let cantidadNueva = +item.Cantidad + +Productos[i].Cantidad
            let HistorialMovimiento = {
                FechaMovimiento : Fecha,
                CantidadAnterior : item.Cantidad,
                CantidadMovida : Productos[i].Cantidad,
                CantidadNueva : cantidadNueva,
                Comentario : `Carga por devolucion #${Recibo}`,
                Timestamp : Timestamp,
                TipoMovimiento : "Carga",
            }
            await productosDB.findByIdAndUpdate(item._id,{
                Cantidad: cantidadNueva,
                $push: {HistorialMovimiento: HistorialMovimiento}
            })
        }

        let nuevaDevolucion = new notasDevolucionDB({
            Fecha: Fecha,
            Timestamp: Timestamp,
            Recibo: Recibo,
            Cliente: solicitud.Cliente,
            Vendedor: datosCliente.Vendedor,
            Solicitud: "Solicitud",
            _idVendedor: datosCliente._idVendedor,
            Documento: datosCliente.RIF,
            Direccion: datosCliente.Direccion,
            Celular: datosCliente.Celular,
            Titulo: `Nota de devolucion #${Recibo}`,
            CantidadTotal: CantidadTotal,
            PrecioTotal: PrecioTotal,
            Productos: Productos,
        }) 
        await nuevaDevolucion.save()
        let deudaCliente = 0
        for(i=0; i< notasEntrega.length; i++){
            deudaCliente += +notasEntrega[i].Saldo
        }
        if(+deudaCliente > +PrecioTotal){
            let precioTotalRestar = +PrecioTotal
            //Cerramos las facturas que sumen el precio total
            for(i=0; i< notasEntrega.length; i++){
                if(+precioTotalRestar > 0){
                    if(+notasEntrega[i].Saldo > +precioTotalRestar){
                        let Porcentaje = notasEntrega[i].PorcentajeGanancia
                        if(Porcentaje.length == 2){
                            Porcentaje = `0.${Porcentaje}`
                        }else{
                            Porcentaje = `0.0${Porcentaje}`
                        }
                        let nuevoTotal = (+notasEntrega[i].Neto - +precioTotalRestar).toFixed(2)
                        let nuevasGanancias = (+nuevoTotal * +Porcentaje).toFixed(2)
                        //abono de precioTotalRestar
                        let nuevoSaldo =  (+notasEntrega[i].Saldo - +precioTotalRestar).toFixed(2)
                        let HistorialPago = {
                            Pago: precioTotalRestar, 
                            Comentario: `Solicitud de devolución procesada`, 
                            Recibo: Recibo, 
                            Modalidad: "Devolución", 
                            FechaPago: Fecha, 
                            Timestamp: Timestamp,   
                        }
                        await notasEntregaDB.findByIdAndUpdate(notasEntrega[i]._id,{
                            GananciasVendedor: nuevasGanancias,
                            Saldo: nuevoSaldo,
                            $push : {HistorialPago: HistorialPago}
                        })
                        precioTotalRestar = 0
                    }else{
                        //pagoCompleto
                        let HistorialPago = {
                            Pago: notasEntrega[i].Saldo, 
                            Comentario: `Solicitud de devolución procesada`, 
                            Recibo: Recibo, 
                            Modalidad: "Devolución", 
                            FechaPago: Fecha, 
                            Timestamp: Timestamp, 
                        }
                        await notasEntregaDB.findByIdAndUpdate(notasEntrega[i]._id,{
                            Saldo: 0,
                            GananciasVendedor: 0,
                            Estado: "Cerrada",
                            $push : {HistorialPago: HistorialPago}
                        })
                        precioTotalRestar -= +notasEntrega[i].Saldo
                    }
                }
            }
            res.send(JSON.stringify(Recibo))

        }else{
            //Cerramos todas las facturas y sumamos saldo a favor del cliente
            let precioTotalRestar = +PrecioTotal
            //Cerramos las facturas que sumen el precio total
            for(r=0; r< notasEntrega.length; r++){
                let HistorialPago = {
                    Pago: notasEntrega[r].Saldo, 
                    Comentario: `Solicitud de devolución procesada`, 
                    Recibo: Recibo, 
                    Modalidad: "Devolución", 
                    FechaPago: Fecha, 
                    Timestamp: Timestamp, 
                }
                await notasEntregaDB.findByIdAndUpdate(notasEntrega[r]._id,{
                    Saldo: 0,
                    Estado: "Cerrada",
                    GananciasVendedor: 0,
                    $push : {HistorialPago: HistorialPago}
                })
            }
            let saldoFavorIncluir = (+precioTotalRestar - +deudaCliente).toFixed(2)
            let saldoCliente = await clientesDB.findOne({Empresa: solicitud.Cliente})
            let SaldoFavor = (+saldoCliente.SaldoFavor + +saldoFavorIncluir).toFixed(2)
            if(+SaldoFavor > 0){
                let HistorialSaldoFavor = {
                    Modalidad: "Devolución", 
                    Numero: Recibo,
                    Monto: saldoFavorIncluir, 
                }
                await clientesDB.findByIdAndUpdate(saldoCliente._id,{
                    SaldoFavor: SaldoFavor,
                    $push : {HistorialSaldoFavor: HistorialSaldoFavor}
                })
            }else{
                await clientesDB.findByIdAndUpdate(saldoCliente._id,{
                    SaldoFavor: SaldoFavor,
                })
            }
            res.send(JSON.stringify(Recibo))
        }
    }else{
        //Actualizamos la orden con el nuevo estado, cantidad, precio y productos
        await solicitudesDevolucionesDB.findByIdAndUpdate(_id,{
            CantidadTotal,
            PrecioTotal,
            Productos,
            Estado
        })
        res.send(JSON.stringify("ok"))
    }
})


router.get('/ver-recibo-devolucion/:id', isAuthenticatedDuroc, async (req, res) => {
    let notaDevolucion = await notasDevolucionDB.findOne({Recibo:req.params.id})
    if(notaDevolucion.Estado == "Anulada"){
        notaDevolucion = {
            Fecha: notaDevolucion.Fecha,
            Timestamp: notaDevolucion.Timestamp,
            Recibo: notaDevolucion.Recibo,
            Cliente: notaDevolucion.Cliente,
            Vendedor: notaDevolucion.Vendedor,
            Anulada: "Si",
            _idVendedor: notaDevolucion._idVendedor,
            Documento: notaDevolucion.Documento,
            Direccion: notaDevolucion.Direccion,
            Celular: notaDevolucion.Celular,
            Titulo: notaDevolucion.Titulo,
            CantidadTotal: notaDevolucion.CantidadTotal,
            PrecioTotal: notaDevolucion.PrecioTotal,
            Productos: notaDevolucion.Productos.map((data) => {
                return{
                    Codigo: data.Codigo,
                    TipoProducto: data.TipoProducto,
                    Descripcion: data.Descripcion,
                    PrecioUnidad: data.PrecioUnidad,
                    Cantidad: data.Cantidad,
                    PrecioTotal: data.PrecioTotal,
                }
            }),
        }
    }else{
        notaDevolucion = {
            Fecha: notaDevolucion.Fecha,
            Timestamp: notaDevolucion.Timestamp,
            Recibo: notaDevolucion.Recibo,
            Cliente: notaDevolucion.Cliente,
            Vendedor: notaDevolucion.Vendedor,
            _idVendedor: notaDevolucion._idVendedor,
            Documento: notaDevolucion.Documento,
            Direccion: notaDevolucion.Direccion,
            Celular: notaDevolucion.Celular,
            Titulo: notaDevolucion.Titulo,
            CantidadTotal: notaDevolucion.CantidadTotal,
            PrecioTotal: notaDevolucion.PrecioTotal,
            Productos: notaDevolucion.Productos.map((data) => {
                return{
                    Codigo: data.Codigo,
                    TipoProducto: data.TipoProducto,
                    Descripcion: data.Descripcion,
                    PrecioUnidad: data.PrecioUnidad,
                    Cantidad: data.Cantidad,
                    PrecioTotal: data.PrecioTotal,
                }
            }),
        }
    }
    res.render('admin/archivos_pdf/ver-nota-devolucion',{
        layout:"reportes.hbs",
        notaDevolucion
    })
})


router.get('/rechazar-solicitud-devolucion/:id', isAuthenticatedFacturacion, async (req, res) => {
    await solicitudesDevolucionesDB.findByIdAndUpdate(req.params.id,{
        Estado:"Rechazada"
    })
    req.flash("success", "Solicitud de devolución rechazada correctamente")
    res.redirect('/solicitud-devoluciones-clientes')
})
router.get('/redireccion-confirmada-solicitudes-devolucion', isAuthenticatedFacturacion, async (req, res) => {
    req.flash("success", "Cambio de estado de la solicitud de devolución procesado correctamente")
    res.redirect('/solicitud-devoluciones-clientes')
})


router.get('/realizar-devolucion', isAuthenticatedFacturacion, async (req, res) => {
    let notasEntregas = await notasEntregaDB.find({Estado:"Por pagar"}).sort({"Cliente": 1})
    let clientes = []
    for(i=0; i< notasEntregas.length;i++){
        let validacion = clientes.find((data) => data == notasEntregas[i].Cliente)
        if(!validacion){
            clientes.push(notasEntregas[i].Cliente)
        }
    }
    res.render('admin/facturacion/realizar-devolucion',{
        clientes
    })
})


router.post('/solicitar-notas-cliente-devolucion', isAuthenticatedFacturacion, async (req, res) => {
    let {Cliente} = req.body
    let notasEntregas = await notasEntregaDB.find({$and:[{Cliente: Cliente},{ Estado:"Por pagar"}]}).sort({Numero: 1})
    res.send(JSON.stringify(notasEntregas))
})

router.post('/solicitar-codigos-nota-devolucion', isAuthenticatedFacturacion, async (req, res) => {
    let {Numero} = req.body
    let nota = await notasEntregaDB.findOne({Numero: Numero})
    res.send(JSON.stringify(nota))
})


router.post('/generar-devolucion-manual', isAuthenticatedFacturacion, async (req, res) => {
    let {Cliente, Nota, PrecioTotal, CantidadTotal, Productos} = req.body
    let nota = await notasEntregaDB.findOne({Numero:Nota})
    let cliente = await clientesDB.findOne({Empresa: Cliente})
    let notasDevolucion = await notasDevolucionDB.find().sort({"Timestamp": -1})
    let Recibo = 0
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
    if(notasDevolucion.length == 0){
        Recibo = 300000001
    }else{
        Recibo = +notasDevolucion[0].Recibo + 1
    }
    for(i=0; i< Productos.length; i++){
        let item = await productosDB.findOne({Codigo: Productos[i].Codigo}) 
        let cantidadNueva = +item.Cantidad + +Productos[i].Cantidad
        let HistorialMovimiento = {
            FechaMovimiento : Fecha,
            CantidadAnterior : item.Cantidad,
            CantidadMovida : Productos[i].Cantidad,
            CantidadNueva : cantidadNueva,
            Comentario : `Carga por devolucion #${Recibo}`,
            Timestamp : Timestamp,
            TipoMovimiento : "Carga",
        }
        await productosDB.findByIdAndUpdate(item._id,{
            Cantidad: cantidadNueva,
            $push: {HistorialMovimiento: HistorialMovimiento}
        })
    }
    let Porcentaje = nota.PorcentajeGanancia
    if(Porcentaje.length == 2){
        Porcentaje = `0.${Porcentaje}`
    }else{
        Porcentaje = `0.0${Porcentaje}`

    }
    let nuevoTotal = (+nota.Neto - +PrecioTotal).toFixed(2)


    let nuevaDevolucion = new notasDevolucionDB({
        Fecha: Fecha,
        Timestamp: Timestamp,
        Recibo: Recibo,
        Cliente: Cliente,
        Vendedor: cliente.Vendedor,
        TipoDeNota: "Manual",
        NotaEntrega: Nota,
        _idVendedor: cliente._idVendedor,
        Documento: cliente.RIF,
        Direccion: cliente.Direccion,
        Celular: cliente.Celular,
        Titulo: `Nota de devolucion #${Recibo}`,
        CantidadTotal: CantidadTotal,
        PrecioTotal: PrecioTotal,
        Productos: Productos,
    }) 
    await nuevaDevolucion.save()
    let HistorialPago = {
        Pago: PrecioTotal, 
        Comentario: `Devolución manual procesada`, 
        Recibo: Recibo, 
        Modalidad: "Devolución", 
        FechaPago: Fecha, 
        Timestamp: Timestamp, 
    }
    if(+nota.Saldo >= +PrecioTotal){
        //realizamos devolucion  restandole saldo a la nota
        let saldoNuevo = (+nota.Saldo - +PrecioTotal).toFixed(2)
        if(saldoNuevo == 0){
            await notasEntregaDB.findByIdAndUpdate(nota._id,{
                Estado: "Cerrada",
                GananciasVendedor: 0,
                Saldo: 0,
                $push : {HistorialPago: HistorialPago}
            }) 

        }else{
            let nuevaGananciaVendedor = (+nuevoTotal * +Porcentaje).toFixed(2)
            await notasEntregaDB.findByIdAndUpdate(nota._id,{
                GananciasVendedor: nuevaGananciaVendedor, 
                Saldo: saldoNuevo,
                $push : {HistorialPago: HistorialPago}
            })
        }
    }else{
        //realizamos devolucion dejando el saldo en 0 y sumando saldo a favor al cliente 
        let saldoFavor = +PrecioTotal - +nota.Saldo
        let saldoFavorUnitario = +PrecioTotal - +nota.Saldo
        saldoFavor = (+cliente.SaldoFavor + +saldoFavor).toFixed(2)
        await notasEntregaDB.findByIdAndUpdate(nota._id,{
            Estado: "Cerrada",
            Saldo: 0,
            $push : {HistorialPago: HistorialPago}
        }) 
        if(+saldoFavor > 0){
            let HistorialSaldoFavor = {
                Modalidad: "Devolución",
                Monto:saldoFavorUnitario,
            }
            await clientesDB.findByIdAndUpdate(cliente._id,{
                SaldoFavor : saldoFavor,
                Numero: Recibo,
                $push : {HistorialSaldoFavor: HistorialSaldoFavor}
            })
        }else{
            await clientesDB.findByIdAndUpdate(cliente._id,{
                SaldoFavor : saldoFavor
            })
        }
    }
    res.send(JSON.stringify(Recibo))

})

router.get('/devoluciones', isAuthenticatedFacturacion, async (req, res) => {
    let devoluciones = await notasDevolucionDB.find().sort({Recibo : -1})
    devoluciones = devoluciones.map((data) => {
        return{
            Fecha: data.Fecha,
            Timestamp: data.Timestamp,
            Recibo: data.Recibo,
            Estado: data.Estado,
            Cliente: data.Cliente,
            Vendedor: data.Vendedor,
            _idVendedor: data._idVendedor,
            Documento: data.Documento,
            Direccion: data.Direccion,
            Celular: data.Celular,
            Titulo: data.Titulo,
            CantidadTotal: data.CantidadTotal,
            PrecioTotal: data.PrecioTotal,
        }
    })
    res.render('admin/facturacion/devoluciones',{
        devoluciones
    })

})

router.post('/generar-factura-de-nota/:id', isAuthenticatedFacturacion,async (req, res) => {
    let {NumeroControl} = req.body
    let notaEntrega = await notasEntregaDB.findById(req.params.id)
    if(notaEntrega.Estado != "Por pagar"){
        req.flash("error", 'La nota se encuentra en un estado cerrado. Por favor, valide e intente de nuevo.')
        res.redirect('/todas-las-notas')
    }else{
        let cambio = await cambioFacturacionDB.find()
        if(cambio.length == 0){
            req.flash("error", 'No hay un monto de cambio registrado. Por favor, valide e intente de nuevo.')
            res.redirect('/todas-las-notas')
        }else{
            let validacionExisteControl = await facturasDB.findOne({NumeroControl: NumeroControl})
            if(validacionExisteControl){
                req.flash("error", `El número de control "${NumeroControl}" ya se encuentra registrado en la factura #${validacionExisteControl.NumeroFactura}`)
                res.redirect('/todas-las-notas')

            }else{
                let notaFacturada = await facturasDB.findOne({NumeroNota: notaEntrega.Numero})
                if(notaFacturada){
                    req.flash("error", `La nota de entrega ya tiene una factura asociada con el número #${notaFacturada.NumeroFactura}. Por favor, valide e intente de nuevo.`)
                    res.redirect('/todas-las-notas')
                }else{
                    let NumeroFactura = 20200000001
                    let facturas = await facturasDB.find().sort({"Timestamp":-1})
                    if(facturas.length > 0){
                        NumeroFactura = +facturas[0].NumeroFactura + 1
                    }
                    let transporte = await transporteDB.findOne({Empresa: notaEntrega.Transporte})
                    let NetoBS = ((+notaEntrega.Neto + notaEntrega.Iva) * +cambio[0].Cambio).toFixed(2)
                    let tarifa = transporte.Tarifario.find((data) => data.Ciudad ==  notaEntrega.Zona)
                    tarifa = tarifa.Porcentaje
                    let factorTarifa = 0
                    if(+tarifa < 10){
                        factorTarifa = `0.0${tarifa}`
                    }else{
                        factorTarifa = `0.${tarifa}`
                    }
                    let PrecioPagarTarifa = (+NetoBS * +factorTarifa).toFixed(2)
                    let PrecioTarifaUSD = (+PrecioPagarTarifa / +cambio[0].Cambio).toFixed(2)
        
                    let Productos = []
                     
                    await notasEntregaDB.findByIdAndUpdate(req.params.id,{
                        Factura: NumeroFactura,
                        Control: NumeroControl,
                    })
        
                    for(i=0; i< notaEntrega.Productos.length; i++){
                        let PrecioUnidadBS = (+notaEntrega.Productos[i].PrecioUnidad * +cambio[0].Cambio).toFixed(2)
                        let PrecioTotalBS = (+notaEntrega.Productos[i].PrecioTotal * +cambio[0].Cambio).toFixed(2)
                        let subdata= {
                            Codigo: notaEntrega.Productos[i].Codigo,
                            Producto: notaEntrega.Productos[i].Producto,
                            Descripcion: notaEntrega.Productos[i].Descripcion,
                            Cantidad: notaEntrega.Productos[i].Cantidad,
                            PrecioUnidadUSD: notaEntrega.Productos[i].PrecioUnidad,
                            PrecioUnidadBS: PrecioUnidadBS,
                            PrecioTotalUSD: notaEntrega.Productos[i].PrecioTotal,
                            PrecioTotalBS: PrecioTotalBS,
                        }
                        Productos.push(subdata) 
                    }
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
                    if(notaEntrega.Zona != "Valencia"){
                        let nuevaTareaAdmin = new tareasDB({
                            Timestamp: Timestamp,
                            user: req.user.email,
                            TipoTarea: "Transporte",
                            Empresa: `${req.user.Nombres} ${req.user.Apellidos}`,
                            Nombres: req.user.Nombres,
                            Apellidos:  req.user.Apellidos,
                            Documento:  req.user.Cedula,
                            NotaEntrega: NumeroFactura,
                            TipoUsuario: "Administrativo",
                            _idPersona: req.user._id,
                            FechaEntrega: notaEntrega.Vencimiento,
                            Fecha:Fecha ,
                            Descripcion: `Pago a transporte `,
                        })
                        await nuevaTareaAdmin.save()
                    }
                    let DescuentoBS = (+cambio[0].Cambio * +notaEntrega.Descuento).toFixed(2) 
                    let BaseImponibleBS = (+cambio[0].Cambio * +notaEntrega.BaseImponible).toFixed(2) 
                    let IvaBS = (+cambio[0].Cambio * +notaEntrega.Iva).toFixed(2) 
                    let TotalSinDescuentoBS = (+cambio[0].Cambio * +notaEntrega.TotalSinDescuento).toFixed(2) 
                    let nuevaFactura = new facturasDB({
                        Timestamp: notaEntrega.Timestamp, 
                        Fecha: notaEntrega.Fecha, 
                        Vencimiento: notaEntrega.Vencimiento, 
                        Cambio: cambio[0].Cambio, 
                        NumeroFactura: NumeroFactura, 
                        NumeroNota: notaEntrega.Numero, 
                        NumeroControl: NumeroControl, 
                        Cliente: notaEntrega.Cliente, 
                        Documento: notaEntrega.Documento,
                        DescuentoBS:DescuentoBS,
                        BaseImponibleBS:BaseImponibleBS,
                        IvaBS:IvaBS,
                        TotalSinDescuentoBS:TotalSinDescuentoBS, 
                        Direccion: notaEntrega.Direccion, 
                        Celular: notaEntrega.Celular, 
                        Zona: notaEntrega.Zona, 
                        NetoUSD: notaEntrega.Neto, 
                        NetoBS: NetoBS, 
                        CantidadTotal: notaEntrega.CantidadTotal, 
                        Vendedor: notaEntrega.Vendedor, 
                        _idVendedor: notaEntrega._idVendedor, 
                        Estado: notaEntrega.Estado, 
                        Transporte: notaEntrega.Transporte, 
                        PrecioTarifaUSD: PrecioTarifaUSD, 
                        PrecioTarifaBS: PrecioPagarTarifa, 
                        EstadoTarifa: notaEntrega.EstadoTarifa, 
                        Productos:Productos, 
                    })
                    let notaTransporte = 0
                    let notasTransporte = await notastransporteDB.find().sort({"Timestamp":-1})
                    if(notasTransporte.length == 0){
                        notaTransporte = 1000000001
                    }else{
                        notaTransporte = +notasTransporte[0].NumeroNota + 1
                    }
                    if(notaEntrega.Zona != "Valencia"){
                        let nuevoNotaTransporte = new notastransporteDB({
                            Timestamp: notaEntrega.Timestamp,
                            Fecha: notaEntrega.Fecha,
                            EmpresaTransporte:notaEntrega.Transporte,
                            NumeroFactura: NumeroFactura,
                            NumeroNota: notaTransporte,
                            CambioBolivares: cambio[0].Cambio,
                            PrecioTotalFactura: notaEntrega.Neto,
                            PrecioTotalFacturaBS: NetoBS,
                            Zona: notaEntrega.Zona,
                            Tarifa: tarifa.Porcentaje,
                            PrecioPagar: PrecioPagarTarifa,
                        })
                        await nuevoNotaTransporte.save()
                    }
                    await nuevaFactura.save()
                    res.redirect(`/ver-factura/${NumeroFactura}`)
                }
            }


        }
    }
})

router.post('/solicitar-garantia-saldo-favor', isAuthenticatedDuroc, async (req, res) => {
    let {Cliente} = req.body
    let cliente = await clientesDB.findById(Cliente)
    let garantia = await garantiasDB.find({$and: [{Cliente:cliente.Empresa},{Estado: "Por aplicar"}]})
    let data
    if(garantia.length == 0){
        if(cliente.SaldoFavor == 0 || !cliente.SaldoFavor){
            data= {
                Garantia: false,
                SaldoFavor: false
            }
        }else{
            data= {
                Garantia: false,
                SaldoFavor: cliente.SaldoFavor
            }
        }
    }else{
        let codigos = []
        for(i=0; i< garantia.length; i++){
            let producto = await productosDB.findOne({Codigo: garantia[i].Codigo})
            if(+producto.Cantidad >= +garantia[i].Cantidad){
                let data = {
                    Codigo: garantia[i].Codigo,
                    PrecioUnidad: producto.PrecioVenta,
                    Cantidad: garantia[i].Cantidad,
                    PrecioTotal: 0,
                    PrecioTotal2: 0,
                }
                codigos.push(data)
            }
        }

        if(cliente.SaldoFavor == 0 || !cliente.SaldoFavor){
            if(codigos.length > 0){
                data= {
                    Garantia: codigos,
                    SaldoFavor: false
                }
            }else{
                data= {
                    Garantia: false,
                    SaldoFavor: false
                }
            }
        }else{
            if(codigos.length> 0){

                data= {
                    Garantia: codigos,
                    SaldoFavor: cliente.SaldoFavor
                }
            }else{
                data= {
                    Garantia: false,
                    SaldoFavor: cliente.SaldoFavor
                }
            }
        }
    }
    res.send(JSON.stringify(data))
})


router.post('/solicitar-solicitudes-por-estado',isAuthenticatedDuroc,  async (req, res) => {
    let {Estado} = req.body
    let solitudesDevolucion = await solicitudesDevolucionesDB.find({Estado:Estado}).sort({"Timestamp":-1})
    res.send(JSON.stringify(solitudesDevolucion))
})


router.get('/anulacion-documentos', isAuthenticatedFacturacion, async (req, res) => {
    res.render('admin/facturacion/anulacion')
})

router.post('/solicitar-tipo-documentos-anulacion', isAuthenticatedFacturacion, async (req, res) => {
    let {TipoDocumento} = req.body
    let data
    if(TipoDocumento == "NotaEntrega" ){
        let notas = await notasEntregaDB.find({Estado:"Por pagar"}).sort({"Numero":1})
        notas = notas.map((data) => {
            return{
                Numero: data.Numero
            }
        })
        data = notas
    }
    if(TipoDocumento == "NotaDevolucion"){
        let notasDevoluciones = await notasDevolucionDB.find({$and : [{TipoDeNota:"Manual"},{Estado: "Procesada"}]}).sort({Recibo: 1})
        notasDevoluciones = notasDevoluciones.map((data) => {
            return{
                Numero: data.Recibo
            }
        })
        data = notasDevoluciones
    }
    if(TipoDocumento == "NotaPago"){
        let notasPagos = await notasPagoDB.find({Estado: {$ne: "Anulada"}}).sort({Recibo: 1})
        notasPagos = notasPagos.map((data) => {
            return{
                Numero: data.Recibo
            }
        })
        data = notasPagos
    }
    if(TipoDocumento == "Factura"){
        let facturas = await facturasDB.find({Estado: {$ne: "Anulada"}}).sort({NumeroFactura: 1})
        facturas = facturas.map((data) => {
            return{
                Numero: data.NumeroFactura
            }
        })
        data = facturas
    }

    res.send(JSON.stringify(data))
})


router.post('/anular-documentos', isAuthenticatedFacturacion, async (req, res) => {
    let {TipoDocumento, NumeroDocumento} = req.body
    let Fecha = new Date();
    let Timestamp = Date.now();
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
    if(TipoDocumento ==  "NotaEntrega"){
        //anulamos nota, pasamos a Anulada la nota, pasamos saldo a 0 y gananciasVendedor a 0
        //Ingresamos a stock los codigos
        let nota = await notasEntregaDB.findOne({Numero: NumeroDocumento})
        for(i=0; i < nota.Productos.length; i++){
            let producto = await productosDB.findOne({Codigo: nota.Productos[i].Codigo})
            let CantidadNueva = +producto.Cantidad + +nota.Productos[i].Cantidad
            let HistorialMovimiento = {
                FechaMovimiento : Fecha,
                CantidadAnterior : producto.Cantidad,
                CantidadMovida : nota.Productos[i].Cantidad,
                CantidadNueva : CantidadNueva,
                Comentario : `Carga por anulación de nota de entrega #${NumeroDocumento}`,
                Timestamp : Timestamp,
                TipoMovimiento : "Carga",
            }
            await productosDB.findByIdAndUpdate(producto._id,{
                Cantidad: CantidadNueva,
                $push: {HistorialMovimiento:HistorialMovimiento}
            })
        }
        await notasEntregaDB.findByIdAndUpdate(nota._id,{
            Estado: "Anulada",
            GananciasVendedor: 0,
            Saldo: 0,
        })
    }
    if(TipoDocumento == "NotaDevolucion"){
        //anulamos nota de devolucion manual y no por solicitud. 
        //Retornamos el valor de la devolucion a saldo y abrimos la nota de entrega de estar cerrada 
        //Descargamos de stock
        //Recalculamos ganancia vendedor
        let nota = await notasDevolucionDB.findOne({Recibo: NumeroDocumento})
        let notaEntrega = await notasEntregaDB.findOne({Numero: nota.NotaEntrega})
        for(i=0; i< nota.Productos.length; i++){
            let producto = await productosDB.findOne({Codigo: nota.Productos[i].Codigo})
            let CantidadNueva = +producto.Cantidad - +nota.Productos[i].Cantidad
            let HistorialMovimiento = {
                FechaMovimiento : Fecha,
                CantidadAnterior : producto.Cantidad,
                CantidadMovida : nota.Productos[i].Cantidad,
                CantidadNueva : CantidadNueva,
                Comentario : `Descarga por anulación de nota de devolución #${NumeroDocumento}`,
                Timestamp : Timestamp,
                TipoMovimiento : "Descarga",
            }
            await productosDB.findByIdAndUpdate(producto._id,{
                Cantidad: CantidadNueva,
                $push: {HistorialMovimiento:HistorialMovimiento}
            })

        }
        let Porcentaje = notaEntrega.PorcentajeGanancia
        if(Porcentaje.length == 2){
            Porcentaje = `0.${Porcentaje}`
        }else{
            Porcentaje = `0.0${Porcentaje}`
        }
        let Saldo = (+notaEntrega.Saldo + +nota.PrecioTotal).toFixed(2)
        let GananciasVendedor = (+notaEntrega.Neto * +Porcentaje).toFixed(2)
        await notasEntregaDB.findByIdAndUpdate(notaEntrega._id,{
            Estado: "Por pagar",
            EstadoComision: "Por pagar",
            GananciasVendedor:GananciasVendedor,
            Saldo: Saldo
        })
        await notasDevolucionDB.findByIdAndUpdate(nota._id,{
            Estado: "Anulada"
        })
    }
    if(TipoDocumento == "NotaPago"){
        //anulamos la nota de pago y retornamos el valor pagado a todas las notas, abriendo las que estan cerradas
        let notaPago = await notasPagoDB.findOne({Recibo: NumeroDocumento})
        for(i=0; i< notaPago.Facturas.length; i++){
            let notaEntrega = await notasEntregaDB.findOne({Numero: notaPago.Facturas[i].NotaEntrega})
            let Saldo = (+notaEntrega.Saldo + +notaPago.Facturas[i].Monto).toFixed(2) 
            await notasEntregaDB.findByIdAndUpdate(notaEntrega._id,{
                Saldo: Saldo,
                Estado: "Por pagar"
            })
        }
        await notasPagoDB.findByIdAndUpdate(notaPago._id,{
            Estado: "Anulada"
        })
    }
    if(TipoDocumento == "Factura"){
        let factura = await facturasDB.findOne({NumeroFactura: NumeroDocumento})
        await facturasDB.findByIdAndUpdate(factura._id,{
            Estado: "Anulada"
        })
    }
    req.flash("success","Documento anulado correctamente")
    res.redirect('/anulacion-documentos')
})


router.post('/eliminar-cliente/:id', isAuthenticatedCliente, async (req, res) => {
    let cliente = await clientesDB.findById(req.params.id)
    let usuario = await usersDB.findOne({email: cliente.email})
    if(usuario){
        await usuario.findByIdAndDelete(usuario._id)
        await clientesDB.findByIdAndDelete(cliente._id)
    }else{
        await clientesDB.findByIdAndDelete(cliente._id)
    }
    req.flash("success", "Cliente eliminado correctamente")
    res.redirect('/directorio-clientes')
})


router.post('/eliminar-vendedor/:id', isAuthenticatedVendedor, async (req, res) => {
    let vendedor = await vendedoresDB.findById(req.params.id)
    let usuario = await usersDB.findOne({email: vendedor.email})
    if(usuario){
        await usersDB.findByIdAndDelete(usuario._id)
        await vendedoresDB.findByIdAndDelete(vendedor._id)
    }else{
        await vendedoresDB.findByIdAndDelete(vendedor._id)
    }
    req.flash("success", "Vendedor eliminado correctamente")
    res.redirect('/directorio-vendedores')
})

router.post('/eliminar-transporte/:id', isAuthenticatedTransporte, async (req, res) => {
    let transporte = await transporteDB.findByIdAndDelete(req.params.id)
    req.flash("success", "Transporte eliminado correctamente")
    res.redirect('/directorio-transporte')
})


router.post('/eliminar-proveedor/:id', isAuthenticatedProveedor, async (req, res) => {
    await proveedorDB.findByIdAndDelete(req.params.id)
    req.flash("success", "Proveedor eliminada correctamente")
    res.redirect('/directorio-proveedores')
})

router.post('/eliminar-producto/:id', isAuthenticatedInventario, async (req, res) => {
    let producto = await productosDB.findById(req.params.id)
    if(producto.TipoProducto == "Amortiguador"){
        let amortiguador = await amortiguadoresDB.findOne({Codigo:producto.Codigo})
        await productosDB.findByIdAndDelete(req.params.id)
        await amortiguadoresDB.findByIdAndDelete(amortiguador._id)
    }
    if(producto.TipoProducto == "Bateria"){
        let bateria = await bateriasDB.findOne({Codigo: producto.Codigo})
        await productosDB.findByIdAndDelete(req.params.id)
        await bateriasDB.findByIdAndDelete(bateria._id)
    }
    if(producto.TipoProducto == "Bomba"){
        let bomba = await bombasDB.findOne({Codigo: producto.Codigo})
        await productosDB.findByIdAndDelete(req.params.id)
        await bombasDB.findByIdAndDelete(bomba._id)
    
    }
    if(producto.TipoProducto == "Base amortiguador"){
        let base = await baseAmortiguadoresDB.findOne({Codigo: producto.Codigo})
        await productosDB.findByIdAndDelete(req.params.id)
        await baseAmortiguadoresDB.findByIdAndDelete(base._id)
    }
    if(producto.TipoProducto == "Guardapolvo"){
        let guardapolvo = await guardapolvosDB.findOne({Codigo: producto.Codigo})
        await productosDB.findByIdAndDelete(req.params.id)
        await guardapolvosDB.findByIdAndDelete(guardapolvo._id)
    
    }
    if(producto.TipoProducto == "Valvula"){
        let valvula = await valvulasDB.findOne({Codigo: producto.Codigo})
        await productosDB.findByIdAndDelete(req.params.id)
        await valvulasDB.findByIdAndDelete(valvula._id)
    
    }
    if(producto.TipoProducto == "Bujia"){
        let bujia = await bujiaDB.findOne({Codigo: producto.Codigo})
        await productosDB.findByIdAndDelete(req.params.id)
        await bujiaDB.findByIdAndDelete(bujia._id)
    
    }
    req.flash("success", "Producto eliminado correctamente")
    res.redirect('/directorio-inventario')
})


router.post('/registrar-nuevo-modelo', isAuthenticatedInventario, async (req, res) => {
    let {Nombre} = req.body
    Nombre = Nombre.toUpperCase()
    let validacionModelo = await modelosDB.findOne({Nombre:Nombre})
    if(validacionModelo){
        req.flash("error", "El modelo ya se encuentra registrado")
        res.redirect(req.headers.referer)

    }else{
        let nuevoModelo = new modelosDB({
            Nombre:Nombre
        })
        await nuevoModelo.save()
        req.flash("success", "El modelo fue registrado correctamente")
        res.redirect(req.headers.referer)
    }
})
router.post('/registrar-nueva-marca', isAuthenticatedInventario, async (req, res) => {
    let {Nombre} = req.body
    Nombre = Nombre.toUpperCase()
    let validacionModelo = await marcasDB.findOne({Nombre:Nombre})
    if(validacionModelo){
        req.flash("error", "La marca ya se encuentra registrado")
        res.redirect(req.headers.referer)

    }else{
        let nuevaMarca = new marcasDB({
            Nombre:Nombre
        })
        await nuevaMarca.save()
        req.flash("success", "La marca fue registrado correctamente")
        res.redirect(req.headers.referer)

    }
})



router.get('/ver-usuarios-administrativos', isAuthenticatedUsuariosAdministrativos, async (req, res) => {
    let users = await usersDB.find({TipoUsuario:"AdministrativO"}).sort({"Empresa": 1})
    users = users.map((data) => {
        return{
            Nombres: data.Nombres,
            Apellidos: data.Apellidos,
            Cedula: data.Cedula,
            Empresa: data.Empresa,
            Usuario: data.Usuario,
            TipoUsuario: data.TipoUsuario,
            Role: data.Role,
            email: data.email,
            password: data.password,
            date: data.date,
            _id: data._id,
            Empresa: data.Empresa,
        }
    })
    res.render('admin/usuarios-administrativos',{
        users
    })
    
})


router.get('/ver-usuario-administrativo/:id', isAuthenticatedUsuariosAdministrativos, async (req, res) => {
    let usuario = await usersDB.findById(req.params.id)
    usuario = { 
        Nombres: usuario.Nombres,
        Apellidos: usuario.Apellidos,
        Cedula: usuario.Cedula,
        Empresa: usuario.Empresa,
        Usuario: usuario.Usuario,
        TipoUsuario: usuario.TipoUsuario,
        Role: usuario.Role,
        email: usuario.email,
        password: usuario.password,
        date: usuario.date,
        Empresa: usuario.Empresa,
        _id: usuario._id,      
    }
    res.render('admin/ver-usuario-administrativo',{
        usuario
    })
})


router.post('/eliminar-usuario-administrativo/:id',isAuthenticatedUsuariosAdministrativos,  async (req, res) => {
    await usersDB.findByIdAndDelete(req.params.id)
    req.flash("success","Usuario administrativo eliminado correctamente")
    res.redirect('/ver-usuarios-administrativos')
})

router.post('/actualizar-usuario/:id', isAuthenticatedUsuariosAdministrativos, async (req, res) => {
    let usuario = await usersDB.findById(req.params.id)
    let {Nombres, Apellidos, Cedula, Usuario, Role, email, emailConfirm, password, passwordConfirm} = req.body
    let validacion = 0
    if(!Nombres || Nombres == "" || Nombres== 0){
        req.flash("error",'El campo "Nombres" no puede estar vacío.')
        res.redirect(`/ver-usuario-administrativo/${req.params.id}`)
        validacion++
        return
    }
    if(!Apellidos || Apellidos == "" || Apellidos== 0){
        req.flash("error",'El campo "Apellidos" no puede estar vacío.')
        res.redirect(`/ver-usuario-administrativo/${req.params.id}`)
        validacion++
        return
    }
    if(!Cedula || Cedula == "" || Cedula== 0){
        req.flash("error",'El campo "Cedula" no puede estar vacío.')
        res.redirect(`/ver-usuario-administrativo/${req.params.id}`)
        validacion++

        return
        
    }
    if(!Usuario || Usuario == "" || Usuario== 0){
        req.flash("error",'El campo "Nombre de usuario" no puede estar vacío.')
        res.redirect(`/ver-usuario-administrativo/${req.params.id}`)
        validacion++

        return
    }
    if(!Role || Role == "" || Role== 0){
        req.flash("error",'El campo "Role" no puede estar vacío.')
        res.redirect(`/ver-usuario-administrativo/${req.params.id}`)
        validacion++

        return
    }
    if(!email || email == "" || email== 0){
        req.flash("error",'El campo "Correo electronico" no puede estar vacío.')
        res.redirect(`/ver-usuario-administrativo/${req.params.id}`)
        validacion++

        return
    }
    if(!emailConfirm || emailConfirm == "" || emailConfirm== 0){
        req.flash("error",'El campo "Confirmar correo electronico" no puede estar vacío.')
        res.redirect(`/ver-usuario-administrativo/${req.params.id}`)
        validacion++

        return
    }
    if(!password || password == "" || password== 0){
        req.flash("error",'El campo "Contraseña" no puede estar vacío.')
        res.redirect(`/ver-usuario-administrativo/${req.params.id}`)
        validacion++

        return
    }
    if(password.length < 7){
        req.flash("error",'La contraseña debe incluir minimo 7 caracteres.')
        res.redirect(`/ver-usuario-administrativo/${req.params.id}`)
        validacion++

        return
    }
    if(!passwordConfirm || passwordConfirm == "" || passwordConfirm== 0){
        req.flash("error",'El campo "Confirmar contraseña" no puede estar vacío.')
        res.redirect(`/ver-usuario-administrativo/${req.params.id}`)
        validacion++

        return
    }
    if(email != emailConfirm){
        req.flash("error",'Los correos ingresados no coinciden.')
        res.redirect(`/ver-usuario-administrativo/${req.params.id}`)
        validacion++

        return
    }
    if(password != passwordConfirm){
        req.flash("error",'Las contraseñas ingresadas no coinciden.')
        res.redirect(`/ver-usuario-administrativo/${req.params.id}`)
        validacion++

        return
    }
    if(validacion == 0){
        if(usuario.password == password){
            //actualizamos todos los datos a excepcion de la contraseña
            await usersDB.findByIdAndUpdate(req.params.id,{
                Nombres, 
                Apellidos, 
                Cedula, 
                Usuario, 
                Role, 
                email,
                password
            })
            req.flash("success",'Usuario actualizado correctamente')
            res.redirect(`/ver-usuario-administrativo/${req.params.id}`)

        }else{
            let nuevaContraseña = new usersDB({
                password
            })
            let nuevaPassword = await nuevaContraseña.encryptPassword(password);
            await usersDB.findByIdAndUpdate(req.params.id,{
                Nombres, 
                Apellidos, 
                Cedula, 
                Usuario, 
                Role, 
                email,
                password: nuevaPassword
            })
            req.flash("success",'Usuario actualizado correctamente')
            res.redirect(`/ver-usuario-administrativo/${req.params.id}`)

        }
    }
})

router.get('/solcitudes-de-clientes', isAuthenticatedCliente, async (req, res) => {
    let solicitudesCliente = await solicitudesClientesDB.find().sort()
    solicitudesCliente = solicitudesCliente.map((data) =>{
        return{
            Fecha: data.Fecha,
            Cliente: data.Empresa,
            Direccion: data.Direccion,
            _id: data._id,
            Vendedor: data.Vendedor,
        }
    })
    res.render('admin/clientes/solicitudes-clientes',{
        solicitudesCliente
    })
})

router.get('/ver-ficha-solicitud/:id', isAuthenticatedCliente, async (req, res) => {
    let solicitudes = await solicitudesClientesDB.findById(req.params.id)
    solicitudes = {
        Fecha: solicitudes.Fecha,
        Nombres: solicitudes.Nombres,
        Apellidos: solicitudes.Apellidos,
        Cedula: solicitudes.Cedula,
        Empresa: solicitudes.Empresa,
        RIF: solicitudes.RIF,
        CodigoCeular: solicitudes.CodigoCeular,
        CodigoTelefono: solicitudes.CodigoTelefono,
        Direccion: solicitudes.Direccion,
        Celular: solicitudes.Celular,
        MaximoCredito: solicitudes.MaximoCredito,
        Telefono: solicitudes.Telefono,
        email: solicitudes.email,
        Zona: solicitudes.Zona,
        CodigoPostal: solicitudes.CodigoPostal,
        Vendedor: solicitudes.Vendedor,
        SaldoFavor: solicitudes.SaldoFavor,
        _idVendedor: solicitudes._idVendedor,
        _id: solicitudes._id,
    }
    res.render('admin/clientes/aprobar-cliente',{
        solicitudes
    })
})

router.post('/rechazar-solicitud/:id', isAuthenticatedCliente, async (req, res) =>{ 
    await solicitudesClientesDB.findByIdAndDelete(req.params.id)
    req.flash('success', "Solicitud de aprobacion de cliente rechazada correctamente.")
    res.redirect('/solcitudes-de-clientes')
})


router.post('/registrar-nueva-ciudad', isAuthenticatedTransporte, async (req, res) => {
    let {Nombre} = req.body
    let nuevaCiudad = new ciudadesDB({
        Nombre,
    })  
    await nuevaCiudad.save() 
    res.redirect('/registrar-transporte')
})


router.get('/registrar-baterias', isAuthenticatedInventario, async (req, res) =>{
    let proveedores = await proveedorDB.find().sort({"Empresa":1})
    let modelos = await modelosDB.find().sort({"Nombre":1})
    let marcas = await marcasDB.find().sort({"Nombre":1})
    modelos = modelos.map((data) => {
        return{
            Nombre: data.Nombre
        }
    })
    marcas = marcas.map((data) => {
        return{
            Nombre: data.Nombre
        }
    })
    proveedores = proveedores.map((data) => {
        return{
            Empresa: data.Empresa 
        }
    })
    res.render('admin/registro/registrar-baterias',{
        proveedores,
        modelos,
        marcas
    })
})

router.post('/registrar-baterias', isAuthenticatedInventario, async (req, res) => {
    let {
        Codigo,
        Proveedor,
        Bulto,
        TipoVehiculo,
        Referencia,
        Voltaje,
        Serie,
        Capacidad10h,
        Capacidad20h,
        CCA,
        Carga,
        Polaridad,
        Alto,
        Largo,
        Ancho,
        Peso,
        MarcaProducto,
        PrecioFOB,
        PrecioVenta,
        Cantidad,
        Descripcion,
        Vehiculo,
    } = req.body
    
    let validacionDuplicado = await productosDB.findOne({Codigo:Codigo})
    if(validacionDuplicado){
        res.send(JSON.stringify("error"))
    }else{
        let nuevabateria = new bateriasDB({
            Codigo,
            Proveedor,
            Bulto,
            TipoVehiculo,
            Referencia,
            Voltaje,
            Serie,
            Capacidad10h,
            Capacidad20h,
            CCA,
            Carga,
            Polaridad,
            Alto,
            Largo,
            Ancho,
            Peso,
            MarcaProducto,
            PrecioFOB,
            PrecioVenta,
            Cantidad,
            Descripcion,
            Vehiculo,
        })
        let TipoProducto= "Bateria"
        let nuevoProducto = new productosDB({
            Referencia,
            Codigo,
            MarcaProducto,
            PrecioFOB,
            PrecioVenta,
            Cantidad,
            Bulto,
            TipoVehiculo,
            Proveedor,
            Descripcion,
            TipoProducto,
            Alto,
            Largo,
            Ancho,
            Peso,
        })

        await nuevabateria.save()
        await nuevoProducto.save()
     
        res.send(JSON.stringify("ok"))

    }
})

router.get('/registrar-bombas', isAuthenticatedInventario, async (req, res) =>{
    let proveedores = await proveedorDB.find().sort({"Empresa":1})
    let modelos = await modelosDB.find().sort({"Nombre":1})
    let marcas = await marcasDB.find().sort({"Nombre":1})
    modelos = modelos.map((data) => {
        return{
            Nombre: data.Nombre
        }
    })
    marcas = marcas.map((data) => {
        return{
            Nombre: data.Nombre
        }
    })
    proveedores = proveedores.map((data) => {
        return{
            Empresa: data.Empresa 
        }
    })
    res.render('admin/registro/registrar-bombas',{
        proveedores,
        modelos,
        marcas
    })
})

router.post('/registrar-bombas', isAuthenticatedInventario, async (req, res) => {
    let {
        Codigo,
        Proveedor,
        Bulto,
        TipoVehiculo,
        Referencia,
        Alto,
        Largo,
        Ancho,
        Peso,
        MarcaProducto,
        PrecioFOB,
        PrecioVenta,
        Cantidad,
        Descripcion,
        Vehiculo,
    } = req.body
    
    let validacionDuplicado = await productosDB.findOne({Codigo:Codigo})
    if(validacionDuplicado){
        res.send(JSON.stringify("error"))
    }else{
        let nuevaBomba = new bombasDB({
            Codigo,
            Proveedor,
            Referencia,
            Bulto,
            TipoVehiculo,
            Alto,
            Largo,
            Ancho,
            Peso,
            MarcaProducto,
            PrecioFOB,
            PrecioVenta,
            Cantidad,
            Descripcion,
            Vehiculo,
        })
        let TipoProducto= "Bomba"
        let nuevoProducto = new productosDB({
            Codigo,
            MarcaProducto,
            PrecioFOB,
            PrecioVenta,
            Cantidad,
            Bulto,
            TipoVehiculo,
            Proveedor,
            Descripcion,
            TipoProducto,
            Alto,
            Largo,
            Ancho,
            Peso,
        })
        await nuevaBomba.save()
        await nuevoProducto.save()
        

        res.send(JSON.stringify("ok"))

    }
})

router.get('/registrar-base-amortiguadores', isAuthenticatedInventario, async (req, res) =>{
    let proveedores = await proveedorDB.find().sort({"Empresa":1})
    let modelos = await modelosDB.find().sort({"Nombre":1})
    let marcas = await marcasDB.find().sort({"Nombre":1})
    modelos = modelos.map((data) => {
        return{
            Nombre: data.Nombre
        }
    })
    marcas = marcas.map((data) => {
        return{
            Nombre: data.Nombre
        }
    })
    proveedores = proveedores.map((data) => {
        return{
            Empresa: data.Empresa 
        }
    })
    res.render('admin/registro/registrar-base-amortiguadores',{
        proveedores,
        modelos,
        marcas
    })
})

router.post('/registrar-base-amortiguador', isAuthenticatedInventario, async (req, res) => {
    let {
        Codigo,
        ModeloProducto,
        Nombre,
        Proveedor,
        Posicion,
        MarcaProducto,
        Alto,
        Largo,
        Ancho,
        Bulto,
        TipoVehiculo,
        Peso,
        PrecioFOB,
        PrecioVenta,
        Cantidad,
        Descripcion,
        Vehiculo
    } = req.body
    
    let validacionDuplicado = await productosDB.findOne({Codigo:Codigo})
    if(validacionDuplicado){
        res.send(JSON.stringify("error"))
    }else{
        let nuevaBaseAmortiguador = new baseAmortiguadoresDB({
            Codigo,
            ModeloProducto,
            Nombre,
            Proveedor,
            Posicion,
            Alto,
            Largo,
            MarcaProducto,
            Bulto,
            TipoVehiculo,
            Ancho,
            Peso,
            PrecioFOB,
            PrecioVenta,
            Descripcion,
            Vehiculo
        })
        let TipoProducto= "Base amortiguador"
        let nuevoProducto = new productosDB({
            Codigo,
            MarcaProducto,
            PrecioFOB,
            PrecioVenta,
            Cantidad,
            Bulto,
            TipoVehiculo,
            Proveedor,
            Descripcion,
            TipoProducto,
            Alto,
            Largo,
            Ancho,
            Peso,
        })

        await nuevaBaseAmortiguador.save()
        await nuevoProducto.save()
     
        res.send(JSON.stringify("ok"))

    }
})

router.get('/registrar-guardapolvos', isAuthenticatedInventario, async (req, res) =>{
    let proveedores = await proveedorDB.find().sort({"Empresa":1})
    let modelos = await modelosDB.find().sort({"Nombre":1})
    let marcas = await marcasDB.find().sort({"Nombre":1})
    modelos = modelos.map((data) => {
        return{
            Nombre: data.Nombre
        }
    })
    marcas = marcas.map((data) => {
        return{
            Nombre: data.Nombre
        }
    })
    proveedores = proveedores.map((data) => {
        return{
            Empresa: data.Empresa 
        }
    })
    res.render('admin/registro/registrar-guardapolvos',{
        proveedores,
        modelos,
        marcas
    })
})

router.post('/registrar-guardapolvos', isAuthenticatedInventario, async (req, res) => {
    let {
        Codigo,
        Proveedor,
        Bulto,
        TipoVehiculo,
        Alto,
        Largo,
        Ancho,
        Peso,
        MarcaProducto,
        PrecioFOB,
        PrecioVenta,
        Cantidad,
        Descripcion,
        Vehiculo,
    } = req.body
    
    let validacionDuplicado = await productosDB.findOne({Codigo:Codigo})
    if(validacionDuplicado){
        res.send(JSON.stringify("error"))
    }else{
        let nuevoGuardapolvo = new guardapolvosDB({
            Codigo,
            Proveedor,
            Bulto,
            TipoVehiculo,
            Alto,
            Largo,
            Ancho,
            Peso,
            MarcaProducto,
            PrecioFOB,
            PrecioVenta,
            Cantidad,
            Descripcion,
            Vehiculo,
        })
        let TipoProducto= "Guardapolvo"
        let nuevoProducto = new productosDB({
            Codigo,
            MarcaProducto,
            PrecioFOB,
            PrecioVenta,
            Cantidad,
            Bulto,
            TipoVehiculo,
            Proveedor,
            Descripcion,
            TipoProducto,
            Alto,
            Largo,
            Ancho,
            Peso,
        })

        await nuevoGuardapolvo.save()
        await nuevoProducto.save()

        res.send(JSON.stringify("ok"))
    }
})


router.get('/registrar-valvulas', isAuthenticatedInventario, async (req, res) =>{
    let proveedores = await proveedorDB.find().sort({"Empresa":1})
    let modelos = await modelosDB.find().sort({"Nombre":1})
    let marcas = await marcasDB.find().sort({"Nombre":1})
    modelos = modelos.map((data) => {
        return{
            Nombre: data.Nombre
        }
    })
    marcas = marcas.map((data) => {
        return{
            Nombre: data.Nombre
        }
    })
    proveedores = proveedores.map((data) => {
        return{
            Empresa: data.Empresa 
        }
    })
    res.render('admin/registro/registrar-valvulas',{
        proveedores,
        modelos,
        marcas
    })
})


router.post('/registrar-valvula', isAuthenticatedInventario, async (req, res) => {
    let {
        Codigo,
        Proveedor,
        Tipo,
        CantidadEstuche,
        Bulto,
        TipoVehiculo,
        Alto,
        Largo,
        Ancho,
        Peso,
        MarcaProducto,
        PrecioFOB,
        PrecioVenta,
        Cantidad,
        Descripcion,
        Vehiculo,
    } = req.body
    
    let validacionDuplicado = await productosDB.findOne({Codigo:Codigo})
    if(validacionDuplicado){
        res.send(JSON.stringify("error"))
    }else{
        let nuevaValvula = new valvulasDB({
            Codigo,
            Proveedor,
            Bulto,
            TipoVehiculo,
            Tipo,
            Alto,
            Largo,
            Ancho,
            CantidadEstuche,
            Peso,
            MarcaProducto,
            PrecioFOB,
            PrecioVenta,
            Cantidad,
            Descripcion,
            Vehiculo,
        })
        let TipoProducto= "Valvula"
        let nuevoProducto = new productosDB({
            Codigo,
            MarcaProducto,
            PrecioFOB,
            PrecioVenta,
            Cantidad,
            Bulto,
            TipoVehiculo,
            Proveedor,
            Descripcion,
            TipoProducto,
            Alto,
            Largo,
            Ancho,
            Peso,
        })

        await nuevaValvula.save()
        await nuevoProducto.save()

        res.send(JSON.stringify("ok"))
    }
})


router.post('/rechazar-solicitud-pago/:id', isAuthenticatedFacturacion, async (req, res) => {
    //facturacion
    let solicitudIngreso = await solicitudesPagoDB.findById(req.params.id)
    if(solicitudIngreso){
        await solicitudesPagoDB.findByIdAndDelete(req.params.id)
    }else{
        await solicitudesEgresosDB.findByIdAndDelete(req.params.id)
    }
    req.flash("success","Solicitud rechazada correctamente")
    res.redirect('/reportar-pago')
})

router.get('/procesar-solicitud-de-pago/:id', isAuthenticatedFacturacion, async (req, res) => {
    let soliciudPago = await solicitudesPagoDB.findById(req.params.id)
    let notasEntrega = await notasEntregaDB.find({$and :  [{Estado: "Por pagar"},{Cliente: soliciudPago.Cliente}]}).sort({Timestamp: 1})
    let totalPendiente = 0 
    let saldoPagado = soliciudPago.Monto
    let facturas = []
    for(i=0; i< notasEntrega.length; i++){
        if(+saldoPagado> 0){
            if(+notasEntrega[i].Saldo > +saldoPagado){
                //sumar el total pendiente y restar contra el saldo pagado para sacar el saldo a favor de existir
                //arreglar total de la tabla
                totalPendiente += +saldoPagado
                let data = {
                    NotaDeEntrega: notasEntrega[i].Numero, 
                    Saldo: notasEntrega[i].Saldo, 
                    MontoPagado: saldoPagado, 
                    Pendiente: (+notasEntrega[i].Saldo - +saldoPagado).toFixed(2),
                    Nota: "Abono", 
                    Fecha: notasEntrega[i].Fecha, 
                }
                facturas.push(data)
                saldoPagado= 0
            }
            if(+notasEntrega[i].Saldo < +saldoPagado){
                totalPendiente += +notasEntrega[i].Saldo
                let data = {
                    NotaDeEntrega: notasEntrega[i].Numero, 
                    Saldo: notasEntrega[i].Saldo, 
                    MontoPagado: notasEntrega[i].Saldo, 
                    Pendiente: 0,
                    Nota: "Pago completo", 
                    Fecha: notasEntrega[i].Fecha, 
                }
                facturas.push(data)
                saldoPagado = +saldoPagado - +notasEntrega[i].Saldo
    
            }
            if(+notasEntrega[i].Saldo == +saldoPagado){
                let data = {
                    NotaDeEntrega: notasEntrega[i].Numero, 
                    Saldo: notasEntrega[i].Saldo, 
                    MontoPagado: notasEntrega[i].Saldo, 
                    Pendiente: 0,
                    Nota: "Pago completo", 
                    Fecha: notasEntrega[i].Fecha, 
                }
                facturas.push(data)
                saldoPagado= 0

            }
        }
    }
    notasEntrega = notasEntrega.map((data) => {
        return{
            Numero: data.Numero
        }
    })

    let data = {
        facturas: facturas.map((data) => {
            return{
                NotaDeEntrega: data.NotaDeEntrega,
                Saldo: data.Saldo,
                MontoPagado: data.MontoPagado,
                Pendiente: data.Pendiente,
                Nota: data.Nota,
                Fecha: data.Fecha,
            }
        }),
        Fecha: soliciudPago.Fecha, 
        Timestamp: soliciudPago.Timestamp, 
        SolicitadoPor: soliciudPago.SolicitadoPor, 
        Vendedor: soliciudPago.Vendedor, 
        _idVendedor: soliciudPago._idVendedor, 
        NumeroSolicitud: soliciudPago.NumeroSolicitud, 
        Estado: soliciudPago.Estado, 
        Transaccion: soliciudPago.Transaccion, 
        Monto: soliciudPago.Monto, 
        Modalidad: soliciudPago.Modalidad, 
        Comentario: soliciudPago.Comentario, 
        Cliente: soliciudPago.Cliente, 
        Documento: soliciudPago.Documento, 
        Direccion: soliciudPago.Direccion, 
        Celular: soliciudPago.Celular, 
        _id: soliciudPago._id, 
    }
    let saldoFavor = (+soliciudPago.Monto - +totalPendiente).toFixed(2)
        if(+saldoFavor < 0){
        saldoFavor = 0
    }
    res.render('admin/facturacion/procesar-solicitud-pago',{
        data,
        saldoFavor,
        totalPendiente,
        notasEntrega
    })
})

router.post('/solicitar-pendiente-cobranza', isAuthenticatedFacturacion, async (req, res) => {
    let {NotaEntrega} = req.body
    let nota = await notasEntregaDB.findOne({Numero: NotaEntrega})
    res.send(JSON.stringify(nota))
})


router.post('/procesar-solicitud-de-ingreso', isAuthenticatedFacturacion, async (req, res) => {
    let {_id} = req.body
    let solicitudesPago = await solicitudesPagoDB.findById(_id)
    if(solicitudesPago.Modalidad == "Efectivo"){
        let vendedor = await vendedoresDB.findById(solicitudesPago._idVendedor)
        let SaldoEnPosesion = +vendedor.SaldoEnPosesion  + +solicitudesPago.Monto
        await vendedoresDB.findByIdAndUpdate(solicitudesPago._idVendedor,{
            SaldoEnPosesion: SaldoEnPosesion,
        })
        await solicitudesPagoDB.findByIdAndUpdate(_id,{
            Estado: "Procesada"
        })
    }else{
        await solicitudesPagoDB.findByIdAndUpdate(_id,{
            Estado: "Cerrada"
        })
    }
    res.send(JSON.stringify("ok"))
})

router.get('/procesar-solicitud-de-egreso/:id', isAuthenticatedFacturacion, async (req, res) => {
    let solicitudEgreso = await solicitudesEgresosDB.findById(req.params.id)
    solicitudEgreso = {
            Fecha: solicitudEgreso.Fecha,
            Timestamp: solicitudEgreso.Timestamp,
            Vendedor: solicitudEgreso.Vendedor,
            _idVendedor: solicitudEgreso._idVendedor,
            NumeroSolicitud: solicitudEgreso.NumeroSolicitud,
            _id: solicitudEgreso._id,
            Estado: solicitudEgreso.Estado,
            MontoTotal: solicitudEgreso.MontoTotal,
            Egresos: solicitudEgreso.Egresos.map((data2) => {
                return{
                    Monto: data2.Monto,
                    Comentario: data2.Comentario,
                }
            }),
    }
    res.render('admin/facturacion/procesar-solicitud-egreso',{
        solicitudEgreso
    })
})

router.post('/procesar-egreso/:id', async (req, res) => {
    let {Modalidad, Referencia, Total} = req.body
    let solicitudEgreso = await solicitudesEgresosDB.findById(req.params.id)
    let vendedor = await vendedoresDB.findById(solicitudEgreso._idVendedor)
    let SaldoPosesion= (+vendedor.SaldoEnPosesion - +solicitudEgreso.MontoTotal).toFixed(2)
    
    await vendedoresDB.findByIdAndUpdate(vendedor._id,{
        SaldoEnPosesion: SaldoPosesion
    })
    if(Modalidad == "Efectivo"){
        await solicitudesEgresosDB.findByIdAndUpdate(req.params.id,{
            Modalidad: Modalidad, 
            Estado: "Procesada"
        })
    }else{
        await solicitudesEgresosDB.findByIdAndUpdate(req.params.id,{
            Modalidad: Modalidad,
            Referencia: Referencia,
            Estado: "Procesada"
        })
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
        let nuevaTransaccion = new transaccionesCobranzaDB({
            Modalidad: Modalidad, 
            Timestamp: Timestamp, 
            Fecha: Fecha, 
            Monto: Total, 
            Transaccion: Referencia, 
            Tipo: "Egreso vendedor", 
        })
        await nuevaTransaccion.save()
    }
    res.send(JSON.stringify("ok"))
})

router.get('/realizar-recibo-de-vuelto', isAuthenticatedFacturacion, async (req, res) =>{
    let recibosVueltos = await recibosVueltosDB.find().sort({"Timestamp": -1})
    recibosVueltos = recibosVueltos.map((data) => {
        return{
            Numero: data.Numero,
            Timestamp: data.Timestamp,
            Fecha: data.Fecha,
            Cliente: data.Cliente,
            Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Monto),
        }
    })
    res.render('admin/clientes/recibos-de-vuelto',{
        recibosVueltos
    })
})

router.get('/realizar-recibo-de-vuelto-cliente', isAuthenticatedFacturacion, async (req, res) => {
    let clientes = await clientesDB.find({SaldoFavor: {$gt: 0}}).sort({"Empresa": 1})
    clientes = clientes.map((data) => {
        return{
            Empresa: data.Empresa
        }
    })
    res.render('admin/clientes/realizar-recibo-de-vuelto',{
        clientes
    })
})


router.post('/solicitar-saldo-favor-cliente', isAuthenticatedDuroc, async (req, res) => {
    let {Cliente} = req.body
    let cliente = await clientesDB.findOne({Empresa: Cliente})
    cliente = cliente.SaldoFavor
    res.send(JSON.stringify(cliente))
})


router.post('/registrar-nuevo-recibo-pago', isAuthenticatedDuroc, async (req, res) => {
    let {Cliente, Monto} = req.body
    if(!Cliente || Cliente == 0 || Monto == 0 || !Monto){
        req.flash('error', "Debe llenar todos los campos para poder generar el recibo de vuelto")
        res.redirect('/realizar-recibo-de-vuelto-cliente')
    }else{
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
        let recibos = await recibosVueltosDB.find().sort({"Timestamp": -1})
        let Numero = 0
        if(recibos.length ==  0){
            Numero = 800000001
        }else{
            Numero = +recibos[0].Numero + 1 
        }
        let cliente = await  clientesDB.findOne({Empresa: Cliente})
        await clientesDB.findByIdAndUpdate(cliente._id,{
            SaldoFavor: 0
        })
        let nuevoReciboVuelto = await recibosVueltosDB({
            Numero: Numero,
            Timestamp: Timestamp,
            Fecha: Fecha,
            Cliente: Cliente,
            Monto: Monto,
        })
        await nuevoReciboVuelto.save()
        res.redirect(`/ver-recibo-de-vuelto/${Numero}`)
    }
})

router.get('/ver-recibo-de-vuelto/:id', isAuthenticatedDuroc ,async (req, res) => {
    let reciboVuelto = await recibosVueltosDB.findOne({Numero: req.params.id})
    reciboVuelto = {
        Numero: reciboVuelto.Numero,
        Timestamp: reciboVuelto.Timestamp,
        Fecha: reciboVuelto.Fecha,
        Cliente: reciboVuelto.Cliente,
        Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(reciboVuelto.Monto),
    }
    res.render('admin/archivos_pdf/recibo-de-vuelto',{
        layout:"reportes.hbs",
        reciboVuelto
    })
})

router.get('/reporte-de-ventas', isAuthenticatedFacturacion, async (req, res) => {
    res.render('admin/facturacion/reporte-de-ventas')
})


router.post('/solicitar-tipo-usuario-reporte-ventas', isAuthenticatedDuroc, async (req, res) => {
    let {TipoUsuario} = req.body
    let datos
    if(TipoUsuario == "Cliente"){
        datos = await clientesDB.find().sort({Empresa: 1})
        datos = datos.map((data) => {
            return{
                Nombre: data.Empresa,
                _id: data._id
            }
        })
    }else{
        datos = await vendedoresDB.find().sort({Empresa: 1})
        datos = datos.map((data) => {
            return{
                Nombre: `${data.Nombres} ${data.Apellidos}`,
                _id: data._id
            }
        })
    }
    res.send(JSON.stringify(datos))

})


router.post('/generar-repoorte-de-ventas', isAuthenticatedDuroc, async (req, res) => {
    let {TipoUsuario, Usuario, TipoFecha, Desde, Hasta} = req.body
    if(!TipoUsuario || TipoUsuario == 0 ){
        req.flash("error", 'El campo "Tipo de usuario" no puede estar vacío. Por favor, valide e intente de nuevo.')
        res.redirect('/reporte-de-ventas')
        return
    }
    if(!Usuario || Usuario == 0 ){
        req.flash("error", 'El campo "Vendedor / Cliente" no puede estar vacío. Por favor, valide e intente de nuevo.')
        res.redirect('/reporte-de-ventas')
        return
    }
    if(!TipoFecha || TipoFecha == 0 ){
        req.flash("error", 'El campo "Tipo de fecha" no puede estar vacío. Por favor, valide e intente de nuevo.')
        res.redirect('/reporte-de-ventas')
        return
    }
    let notasEntrega 
    let titulo
 
    
    if(TipoFecha == "Registro"){
        if(Desde){
            if(Hasta){
                if(TipoUsuario == "Cliente"){
                    titulo = `Reporte de compras`
                    let Cliente = await clientesDB.findById(Usuario)
                    notasEntrega = await notasEntregaDB.find({$and: [{Cliente: Cliente.Empresa}, {Fecha: {$gte: Desde}}, {Fecha: {$lte: Hasta}}]}).sort({"Timestamp":-1})
                }else{
                    titulo = `Reporte de ventas`
                    notasEntrega = await notasEntregaDB.find({$and: [{_idVendedor: Usuario}, {Fecha: {$gte: Desde}}, {Fecha: {$lte: Hasta}}]}).sort({"Timestamp":-1})
                }
            }else{
                if(TipoUsuario == "Cliente"){
                    titulo = `Reporte de compras`
                    let Cliente = await clientesDB.findById(Usuario)
                    notasEntrega = await notasEntregaDB.find({$and: [{Cliente: Cliente.Empresa}, {Fecha: {$gte: Desde}}]}).sort({"Timestamp":-1})
                }else{
                    titulo = `Reporte de ventas`
                    notasEntrega = await notasEntregaDB.find({$and: [{_idVendedor: Usuario}, {Fecha: {$gte: Desde}}]}).sort({"Timestamp":-1})
                }
            }
        }else{
            if(Hasta){
                if(TipoUsuario == "Cliente"){
                    titulo = `Reporte de compras`
                    let Cliente = await clientesDB.findById(Usuario)
                    notasEntrega = await notasEntregaDB.find({$and: [{Cliente: Cliente.Empresa},{Fecha: {$lte: Hasta}}]}).sort({"Timestamp":-1})
                }else{
                    titulo = `Reporte de ventas`
                    notasEntrega = await notasEntregaDB.find({$and: [{_idVendedor: Usuario},{Fecha: {$lte: Hasta}}]}).sort({"Timestamp":-1})
                }
            }else{
                if(TipoUsuario == "Cliente"){
                    titulo = `Reporte de compras`
                    let Cliente = await clientesDB.findById(Usuario)
                    notasEntrega = await notasEntregaDB.find({Cliente: Cliente.Empresa}).sort({"Timestamp":-1})
                }else{
                    titulo = `Reporte de ventas`
                    notasEntrega = await notasEntregaDB.find({_idVendedor: Usuario}).sort({"Timestamp":-1})
                }
            }
        }
    }else{
        if(Desde){
            if(Hasta){
                if(TipoUsuario == "Cliente"){
                    titulo = `Reporte de compras`
                    let Cliente = await clientesDB.findById(Usuario)
                    notasEntrega = await notasEntregaDB.find({$and: [{Cliente: Cliente.Empresa}, {Vencimiento: {$gte: Desde}}, {Vencimiento: {$lte: Hasta}}]}).sort({"Timestamp":-1})
                }else{
                    titulo = `Reporte de ventas`
                    notasEntrega = await notasEntregaDB.find({$and: [{_idVendedor: Usuario}, {Vencimiento: {$gte: Desde}}, {Vencimiento: {$lte: Hasta}}]}).sort({"Timestamp":-1})
                }
            }else{
                if(TipoUsuario == "Cliente"){
                    titulo = `Reporte de compras`
                    let Cliente = await clientesDB.findById(Usuario)
                    notasEntrega = await notasEntregaDB.find({$and: [{Cliente: Cliente.Empresa}, {Vencimiento: {$gte: Desde}}]}).sort({"Timestamp":-1})
                }else{
                    titulo = `Reporte de ventas`
                    notasEntrega = await notasEntregaDB.find({$and: [{_idVendedor: Usuario}, {Vencimiento: {$gte: Desde}}]}).sort({"Timestamp":-1})
                }
            }
        }else{
            if(Hasta){
                if(TipoUsuario == "Cliente"){
                    titulo = `Reporte de compras`
                    let Cliente = await clientesDB.findById(Usuario)
                    notasEntrega = await notasEntregaDB.find({$and: [{Cliente: Cliente.Empresa},{Vencimiento: {$lte: Hasta}}]}).sort({"Timestamp":-1})
                }else{
                    titulo = `Reporte de ventas`
                    notasEntrega = await notasEntregaDB.find({$and: [{_idVendedor: Usuario},{Vencimiento: {$lte: Hasta}}]}).sort({"Timestamp":-1})
                }
            }else{
                if(TipoUsuario == "Cliente"){
                    titulo = `Reporte de compras`
                    let Cliente = await clientesDB.findById(Usuario)
                    notasEntrega = await notasEntregaDB.find({Cliente: Cliente.Empresa}).sort({"Timestamp":-1})
                }else{
                    titulo = `Reporte de ventas`
                    notasEntrega = await notasEntregaDB.find({_idVendedor: Usuario}).sort({"Timestamp":-1})
                }
            }
        }
    }
    let saldoTotal = 0
    let netoTotal = 0
    for(i=0; i< notasEntrega.length; i++){
        netoTotal += +notasEntrega[i].Neto
        saldoTotal += +notasEntrega[i].Saldo
    }
    saldoTotal = saldoTotal.toFixed(2)
    netoTotal = netoTotal.toFixed(2)
    saldoTotal = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(saldoTotal)
    netoTotal = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(netoTotal)
    notasEntrega = notasEntrega.map((data) => {
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
    let nombre
    if(TipoUsuario == "Cliente"){
        let cliente = await clientesDB.findById(Usuario)
        nombre = cliente.Empresa
        res.render('admin/archivos_pdf/reporte-de-ventas-cliente',{
            layout:"reportes.hbs",
            notasEntrega,
            titulo,
            saldoTotal,
            netoTotal,
            nombre,
        })
    }else{
        let vendedor = await vendedoresDB.findById(Usuario)
        nombre = `${vendedor.Nombres} ${vendedor.Apellidos}`
        res.render('admin/archivos_pdf/reporte-de-ventas-vendedor',{
            layout:"reportes.hbs",
            notasEntrega,
            titulo,
            saldoTotal,
            netoTotal,
            nombre,
        })
    }


})

router.get('/todos-recibos-de-devolucion', isAuthenticatedFacturacion, async (req,res) => {
    let recibosDevolucion = await notasDevolucionDB.find().sort({"Timestamp": -1})
    let cantidadTotal = 0
    let precioTotal = 0
    for(i=0; i< recibosDevolucion.length; i++){
        cantidadTotal += +recibosDevolucion[i].CantidadTotal
        precioTotal = recibosDevolucion[i].PrecioTotal
    }
    precioTotal = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(precioTotal)
    recibosDevolucion = recibosDevolucion.map((data) => {
        return{
            Fecha: data.Fecha,
            Timestamp: data.Timestamp,
            Recibo: data.Recibo,
            Cliente: data.Cliente,
            TipoDeNota: data.TipoDeNota,
            Estado: data.Estado,
            NotaEntrega: data.NotaEntrega,
            Vendedor: data.Vendedor,
            _idVendedor: data._idVendedor,
            Documento: data.Documento,
            Direccion: data.Direccion,
            Celular: data.Celular,
            Titulo: data.Titulo,
            CantidadTotal: data.CantidadTotal,
            PrecioTotal: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.PrecioTotal),
            _id: data._id,
        }
    })
    res.render('admin/facturacion/todos-recibos-devolucion',{
        recibosDevolucion,
        cantidadTotal,
        precioTotal
    })
})

router.get('/todos-recibos-de-pago', isAuthenticatedFacturacion, async (req,res) => {
    let notasPago = await notasPagoDB.find().sort({"Timestamp": -1})
    let cantidadTotal = notasPago.length
    let precioTotal = 0
    for(i=0; i< notasPago.length; i++){
        precioTotal += +notasPago[i].Monto
    }
    precioTotal = precioTotal.toFixed(2)
    precioTotal = new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(precioTotal)
    notasPago = notasPago.map((data) => {
        return{
            Fecha: data.Fecha,
            Timestamp: data.Timestamp,
            Recibo: data.Recibo,
            Estado: data.Estado,
            Transaccion: data.Transaccion,
            Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Monto),
            Modalidad: data.Modalidad,
            Comentario: data.Comentario,
            Cliente: data.Cliente,
            Documento: data.Documento,
            Direccion: data.Direccion,
            Celular: data.Celular,
            PendienteAPagar: data.PendienteAPagar,
        }
    })
    res.render('admin/facturacion/todos-los-recibos-pago',{
        notasPago,
        cantidadTotal,
        precioTotal
    })
})


router.get('/reporte-productos', isAuthenticatedInventario, async (req, res) => {
    let producto = await productosDB.find().sort({TipoProducto:1, Codigo:1})
    let notaEntrega = await notasEntregaDB.find().sort({"Timestamp": -1})
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
    res.render('admin/inventario/reporte-productos',{
        data
    })
})
router.get('/ver-detalles-ventas-producto-admin/:id', isAuthenticatedDuroc ,async (req, res) => {
    let producto = await productosDB.findById(req.params.id)
    let notasEntrega = await notasEntregaDB.find()
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


router.post('/cerrar-garantias-cliente', isAuthenticatedDuroc, async (req, res) => {
    let {Productos, Cliente} = req.body
    let cliente = await clientesDB.findById(Cliente)
    console.log(Productos)
    console.log(Cliente)
    for(i=0; i < Productos.length; i++){
        let garantia = await garantiasDB.findOne({$and: [{Codigo: Productos[i].Codigo},{Cliente: cliente.Empresa}, {Estado: "Pendiente"}]})
        console.log(garantia)
        if(+garantia.Cantidad > +Productos[i].Cantidad){
            let nuevaCantidad = +garantia.Cantidad - +Productos[i].Cantidad
            await garantiasDB.findByIdAndUpdate(garantia._id,{
                Cantidad: nuevaCantidad
            })
        }else{
            await garantiasDB.findByIdAndUpdate(garantia._id,{
                Cantidad: 0,
                Estado: "Procesada"
            })
        }
    }
    res.send(JSON.stringify("ok"))
})


router.post('/cerrar-saldo-cliente', async (req, res) =>{
    let {Cliente, Saldo, numeroNota} = req.body
    console.log(numeroNota)
    let cliente = await clientesDB.findById(Cliente)
    let notaEntrega = await notasEntregaDB.findOne({Numero: numeroNota}).sort({Numero: -1})
    console.log(notaEntrega)
    let notasPago = await notasPagoDB.find().sort({Recibo: -1})
    let Recibo = 0
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
    if(notasPago.length == 0){
        Recibo = 5000001
    }else{
        Recibo = +notasPago[0].Recibo + 1
    }
    if(+cliente.SaldoFavor == Saldo){
        //Se incluyo todo el saldo por lo tanto se valida el arreglo de HistorialSaldoFavor del cliente para crear nuevos recibos de pago o agregar comentario 
        let comentario = "Abono por recibo de pago"
        let Monto = 0
        for(i= 0; i< cliente.HistorialSaldoFavor.length; i++){
            if(cliente.HistorialSaldoFavor[i].Modalidad == "Nota de pago"){
                //agregamos comentario  a la nota de entrega 
                comentario = comentario + " " + `${cliente.HistorialSaldoFavor[i].Numero} -` 
            }else{
                //creamos recibo de devolucion y lo incluimos en el historia de la nota de entrega
                Monto += +cliente.HistorialSaldoFavor[i].Monto
            }
        }
        let HistorialSaldoFavor = []
        await clientesDB.findByIdAndUpdate(cliente,{
            SaldoFavor: 0,
            HistorialSaldoFavor: HistorialSaldoFavor,
        })
        Monto = Monto.toFixed(2)
        let Facturas = []
        let data = {
            NotaEntrega: notaEntrega.Numero, 
            Monto: Monto, 
            Modalidad: "Devolución", 
            Comentario: "Abono", 
        }
        Facturas.push(data)
        let nuevaNotaPago = new notasPagoDB({
            Fecha : Fecha,
            Timestamp : Timestamp,
            Recibo : Recibo,
            Facturas : Facturas,
            Monto : Monto,
            Modalidad : "Devolución",
            Cliente : cliente.Empresa,
            Documento : cliente.Documento,
            Direccion : cliente.Direccion,
            Celular : cliente.Celular,
        })
        let HistorialPago = {
            Pago: Monto,
            Comentario: "Devolución de productos",
            Modalidad: "Pago",
            Recibo:Recibo,
            FechaPago:Fecha,
            Timestamp:Timestamp,
        }
        console.log(comentario)
        if(+comentario.length > 24){
            console.log(Monto)
            if(Monto != 0){
                await notasEntregaDB.findByIdAndUpdate(notaEntrega._id,{
                    $push : {HistorialPago: HistorialPago},
                    Comentario: comentario
                })
                console.log(nuevaNotaPago)
                await nuevaNotaPago.save()
            }else{
                await notasEntregaDB.findByIdAndUpdate(notaEntrega._id,{
                    Comentario: comentario
                })
            }
        }else{
            if(Monto != 0){
                await notasEntregaDB.findByIdAndUpdate(notaEntrega._id,{
                    $push : {HistorialPago: HistorialPago},
                    Comentario: comentario
                })
                await nuevaNotaPago.save()
            }
        }

    }

    res.send(JSON.stringify(numeroNota))
})


router.get('/nueva-factura-manual', isAuthenticatedFacturacion, async (req, res) => {
    let clientes = await clientesDB.find().sort({Empresa: 1})
    clientes = clientes.map((data) => {
        return{
            _id: data._id,
            Empresa: data.Empresa
        }
    })
    res.render('admin/facturacion/nueva-factura-manual',{
        clientes
    })
})

router.post('/generar-nueva-factura-manual', isAuthenticatedFacturacion, async (req, res) => {
    let {Cliente, NotaEntrega, CantidadTotal, PrecioTotal, Productos, Fecha, NumeroControl} = req.body
    let dataCliente = await clientesDB.findOne({Empresa: Cliente})
    let datosNota = await notasEntregaDB.findOne({Numero: NotaEntrega})
    let cambio = await cambioFacturacionDB.find()
    let Timestamp = Date.now();

    for(i=0; i< Productos.length; i++){
        let codigo = await productosDB.findOne({Codigo: Productos[i].Codigo})
        Productos[i].Producto = codigo.TipoProducto
        Productos[i].Descripcion = codigo.Descripcion
        Productos[i].PrecioUnidadBS = (+cambio[0].Cambio * Productos[i].PrecioUnidadUSD)
        Productos[i].PrecioTotalBS = (+cambio[0].Cambio * Productos[i].PrecioTotalUSD) 
    }
    let PrecioTotalBS = (+PrecioTotal * +cambio[0].Cambio).toFixed(2)
    let Iva = (+PrecioTotal * 0.16).toFixed(2)
    let neto = +PrecioTotal + +Iva
    let IvaBS = (+Iva * cambio[0].Cambio).toFixed(2)
    let netoBS = (+neto * cambio[0].Cambio).toFixed(2)
    let NumeroFactura = 20200000001
    let facturas = await facturasDB.find().sort({"Timestamp":-1})
    if(facturas.length > 0){
        NumeroFactura = +facturas[0].NumeroFactura + 1
    }
    let nuevaFactura = new facturasDB({
        Timestamp: Timestamp,
        Fecha: Fecha,
        Vencimiento: datosNota.Vencimiento,
        Cambio: cambio[0].Cambio,
        NumeroFactura: NumeroFactura,
        NumeroNota: NotaEntrega,
        NumeroControl: NumeroControl,
        Cliente: Cliente,
        Documento: dataCliente.RIF,
        Direccion: dataCliente.Direccion,
        Celular: dataCliente.Celular,
        Zona: datosNota.Zona,
        DescuentoBS: 0,
        BaseImponibleBS: PrecioTotalBS,
        IvaBS: IvaBS,
        TotalSinDescuentoBS: PrecioTotalBS,
        NetoUSD: neto,
        NetoBS: netoBS,
        CantidadTotal: CantidadTotal,
        Vendedor: dataCliente.Vendedor,
        _idVendedor: dataCliente._idVendedor,
        Transporte: datosNota.Transporte,
        PrecioTarifaUSD: datosNota.PrecioTarifaUSD,
        PrecioTarifaBS: datosNota.PrecioTarifaBS,
        Productos: Productos,
    })
    await nuevaFactura.save()

    await notasEntregaDB.findByIdAndUpdate(datosNota._id,{
        Factura: NumeroFactura
    })
    let data = {
        Numero: NumeroFactura,
        Cliente: Cliente,
    }

    res.send(JSON.stringify(data))

})


router.post('/solicitar-notas-cliente-facturacion-manual', isAuthenticatedFacturacion, async (req, res) => {
    let {Cliente} = req.body
    let notasEntregas = await notasEntregaDB.find({$and: [{Cliente: Cliente}, {Factura: "-"}]}).sort({Numero:-1})
    let codigos = []

    for(i=0; i< notasEntregas.length; i++){
        for(r=0; r< notasEntregas[i].Productos.length; r++){
            let validacion = codigos.find((data) => data.Codigo == notasEntregas[i].Productos[r].Codigo)
            if(validacion){
                //sumamos cantidad
                codigos = codigos.filter((data) => data.Codigo != notasEntregas[i].Productos[r].Codigo) 
                let Cantidad = +validacion.Cantidad + +notasEntregas[i].Productos[r].Cantidad
                let data = {
                    Codigo: notasEntregas[i].Productos[r].Codigo,
                    Cantidad: Cantidad,
                    PrecioUnitario: notasEntregas[i].Productos[r].PrecioUnidad,
                }   
                codigos.push(data)

            }else{
                //incluimos nuevo
                let data = {
                    Codigo:notasEntregas[i].Productos[r].Codigo,
                    Cantidad: notasEntregas[i].Productos[r].Cantidad,
                    PrecioUnitario: notasEntregas[i].Productos[r].PrecioUnidad,
                }
                codigos.push(data)
            }
        }
    }

    notasEntregas = notasEntregas.map((data) => {
        return{
            Numero: data.Numero
        }
    })
    let dataEnvio = {
        notas: notasEntregas,
        codigos: codigos,
    }
    res.send(JSON.stringify(dataEnvio))
})


router.post('/generar-nuevo-calculo-comision', isAuthenticatedVendedor, async (req, res) => {
    let {Vendedor, Total, Notas} = req.body
    let datosVendedor = await vendedoresDB.findById(Vendedor)
    let calculoComison = await calculoComisonDB.find().sort({"Timestamop": -1})
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
    let Numero = 400000001
    if(calculoComison.length != 0){
        Numero = +calculoComison[0].Numero + 1
    }
    for(i=0; i< Notas.length; i++){
        let notaActualizar = await notasEntregaDB.findOne({Numero: Notas[i].NotaEntrega})
        await notasEntregaDB.findByIdAndUpdate(notaActualizar._id,{
            EstadoComision: "Cerrada"
        })
    }
    let nuevoCalculoComision = new calculoComisonDB({
        Timestamp: Timestamp, 
        Numero: Numero, 
        Fecha: Fecha, 
        Vendedor: `${datosVendedor.Nombres} ${datosVendedor.Apellidos}`, 
        _idVendedor: Vendedor,
        Cedula: datosVendedor.Cedula,
        Direccion: datosVendedor.Direccion,
        Neto: Total, 
        CantidadNotas: Notas.length, 
        Saldo: Total, 
        Notas: Notas, 
    })
    await nuevoCalculoComision.save()
    let dataRespuesta = {
        Numero: Numero,
        Vendedor:  `${datosVendedor.Nombres} ${datosVendedor.Apellidos}`
    }
    res.send(JSON.stringify(dataRespuesta))
})

router.get('/ver-calculo-comision/:id', isAuthenticatedDuroc, async (req, res) => {
    let nota = await calculoComisonDB.findOne({Numero: req.params.id})
    nota = {
        Timestamp: nota.Timestamp,
        Numero: nota.Numero,
        Fecha: nota.Fecha,
        Cedula: nota.Cedula,
        Direccion: nota.Direccion,
        Vendedor: nota.Vendedor,
        _idVendedor: nota._idVendedor,
        Neto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(nota.Neto),
        CantidadNotas: nota.CantidadNotas,
        Saldo: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(nota.Saldo),
        Estado: nota.Estado,
        Notas: nota.Notas.map((data) => {
            return{
                NotaEntrega: data.NotaEntrega,
                Comision: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Comision),
            }
        }),
    }
    res.render('admin/archivos_pdf/ver-calculo-comision',{
        layout: "reportes.hbs",
        nota
    })
})

router.post('/solicitar-notas-vendedor-calculo-comision', isAuthenticatedDuroc, async (req, res) => {
    let {Vendedor} = req.body
    let notasEntrega = await notasEntregaDB.find({$and : [{Estado: "Cerrada"}, {_idVendedor: Vendedor}, {EstadoComision: "Por pagar"}]}).sort({"Timestamp": -1})
    res.send(JSON.stringify(notasEntrega))
})

router.post('/solicitar-calculos-comision-vendedor', isAuthenticatedDuroc, async (req, res) => {
    let {Estado} = req.body
    let calculosComision = await calculoComisonDB.find({Estado:Estado }).sort({"Timestamp":-1})
    res.send(JSON.stringify(calculosComision))
})

router.get('/ver-historial-calculo-comision/:id', isAuthenticatedDuroc, async (req, res) => {
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
        historial,
        Numero
    })
})


router.get('/pago-de-calculos', isAuthenticatedVendedor, async (req, res) => {
    let notasComisiones = await notasComisionesDB.find().sort({"Timestamp" : -1})
    let vendedores = await vendedoresDB.find().sort({Nombres: 1, Apellidos: 1})
    vendedores = vendedores.map((data) => {
        return{
            Nombres: `${data.Nombres} ${data.Apellidos}`,
            _id: data._id
        }
    })
    notasComisiones = notasComisiones.map((data) => {
        return{
            Numero: data.Numero,
            Timestamp: data.Timestamp,
            Fecha: data.Fecha,
            Vendedor: data.Vendedor,
            _idVendedor: data._idVendedor,
            CantidadTotalDocumentos: data.CantidadTotalDocumentos,
            Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Monto),
        }
    })
    res.render('admin/vendedores/pago-calculos-comision',{
        notasComisiones,
        vendedores
    })
})

router.post('/solicitar-recibos-pago-comision', isAuthenticatedVendedor, async (req, res) => {
    let {Vendedor} = req.body
    let notasComisines = await notasComisionesDB.find({_idVendedor:Vendedor}).sort({"Timestamp": -1})
    res.send(JSON.stringify(notasComisines))
})

router.get('/generar-nueva-recibo-comision', isAuthenticatedVendedor, async (req, res) => {
    let vendedores = await vendedoresDB.find().sort({Nombre: 1, Apellidos: 1})
    vendedores = vendedores.map((data) => {
        return{
            Nombres: `${data.Nombres} ${data.Apellidos}`,
            _id: data._id
        }
    })
    res.render('admin/vendedores/generar-nuevo-recibo-comision',{
        vendedores
    })
})


router.post('/solicitar-calculos-comision-nuevo-recibo', isAuthenticatedVendedor, async (req, res) => {
    let {Vendedor} = req.body
    let calculos = await calculoComisonDB.find({$and : [{_idVendedor: Vendedor},{Estado:"Por pagar"}]})
    res.send(JSON.stringify(calculos))
})


router.post('/generar-nuevo-recibo-pago-comision', isAuthenticatedVendedor, async (req, res) => {
    let {Vendedor, Total, Facturas, Modalidad, Transaccion} = req.body

    let dataVendedor = await vendedoresDB.findById(Vendedor)
    let notasComision = await notasComisionesDB.find().sort({"Timestamp": -1}) 
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
    let Numero = 500000001
    if(notasComision.length > 0){
        Numero = +notasComision[0].Numero + 1
    }
    if(Modalidad != "Efectivo"){
        let transaccionExiste = await transaccionesCobranzaDB.findOne({$and:  [{Modalidad:Modalidad},{Transaccion: Transaccion}]})
        if(transaccionExiste){
            res.send(JSON.stringify("0"))
            return
        }
    }

    let nuevaTransaccion = new transaccionesCobranzaDB({
        Modalidad: Modalidad, 
        Timestamp: Timestamp, 
        Fecha: Fecha, 
        Monto: Total, 
        Transaccion: Transaccion, 
        Tipo: "Recibo de comisión", 
        Numero: Numero, 
    })
    await nuevaTransaccion.save()

    for(i=0; i< Facturas.length; i++){
        let calculo = await calculoComisonDB.findOne({Numero: Facturas[i].CalculoComision})
        let HistorialPago = {
            Pago: Total,
            Comentario: "Recibo de comisión",
            Modalidad: "Pago",
            Recibo:Numero,
            FechaPago:Fecha,
            Timestamp:Timestamp,
          }
        if(Facturas[i].Estado == "Abono"){
            await calculoComisonDB.findByIdAndUpdate(calculo._id,{
                Saldo: Facturas[i].Pendiente,
                $push : {HistorialPago:HistorialPago},
            })  
        }else{
            await calculoComisonDB.findByIdAndUpdate(calculo._id,{
                Estado: "Cerrada",
                Saldo: 0,
                $push : {HistorialPago:HistorialPago},
            })
        }
    }

    let nuevoReciboComison = new notasComisionesDB({
        Numero: Numero, 
        Timestamp: Timestamp, 
        Cedula: dataVendedor.Cedula,
        Transaccion: Transaccion,
        Modalidad: Modalidad,
        Direccion: dataVendedor.Direccion,
        Documento: dataVendedor.Documento,
        Celular: dataVendedor.Celular,
        Fecha: Fecha, 
        Vendedor: `${dataVendedor.Nombres} ${dataVendedor.Apellidos}`, 
        _idVendedor: Vendedor, 
        CantidadTotalDocumentos: Facturas.length, 
        Monto: Total, 
        Facturas: Facturas, 
    })
    await nuevoReciboComison.save()
    let dataRespuesta = {
        Numero: Numero,
        Vendedor: `${dataVendedor.Nombres} ${dataVendedor.Apellidos}`
    }
    res.send(JSON.stringify(dataRespuesta))
})

router.get('/ver-recibo-pago-comision/:id', isAuthenticatedDuroc, async (req, res) => {
    let nota = await notasComisionesDB.findOne({Numero: req.params.id})
    nota = {
        Numero: nota.Numero,
        Timestamp: nota.Timestamp,
        Fecha: nota.Fecha,
        Vendedor: nota.Vendedor,
        Cedula: nota.Cedula,
        Documento: nota.Documento,
        Transaccion: nota.Transaccion,
        Modalidad: nota.Modalidad,
        Celular: nota.Celular,
        _idVendedor: nota._idVendedor,
        CantidadTotalDocumentos: nota.CantidadTotalDocumentos,
        Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(nota.Monto),
        Facturas: nota.Facturas.map((data) => {
            return{
                CalculoComision: data.CalculoComision,
                Saldo: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Saldo),
                Apagar: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Apagar),
                Pendiente: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Pendiente),
                Estado: data.Estados,
            }
        }),
    }
    res.render('admin/archivos_pdf/ver-recibo-pago-comision',{
        layout:"reportes.hbs",
        nota
    })
})


router.get('/registrar-bujias', isAuthenticatedInventario, async (req, res) => {
    let proveedores = await proveedorDB.find().sort({Empresa: 1})
    let modelos = await modelosDB.find().sort({"Nombre":1})
    let marcas = await marcasDB.find().sort({"Nombre":1})
    modelos = modelos.map((data) => {
        return{
            Nombre: data.Nombre
        }
    })
    marcas = marcas.map((data) => {
        return{
            Nombre: data.Nombre
        }
    })
    proveedores = proveedores.map((data) => {
        return{
            Empresa: data.Empresa
        }
    })
    res.render('admin/registro/registrar-bujias',{
        modelos,
        marcas,
        proveedores
    })
})

router.post('/registrar-bujias', isAuthenticatedInventario, async (req, res) => {
    let {
        Codigo,
        Proveedor,
        CodigoStock,
        Serie,
        Referencia1,
        Referencia2,
        Bulto,
        TipoVehiculo,
        Alto,
        Largo,
        Ancho,
        Peso,
        MarcaProducto,
        PrecioFOB,
        PrecioVenta,
        Cantidad,
        Descripcion,
        Vehiculo,
    } = req.body
    
    let validacionDuplicado = await productosDB.findOne({Codigo:Codigo})
    if(validacionDuplicado){
        res.send(JSON.stringify("error"))
    }else{
        let nuevabujia = new bujiaDB({
            Codigo,
            Proveedor,
            Bulto,
            CodigoStock,
            Serie,
            Referencia1,
            Referencia2,
            TipoVehiculo,
            Alto,
            Largo,
            Ancho,
            Peso,
            MarcaProducto,
            PrecioFOB,
            PrecioVenta,
            Cantidad,
            Descripcion,
            Vehiculo,
        })
        let TipoProducto= "Bujia"
        let nuevoProducto = new productosDB({
            Codigo,
            MarcaProducto,
            PrecioFOB,
            PrecioVenta,
            Cantidad,
            Bulto,
            TipoVehiculo,
            Proveedor,
            Descripcion,
            TipoProducto,
            Alto,
            Largo,
            Ancho,
            Peso,
        })

        await nuevabujia.save()
        await nuevoProducto.save()

        res.send(JSON.stringify("ok"))
    }
})

router.get('/todas-las-transacciones', isAuthenticatedFacturacion, async (req, res) => {
    let transacciones = await transaccionesCobranzaDB.find().sort({"Timestamp": 1})
    transacciones = transacciones.map((data) => {   
        if(data.Tipo == "Recibo de comisión"){
            return{
                Timestamp: data.Timestamp,
                Fecha: data.Fecha,
                Modalidad: data.Modalidad,
                Transaccion: data.Transaccion,
                Tipo: data.Tipo,
                Numero: data.Numero,
                link: `/ver-recibo-pago-comision/${data.Numero}`,
                Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Monto),
            }
        }else{
            return{
                Timestamp: data.Timestamp,
                Fecha: data.Fecha,
                Modalidad: data.Modalidad,
                Transaccion: data.Transaccion,
                link: `/ver-nota-de-pago/${data.Numero}`,
                Tipo: data.Tipo,
                Numero: data.Numero,
                Monto: new Intl.NumberFormat("en-US", {  style: "currency",  currency: "USD",}).format(data.Monto),
            }
        }
    })
    res.render('admin/facturacion/todas-transacciones',{
        transacciones
    })
})


router.post('/solicitar-info-productos-facturacion-ordenes', async (req, res) => {
    let {Codigo} = req.body
    let producto = await productosDB.findOne({Codigo: Codigo})
    res.send(JSON.stringify(producto))
})


router.post('/eliminar-tarea/:id',isAuthenticatedTareas ,async (req, res) => {
    await tareasDB.findByIdAndDelete(req.params.id)
    req.flash("success","Tarea eliminada correctamente")
    res.redirect('/manager-tareas')
})


router.get('/carga-masiva-productos-rafael', async (req, res) => {
    let stock = await stockCopiaDB.find().sort({"CodigoT": 1})
    for(i=0; i< stock.length; i++){
        let Descripcion = ""
        for(r=0; r< stock[i].Vehiculo.length; r++ ){
            let data = {
                Marca: stock[i].Vehiculo[r].Modelo,
                Modelo: stock[i].Vehiculo[r].Marca,
                Anio: `${stock[i].Vehiculo[r].Desde}-${stock[i].Vehiculo[r].Hasta}`
            }
            data.Marca = data.Marca[0].toUpperCase() + data.Marca.slice(1)
            data.Modelo = data.Modelo[0].toUpperCase() + data.Modelo.slice(1)
            if(r == (+stock[i].Vehiculo.length - 1)){
                Descripcion += `${data.Marca} ${data.Modelo} ${data.Anio}`
            }else{
                Descripcion += `${data.Marca} ${data.Modelo} ${data.Anio},`
            }
        }
        let TipoProducto
        if(stock[i].TipoProducto == "AMORTIGUADOR"){
            TipoProducto= "Amortiguador"
                let nuevoAmortiguador = new amortiguadoresDB({
                Codigo: stock[i].CodigoT,
                ModeloProducto: stock[i].Familia,
                Nombre: stock[i].Nombre,
                Proveedor: "Thomson",
                Posicion: stock[i].Posicion,
                Alto: stock[i].Alto,
                Largo: stock[i].Largo,
                MarcaProducto: "Thomson",
                Bulto: stock[i].Unidades,
                TipoVehiculo: "Auto",
                Ancho: stock[i].Ancho,
                Peso: stock[i].Peso,
                PrecioFOB: 0,
                PrecioVenta: 0,
                Descripcion :Descripcion,
                Vehiculo: stock[i].Vehiculo,
            })
            await nuevoAmortiguador.save()
        }
        if(stock[i].TipoProducto == "BASE DE AMORTIGUADOR"){
            TipoProducto= "Base amortiguador"
            let nuevaBaseAmortiguador = new baseAmortiguadoresDB({
                Codigo: stock[i].CodigoT,
                ModeloProducto: stock[i].Familia,
                Nombre: stock[i].Nombre,
                Proveedor: "Thomson",
                Posicion: stock[i].Posicion,
                Alto: stock[i].Alto,
                Largo: stock[i].Largo,
                MarcaProducto: "Thomson",
                Bulto: stock[i].Unidades,
                TipoVehiculo: "Auto",
                Ancho: stock[i].Ancho,
                Peso: stock[i].Peso,
                PrecioFOB: 0,
                PrecioVenta: 0,
                Descripcion :Descripcion,
                Vehiculo: stock[i].Vehiculo,
            })
            await nuevaBaseAmortiguador.save()
        }
        let nuevoProducto = new productosDB({
            Codigo: stock[i].CodigoT,
            MarcaProducto: "Thomson",
            PrecioFOB: 0,
            PrecioVenta: 0,
            Cantidad: 0,
            Bulto: stock[i].Unidades,
            TipoVehiculo: "Auto",
            Proveedor: "Thomson",
            Descripcion: Descripcion,
            TipoProducto: TipoProducto,
            Alto: stock[i].Alto,
            Largo: stock[i].Largo,
            Ancho: stock[i].Ancho,
            Peso: stock[i].Peso,
        })
        await nuevoProducto.save()
    }
    res.send(JSON.stringify("Cargados"))
})



module.exports = router
