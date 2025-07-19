//Express para crear las rutas
const express = require("express");
//Router de express
const router = express.Router();
//Cargamos controlador
const PublicationController = require("../controllers/publication");
//Middleware de autenticacion
const auth = require("../middlewares/auth");
//Importamos el multer para la subida de media
const { uploadsPosts } = require("../middlewares/upload");

//Definimos rutas
router.post("", [auth.auth, uploadsPosts.array("file0", 5) ], PublicationController.createPublication); //EndPoint para crear una publicacion (permitimos hasta 5 imagenes)

router.post("/post/comment/:id", auth.auth, PublicationController.addComent); //EndPoint para agregar comentario a una publicación

router.post("/post/like/:id", auth.auth, PublicationController.like); //EndPoint para agregar un like a una publicación

router.delete("/post/:id", auth.auth, PublicationController.deletePublication); //EndPoint para eliminar una publicacion concreta

router.delete("/post/:idPublication/comment/:idComment", auth.auth, PublicationController.deleteComent); //EndPoint para eliminar un comentario de la publicación

router.get("/post/:id", auth.auth,  PublicationController.showOnePost); //EndPoint para ver un post concreto (id post)

router.get("/feed/:page?", auth.auth, PublicationController.feed); //EndPoint para ver el feed de las personas que sigo

router.get("/:id/:page?", auth.auth, PublicationController.showPosts); //EndPoint para ver todos los posts de un usuario (id)

router.put("/post/:id", auth.auth, PublicationController.updatePost); //EndPoint para editar un post concreto (no tiene en cuenta las imagenes)

router.put("/post/:idPublication/comment/:idComment", auth.auth, PublicationController.updateComent); //EndPoint para eliminar un editar de la publicación

router.put("/post/media/:id", [auth.auth, uploadsPosts.single("file0")], PublicationController.addMediaPost); //EndPoint para agregar imagenes (si no esta completo) al post

router.delete("/post/media/:id", auth.auth, PublicationController.deleteMediaPost); //EndPoint para eliminar imagenes (si no queda 1) al post



//Exportamos el router
module.exports = router;
