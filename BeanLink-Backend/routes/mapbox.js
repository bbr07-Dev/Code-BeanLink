//Espress para crear las rutas
const express = require("express");
//Router de express
const router = express.Router();
//Importamos el controlador de mapbox
const mapboxController = require("../controllers/mapbox");
//Importamos el middleware de autenticación
const auth = require("../middlewares/auth");

// Rutas para los servicios de Mapbox
router.get("/static-image", auth.auth, mapboxController.getStaticImage); //Petición de imagen estatica

router.get("/geocode", auth.auth, mapboxController.getGeocoding); //Petición inversa para obtener direccion por geocoding

module.exports = router;
