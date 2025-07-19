//Express para crear las rutas
const express = require("express");
//Router de express
const router = express.Router();
//Cargamos controladores
const CoffeelogController = require("../controllers/coffeelog");
//Importamos el middleware de autenticación
const auth = require("../middlewares/auth");
//Importamos el middleware del multer
const { uploadsPublication } = require("../middlewares/upload");

//Definimos rutas

router.post("", [auth.auth, uploadsPublication.single("file0")], CoffeelogController.createRegister); //Ruta para crear registro

router.get("/coffee/:id", auth.auth, CoffeelogController.viewCoffe); //Ruta para comprobar el cofeelog completo

router.get("/search/:id", auth.auth, CoffeelogController.searchCoffee); //Ruta para filtrar el coffelog

router.get("/:id/:page?", auth.auth, CoffeelogController.viewRegister); //Ruta para comprobar el cofeelog completo

router.delete("/:id", auth.auth, CoffeelogController.deleteRegister); //Ruta para eliminar un registro

router.put("/update/:id", auth.auth, CoffeelogController.updateRegister) //Ruta para actualizar registros

router.put("/media/:id", [auth.auth, uploadsPublication.single("file0")], CoffeelogController.addMediaRegister) //Ruta para agregar mas imagenes al registro

router.delete("/media/:id", auth.auth, CoffeelogController.deleteMediaRegister) //Ruta para eliminar imagenes del registro

//Exportamos el router
module.exports = router;