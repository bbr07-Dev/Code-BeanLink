//Importamos express para poder crear el servidor de node
const express = require("express");
//Importamos el cors para poder usarlo
const cors = require("cors");
//Importamos la base de datos
const { connectDB } = require("./database/connection");
//Cargamos las rutas
const routes_user = require("./routes/user"); //Rutas de usuario
const follow_routes = require("./routes/follow"); //Rutas de follow
const coffeelog_routes = require("./routes/coffeelog"); //Rutas del coffeelog
const publication_routes = require("./routes/publication"); //Rutas de publication
const recipes_routes = require("./routes/recipe"); //Rutas de las recetas
const map_routes = require("./routes/mapbox"); //Rutas para peticiones de mapa
//Servicio de nodemailer para el correo
const { sendSupportMail, sendFeedbackMail } = require("./services/nodemailer");

require("dotenv").config(); // cargar las variables de entorno

//Inicializamos la APP
console.log("App de node inicializada");

//Hacemos la conexión con la base de datos
connectDB();

//Cremos el servidor de node
const app = express();
//Indicamos el puerto al que nos conectamos
const puerto = process.env.PORT;

// Configuración opciones de CORS
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://beanlink.es',
        'https://www.beanlink.es',
        'https://3mvhcs1x-3000.uks1.devtunnels.ms'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ← ¡Añade OPTIONS!
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
//Configuración de cors para tunnel
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin) return callback(null, true); // Permite peticiones sin 'origin' (Postman, localhost directo)
//     callback(null, true); // Permite cualquier origen
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };

app.use(cors(corsOptions));

//Leer y convertir el body a un objeto de JavaScript
app.use(express.json());
//Cualquier dato que llegue con formato urlencoded lo convierte a json
app.use(express.urlencoded({ extended: true }));
//Crear rutas
app.get("/", (req, res) => {
  res.status(200).json({
    message: "CORS configurado para dominios autorizados", // ← Mensaje genérico
    allowedOrigins: corsOptions.origin, // Opcional: mostrar dominios permitidos
  });
});

/*
  Ruta para envio de mensaje de soporte (formulario landing page contacto)
  No agregamos a ningun controlador porque no corresponde realmente a ninguno
*/
app.post("/api/send/support-message", async (req, res) => {
  try {
    //Recogemos los parametros del formulario
    const { name, email, message } = req.body;
    //Comprobamos que estén todos
    if (!name || !email || !message) {
      return res.status(400).send({
        status: "error",
        message: "Todos los campos son obligatorios",
      });
    }
    //Enviamos el correo al soporte de la plataforma
    await sendSupportMail(email, name, message);
    //Enviamos el correo de feedback al usuario
    await sendFeedbackMail(email, name, message);
    return res.status(200).send({
      status: "success",
      message: "Correo enviado correctamente",
    });
  } catch (e) {
    return res.status(500).send({
      status: "error",
      message: "Hubo un error al enviar el correo a soporte",
      error: e.message,
    });
  }
});

app.use("/api", routes_user); //Rutas relacionadas con los usuarios

app.use("/api", follow_routes); //Rutas relacionadas con los follows

app.use("/api/coffeelog", coffeelog_routes); //Rutas relacionadas con el coffeelog

app.use("/api/posts", publication_routes); //Rutas relacionadas con las publicaciones

app.use("/api/recipes", recipes_routes); //Rutas relacionadas con las recetas

app.use("/api/mapbox", map_routes); //Rutas relacionadas con el mapa

//Crear servidor y escuchar peticiones
app.listen(puerto, () => {
  //Funcion de callback para que nos devuelva un mensaje
  console.log(`Servidor corriendo en el puerto ${puerto}`);
});
