if(process.env.NODE_ENV !==  "production"){
    require('dotenv').config()
  }
  
  const express = require("express");
  const path = require("path");
  const exphbs = require("express-handlebars");
  const methodOverride = require("method-override");
  const expressSession = require("express-session");
  const bodyParser = require("body-parser");
  const cors = require("cors");
  const passport = require("passport");
  const flash = require("connect-flash");
  const xl = require('excel4node');
  const cron = require("node-cron");
  const cambioFacturacionDB = require('./models/cambioFacturacion');


  

  
  //Inicializacion
  const app = express();
  require("./database");
  require("./config/passport")
  
  //Configuraciones


  
  app.set("port", process.env.PORT || 5050);
  app.set("views", path.join(__dirname, "views"));
  app.engine(
    ".hbs",
    exphbs({
      defaultLayout: "main",
      layoutsDir: path.join(app.get("views"), "layout"),
      partialsDir: path.join(app.get("views"), "partials"),
      extname: ".hbs",
    })
  );
  app.set("view engine", ".hbs");
  
  //Middlewears

  app.use(express.urlencoded({ extended: false }));
  app.use(methodOverride("_method"));
   app.use(
    expressSession({
      secret: process.env.MYALL,
      resave: true,
      saveUninitialized: true,
    })
    ) 
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use(flash())
  cron.schedule('0 17 * * *', async () => {
    let cambioFacturacion = await cambioFacturacionDB.find()
    if(cambioFacturacion.length == 0){
      let nuevoCambioFacturacion = new cambioFacturacionDB({
        Cambio: 0,
        FechaActualizacion: 0,
        NumeroActualizacionDiaria: 0,
      })
      nuevoCambioFacturacion.save()
    }else{
      await cambioFacturacionDB.findByIdAndUpdate(cambioFacturacion[0]._id,{
        Estado: "Desactualizado"
      })
    }

  })
  cron.schedule('0 13 * * *', async () => {
    console.log("Entrando")
    let cambioFacturacion = await cambioFacturacionDB.find()
    if(cambioFacturacion.length == 0){
      console.log("No existe creamos")
      let nuevoCambioFacturacion = new cambioFacturacionDB({
        Cambio: 0,
        FechaActualizacion: 0,
        NumeroActualizacionDiaria: 0,
      })
      nuevoCambioFacturacion.save()
    }else{
      console.log("Existe actualizamos")
      await cambioFacturacionDB.findByIdAndUpdate(cambioFacturacion[0]._id,{
        Estado: "Desactualizado"
      })
    }
  })
  //Variables globales
  app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
  })
  app.use((req, res, next)=> {
    res.locals.error = req.flash('error');
    next()
  })
  
  app.use((req, res, next)=> {
    res.locals.success = req.flash('success');
    next()
  })
  
  //Rutas
  app.use(require("./routes/administracion"));
  app.use(require("./routes/seller"));
  app.use(require("./routes/client"));
  
  //Archivos estaticos
  
  app.use(express.static(path.join(__dirname, "public")));
  
  //Iniciar server
  
  app.listen(app.get("port"), () => {
    console.log("Escuchando en " + app.get("port"));
  });
