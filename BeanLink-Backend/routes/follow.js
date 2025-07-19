//Express para crear las rutas
const express = require("express");
//Router de express
const router = express.Router();
//Cargamos controladores
const FollowController = require ("../controllers/follow");
//Middleware para la autenticación de usuarios
const auth = require("../middlewares/auth");

//Definimos rutas
router.post("/follow", auth.auth, FollowController.follow); //EndPoint para seguir a un usuario desde otro loggeado

router.delete("/unfollow/:id", auth.auth, FollowController.unfollow); //EndPoint para dejar de seguir a un usuario desde otro loggeado

router.get("/followings/:id/:page?", auth.auth, FollowController.following); //EndPint para listado de personas que sigo

router.get("/followers/:id/:page?", auth.auth, FollowController.followers); //EndPint para listado de personas que nos siguen

//Expostamos router
module.exports = router;