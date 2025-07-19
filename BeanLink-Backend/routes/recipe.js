//Express para crear las rutas
const express = require("express");
//Router de express
const router = express.Router();
//Cargamos controladores
const RecipeController = require("../controllers/recipe");
//Importamos el middleware de autenticacion
const auth = require("../middlewares/auth");

//Definimos rutas

router.post("/recipe", auth.auth, RecipeController.createRecipe); //EndPoint para crear receta

router.delete("/recipe/:id", auth.auth, RecipeController.deleteRecipe); //EndPoint para eliminar receta

router.put("/recipe/:id", auth.auth, RecipeController.updateRecipe); //EndPoint para actualizar el contenido de una receta

router.get("/recipe/:id", auth.auth, RecipeController.showRecipe); //EndPoint para ver una de las recetas

router.get("/search/:id", auth.auth, RecipeController.searchRecipe); //Ruta para filtrar en las recetas

router.get("/:id/:page?", auth.auth, RecipeController.showRecipes); //EndPoint para ver las recetas de un usuario


//Exportamos router
module.exports = router;