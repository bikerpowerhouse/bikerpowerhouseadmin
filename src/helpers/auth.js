const helpers = {};

//ingresa al inicio de facturacion
helpers.isAuthenticatedDuroc = (req, res, next) => {
  
  if (req.isAuthenticated()) {
    let Master = req.user.Role.find((element) => element == "Master");
    let Seller = req.user.Role.find((element) => element == "Seller");
    let Client = req.user.Role.find((element) => element == "Client");
    let Cliente = req.user.Role.find((element) => element == "Cliente");
    let Contabilidad = req.user.Role.find((element) => element == "Contabilidad");
    let Estadisticas = req.user.Role.find((element) => element == "Estadisticas");
    let Facturacion = req.user.Role.find((element) => element == "Facturacion");
    let Inventario = req.user.Role.find((element) => element == "Inventario");
    let Proveedor = req.user.Role.find((element) => element == "Proveedor");
    let Registro = req.user.Role.find((element) => element == "Registro");
    let Tareas = req.user.Role.find((element) => element == "Tareas");
    let Transporte = req.user.Role.find((element) => element == "Transporte");
    let Vendedor = req.user.Role.find((element) => element == "Vendedor");
    let UsuariosAdministrativos = req.user.Role.find((element) => element == "UsuariosAdministrativos");
    
    if (req.isAuthenticated() && (
      Master ||
      Seller ||
      Client ||
      Cliente ||
      UsuariosAdministrativos ||
      Contabilidad ||
      Estadisticas ||
      Facturacion ||
      Inventario ||
      Proveedor ||
      Registro ||
      Tareas ||
      Transporte ||
      Vendedor
      )){
      return next();
    }
  }
  req.flash("error", "Sesión finalizada.");
  res.redirect("/iniciar-sesion");
};

//Ingreso a facturacion
helpers.isAuthenticatedMaster = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Master = req.user.Role.find((element) => element == "Master");

    if (req.isAuthenticated() && (Master)) {
      return next();
    }
  }
  req.flash("error", "Usuario pendiente de aprobacion");
  res.redirect("/home");
};
//Ingreso en clientes
helpers.isAuthenticatedUsuariosAdministrativos = (req, res, next) => {
  if (req.isAuthenticated()) {
    let UsuariosAdministrativos = req.user.Role.find((element) => element == "UsuariosAdministrativos");
    let Master = req.user.Role.find((element) => element == "Master");


    if (req.isAuthenticated() && (UsuariosAdministrativos || Master)) {
      return next();
    }
  }
  req.flash("error", "Usuario no autorizado");
  res.redirect("/home");
};
helpers.isAuthenticatedCliente = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Cliente = req.user.Role.find((element) => element == "Cliente");
    let Master = req.user.Role.find((element) => element == "Master");


    if (req.isAuthenticated() && (Cliente || Master)) {
      return next();
    }
  }
  req.flash("error", "Usuario no autorizado");
  res.redirect("/home");
};
//Ingreso en Contabilidad
helpers.isAuthenticatedContabilidad = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Contabilidad = req.user.Role.find((element) => element == "Contabilidad");
    let Master = req.user.Role.find((element) => element == "Master");

    if (req.isAuthenticated() && (Contabilidad || Master)) {
      return next();
    }
  }
  req.flash("error", "Usuario no autorizado");
  res.redirect("/home");
};
//Ingreso en Estadisticas
helpers.isAuthenticatedEstadisticas = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Estadisticas = req.user.Role.find((element) => element == "Estadisticas");
    let Master = req.user.Role.find((element) => element == "Master");


    if (req.isAuthenticated() && (Estadisticas || Master)) {
      return next();
    }
  }
  req.flash("error", "Usuario no autorizado");
  res.redirect("/home");
};
//Ingreso en Facturacion
helpers.isAuthenticatedFacturacion = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Facturacion = req.user.Role.find((element) => element == "Facturacion");
    let Master = req.user.Role.find((element) => element == "Master");


    if (req.isAuthenticated() && (Facturacion || Master)) {
      return next();
    }
  }
  req.flash("error", "Usuario no autorizado");
  res.redirect("/home");
};
//Ingreso en Inventario
helpers.isAuthenticatedInventario = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Inventario = req.user.Role.find((element) => element == "Inventario");
    let Master = req.user.Role.find((element) => element == "Master");


    if (req.isAuthenticated() && (Inventario || Master)) {
      return next();
    }
  }
  req.flash("error", "Usuario no autorizado");
  res.redirect("/home");
};
//Ingreso en Proveedor
helpers.isAuthenticatedProveedor = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Proveedor = req.user.Role.find((element) => element == "Proveedor");
    let Master = req.user.Role.find((element) => element == "Master");


    if (req.isAuthenticated() && (Proveedor || Master)) {
      return next();
    }
  }
  req.flash("error", "Usuario no autorizado");
  res.redirect("/home");
};
//Ingreso en Registro
helpers.isAuthenticatedRegistro = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Registro = req.user.Role.find((element) => element == "Registro");
    let Master = req.user.Role.find((element) => element == "Master");


    if (req.isAuthenticated() && (Registro || Master)) {
      return next();
    }
  }
  req.flash("error", "Usuario no autorizado");
  res.redirect("/home");
};
//Ingreso en Tareas
helpers.isAuthenticatedTareas = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Tareas = req.user.Role.find((element) => element == "Tareas");
    let Master = req.user.Role.find((element) => element == "Master");


    if (req.isAuthenticated() && (Tareas || Master)) {
      return next();
    }
  }
  req.flash("error", "Usuario no autorizado");
  res.redirect("/home");
};
//Ingreso en Transporte
helpers.isAuthenticatedTransporte = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Transporte = req.user.Role.find((element) => element == "Transporte");
    let Master = req.user.Role.find((element) => element == "Master");


    if (req.isAuthenticated() && (Transporte || Master)) {
      return next();
    }
  }
  req.flash("error", "Usuario no autorizado");
  res.redirect("/home");
};
//Ingreso en Vendedor
helpers.isAuthenticatedVendedor = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Vendedor = req.user.Role.find((element) => element == "Vendedor");
    let Master = req.user.Role.find((element) => element == "Master");


    if (req.isAuthenticated() && (Vendedor || Master)) {
      return next();
    }
  }
  req.flash("error", "Usuario no autorizado");
  res.redirect("/home");
};
//Ingreso en seller
helpers.isAuthenticatedSeller = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Seller = req.user.Role.find((element) => element == "Seller");
    let Master = req.user.Role.find((element) => element == "Master");


    if (req.isAuthenticated() && (Seller || Master)) {
      return next();
    }
  }
  req.flash("error", "Sesión finalizada");
  res.redirect("/iniciar-sesion");
};
//Ingreso en Client
helpers.isAuthenticatedClient = (req, res, next) => {
  if (req.isAuthenticated()) {
    let Client = req.user.Role.find((element) => element == "Client");
    let Master = req.user.Role.find((element) => element == "Master");


    if (req.isAuthenticated() && (Client || Master)) {
      return next();
    }
  }
  req.flash("error", "Sesión finalizada");
  res.redirect("/iniciar-sesion");
};



module.exports = helpers;
