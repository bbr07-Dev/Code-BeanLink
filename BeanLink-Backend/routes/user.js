//Express para crear las rutas
const express = require("express");
//Router de express
const router = express.Router();
//Cargamos controladores
const UserController = require("../controllers/user");
//Importamos el middleware de autenticación
const auth = require("../middlewares/auth");
//Importamos el middleware del multer
const { uploads } = require("../middlewares/upload");
//Importamos el middleware para el token temporal por olvido de contraseña
const {validateResetToken} = require ("../middlewares/resetAuth");

//Definimos rutas
router.post("/auth/register", UserController.register); //EndPoint para registrar un usuario nuevo

router.post("/auth/login", UserController.login); //EndPoint para iniciar sesión con un usuario

router.get("/users/search", auth.auth, UserController.searchUser); //EndPoint para buscar usuarios

router.get("/users/location/search", auth.auth, UserController.searchUsersMap); //EndPoint para buscar usuarios

router.put("/users/update/:id", auth.auth, UserController.update); //EndPoint para actualizar la información de un usuario

router.get("/users/:id", auth.auth, UserController.showMe); //EndPoint para mostrar el perfil del usuario conectado por token

router.put("/users/avatar/:id", [uploads.single("file0"), auth.auth], UserController.uploadAvatar); //EndPoint para actualizar o subir la foto de perfil

router.delete("/users/:id", auth.auth, UserController.deleteUser); //EndPoint para eliminar un usuario de la BD

router.post("/user/forgot-password", UserController.forgotPassword); //EndPoint para enviar correo por olvido de contraseña

router.post("/user/reset-password", validateResetToken, UserController.resetPassword); //EndPoint para restablcer contraseña


//Exportamos el router
module.exports = router;                                                                                                                                                                        