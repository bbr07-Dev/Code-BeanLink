//Importamos el modelo publication
const Publication = require("../models/Publication");
//Necesitamos cloudinary para la subida de media
const { cloudinary } = require("../services/cloudinary");
//Validador de imagen
const {
  validatePostMedia,
  validateAvatarUserUpload,
} = require("../services/validatorService");
//Importamos servicio de follows
const followService = require("../services/followers");

//Accion para crear una nueva publicacion
const createPublication = async (req, res) => {
  //Recogemos la cabecera de autenticacion del usuario (propietario publicacion)
  const userOwner = req.user.id;
  //Recogemos los parametros del body (informacion publicacion)
  const params = req.body;
  //Validamos que nos llegan los campos obligatorios
  if (!params.text && !req.files) {
    return res.status(400).send({
      status: "error",
      message: "Faltan datos por enviar",
    });
  }
  // //Validamos la imagen del post (que tenga un formato correcto)
  let { valid, errors } = validatePostMedia(req.files);
  if (!valid) {
    return res.status(400).send({
      status: "error",
      message: "Error en la validación de las imagenes",
      errors,
    });
  }
  // Obtener las URLs seguras de Cloudinary de cada archivo en el array
  const mediaUrls = req.files.map((file) => file.path);
  //Creamos el post agregando el usuario y las url de las imagenes
  const post = { ...params, user: userOwner, media: mediaUrls };
  //Creamos el registro en la bd
  try {
    const newPost = new Publication(post);
    //Guardamos el nuevo cafe
    const request = await newPost.save();
    if (!request) {
      return res.status(401).send({
        status: "error",
        message: "No se ha guardado la publicación",
      });
    }
    //Devolvemos el resultado
    return res.status(200).send({
      status: "success",
      message: "Publicación guardada",
      publication: request,
    });
  } catch (e) {
    return res.status(401).send({
      status: "error",
      message: "No se ha podido crear la publicacion",
    });
  }
};

//Accion para eliminar una nueva publicación
const deletePublication = async (req, res) => {
  //Recogemos el id de la publicación que queremos eliminar
  const idPostToDelete = req.params.id;
  //Recogemos el id del usuario logueado
  const idUser = req.user.id;

  try {
    // Buscar la publicación para obtener las imágenes asociadas (suponiendo que las imágenes están en un campo 'media' en el modelo)
    const postToDelete = await Publication.findOne({
      _id: idPostToDelete,
      user: idUser,
    });
    // Si no encontramos el post, retornamos error
    if (!postToDelete) {
      return res.status(404).send({
        status: "error",
        message: `No existe el post con ID ${idPostToDelete} o no pertenece al usuario ${idUser}`,
      });
    }

    // Si el post tiene imágenes, procedemos a eliminarlas de Cloudinary
    if (postToDelete.media && postToDelete.media.length > 0) {
      // Creamos un array de promesas de eliminación de imágenes de Cloudinary
      const deletePromises = postToDelete.media.map((image) => {
        // Extraemos el public_id de la ruta de la imagen
        const urlParts = image.split("/"); // Separa la URL en partes por "/"
        const publicId = `posts/${idUser}/${urlParts.pop().split(".")[0]}`; // Toma todas las partes después del primer "/" y elimina la extensión
        return cloudinary.uploader.destroy(publicId); // Eliminamos la imagen de Cloudinary
      });
      // Esperamos a que todas las imágenes sean eliminadas
      await Promise.all(deletePromises);
    }

    // Ahora, eliminamos el post de la base de datos
    const postDeleted = await Publication.findOneAndDelete({
      _id: idPostToDelete,
      user: idUser,
    }).populate("user", "username avatar");

    // Verificamos si el post fue realmente eliminado
    if (!postDeleted) {
      return res.status(404).send({
        status: "error",
        message: `No se pudo eliminar el post con ID ${idPostToDelete}`,
      });
    }

    // Respuesta exitosa
    return res.status(200).send({
      status: "success",
      message: "Publicación y sus imágenes han sido eliminadas con éxito",
      postDeleted,
    });
  } catch (e) {
    // Capturamos cualquier error y respondemos
    console.error(e);
    return res.status(400).send({
      status: "error",
      message: "No se ha podido eliminar la publicación",
    });
  }
};

//Accion para obtener todos los POSTS de un usuario
const showPosts = async (req, res) => {
  //Obtenemos el id del usuario del que queremos ver todos los posts
  const userToShow = req.params.id;
  //Comprobamos si nos llega una pagina (por defecto 1)
  const page = req.params.page ? parseInt(req.params.page) : 1;
  //Cuantas publicaciones por pagina mostramos
  const itemsPerPage = 12;
  //Configuramos las opciones de paginacion
  const options = {
    page: page,
    limit: itemsPerPage,
    populate: [
      { path: "user", select: "username avatar" },
      {
        path: "recipe",
        select: "title method coffee",
      },
      { path: "comments.user", select: "username avatar" },
    ],
    sort: { created_at: -1 },
  };
  try {
    //Realizamos la paginacion usando el plugin y la configuracion realizadas
    const result = await Publication.paginate({ user: userToShow }, options);
    if (!result.docs || result.docs.length === 0) {
      return res.status(404).send({
        status: "success",
        message: "No hay publicaciones todavia",
        total: 0,
      });
    }

    return res.status(200).send({
      status: "success",
      message: `Mostrando publicaciones del usuario ${userToShow}`,
      publications: result.docs,
      total: result.totalDocs,
      pages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No se han podido obtener las publicaciones",
      e: e.message,
    });
  }
};

//Accion para ver una publicacion concreta
const showOnePost = async (req, res) => {
  console.log("Show ONE POST");
  //Recogemos el id del post que queremos ver
  const idPostToShow = req.params.id;
  try {
    //Buscamos ese id de post en la bd
    const postToShow = await Publication.findById({
      _id: idPostToShow,
    }).populate([
      { path: "user", select: "username avatar" },
      { path: "recipe", select: "title method" },
      { path: "comments.user", select: "username avatar" },
    ]);
    if (!postToShow) {
      return res.status(404).send({
        status: "error",
        message: `No se ha encontrado un post con id ${idPostToShow}`,
      });
    }
    //Devolvemos respuesta
    return res.status(200).send({
      status: "success",
      message: "Post encontrado",
      post: postToShow,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No se ha podido mostrar el post",
      error: e.message,
    });
  }
};

//Accion para actualizar un post
const updatePost = async (req, res) => {
  //Recogemos los parametros que enviamos para actualizar el post
  const params = req.body;
  //Recogemos el id del post que vamos a eliminar
  const idPostToDelete = req.params.id;
  //Recogemos el token de autorizacion
  const idUser = req.user.id;
  try {
    //Buscamos la publicacion
    const publicationToUpdate = await Publication.findById({
      _id: idPostToDelete,
    });
    if (!publicationToUpdate) {
      return res.status(404).send({
        status: "error",
        message: `No se ha encontrado la publicación con ID ${idPostToDelete}`,
      });
    }
    //Comprobamos que el usuario propietario es el logueado o es administrador
    if (publicationToUpdate.user != idUser) {
      return res.status(403).send({
        status: "error",
        message: "No tienes permisos para modificar este registro",
      });
    }
    //Actualizamos la publicación con los nuevos datos
    let publicationUpdated = await Publication.findOneAndUpdate(
      { _id: idPostToDelete },
      params,
      { new: true }
    ).populate([
      { path: "user", select: "username avatar" },
      { path: "recipe", select: "title method" },
    ]);
    if (!publicationUpdated) {
      return res.status(400).send({
        status: "error",
        message: "No se ha eliminado la publicacion",
      });
    }
    //Si todo ha salido bien devolvemos resultado
    return res.status(200).send({
      status: "success",
      message: "Publicación actualizada correctamente",
      publication: publicationUpdated,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No se ha podidoa actualizar la publicacion",
      error: e.message,
    });
  }
};

//Accion para agregar media al POST
const addMediaPost = async (req, res) => {
  //Recogemos el id del registro que vamos a editar
  const idPost = req.params.id;
  //Recogemos el token de autorizacion de usuario logueado
  const idUser = req.user.id;
  //Comprobamos que nos llega una imagen
  if (!req.file) {
    return res.status(401).send({
      status: "error",
      message: "Imagen no recibida",
    });
  }
  try {
    //Cmprobamos que la longitud de media del post que queremos editar no es ya de 5 imagenes
    const postToEdit = await Publication.findById({ _id: idPost });
    if (!postToEdit) {
      return res.status(404).send({
        status: "error",
        message: `No se ha encontrado el post con ID ${idPost}`,
      });
    }
    if (postToEdit.media.length >= 5) {
      return res.status(403).send({
        status: "error",
        message: "Ya se ha superado el numero de imagenes por publicación",
      });
    }
    //Comprobamos que el usuario propietario del post y el logueado es el mismo (o es administrador)
    if (postToEdit.user != idUser) {
      return res.status(403).send({
        status: "error",
        message: "No tienes permisos para actualizar este post",
      });
    }
    //Validamos la imagen de la publicacion (formato correcto)
    let { valid, errors } = validateAvatarUserUpload(req.file);
    if (!valid) {
      return res.status(400).send({
        status: "error",
        message: "Error en la validación de la imagen",
        errors,
      });
    }
    //Obtenemos la URL segura de la imagen en Cloudinary
    const mediaUrl = req.file.path;

    //Buscamos y actualizamos el post agregando la nueva imagen al array media
    const updatedPost = await Publication.findOneAndUpdate(
      { _id: idPost },
      { $push: { media: mediaUrl } }, //Agregamos al array media la nueva URL
      { new: true } //Devolvemos el actualizado
    ).populate("user", "username avatar");
    //Comprobamos que se ha actualizado
    if (!updatePost) {
      return res.status(400).send({
        status: "error",
        message: "No se ha actualizado la nueva imagen",
      });
    }
    //Devolvemos resultado
    return res.status(200).send({
      status: "success",
      message: "Se ha actualizado el post correctamente",
      publication: updatedPost,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No se ha podido agregar la imagen",
      error: e.message,
    });
  }
};

//Accion para eliminar media del POST
const deleteMediaPost = async (req, res) => {
  //Obtenemos el id de publicacion a modificar
  const idPost = req.params.id;
  //Recogemos la url de la imagen que queremos eliminar
  const urlImage = req.body.url;
  //Recogemos el token de autorización del usuario logueado
  const idUser = req.user.id;
  try {
    //Buscamos el registro que queremos modificar en la bd
    const postToEdit = await Publication.findById({ _id: idPost });
    if (!postToEdit) {
      return res.status(404).send({
        status: "error",
        message: `No se ha encontrado el post con ID ${idPost}`,
      });
    }
    //Comprobamos que el usuario logueado y el propietario es el mismo (o es administrador)
    if (postToEdit.user != idUser) {
      return res.status(403).send({
        status: "error",
        message: "No tienes permisos para actualizar este post",
      });
    }
    //Comprobamos que se ha enviado la url de la imagen a eliminar
    if (!urlImage) {
      return res.status(404).send({
        status: "error",
        message: "No se ha enviado la imagen a eliminar (url)",
      });
    }
    //Comprobamos que el array media del post no iene solamente 1 ya (quedaria vacio)
    if (postToEdit.media.length <= 1) {
      return res.status(403).send({
        status: "error",
        message: "No puede haber menos imagenes",
      });
    }
    //Eliminamos la imagen de cloudinary
    const urlParts = urlImage.split("/");
    // Con pop() extraemos "imagen.jpg" y eliminamos la extensión para obtener el public_id
    const publicId = `posts/${idUser}/${urlParts.pop().split(".")[0]}`;
    // Eliminamos la imagen de Cloudinary usando el public_id
    await cloudinary.uploader.destroy(publicId);

    //Actualizamos la bd para eliminar la url del array media
    const result = await Publication.findByIdAndUpdate(
      { _id: idPost },
      { $pull: { media: urlImage } },
      { new: true }
    ).populate("user", "username avatar");
    if (!result) {
      return res.status(404).send({
        status: "error",
        message: "No se ha actualizado el registro",
      });
    }
    //Devolvemos resultado
    return res.status(200).send({
      status: "success",
      message: "Imagen eliminada correctamente",
      publication: result,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No se ha podido eliminar la imagen",
      errror: e.message,
    });
  }
};

//Accion para mostrar un Feed con las publicaciones de los usuarios que sigo
const feed = async (req, res) => {
  //Sacar pagina actual
  req.params.page ? (page = req.params.page) : (page = 1);
  //Establecer numero de elementos por pagina
  let itemsPerPage = 5;
  //Configuramos las opciones de configuración de paginación
  const options = {
    page: page,
    limit: itemsPerPage,
    populate: [
      { path: "user", select: "username avatar" },
      { path: "recipe", select: "title method" },
      { path: "comments.user", select: "username avatar" },
    ],
    sort: { created_at: -1 }, //Opcional, ordenar por fecha descendente
  };
  try {
    //Sacar un array de identificadores de usuarios que yo sigo como usuario loguado
    const myFollows = await followService.followUserIds(req.user.id);
    if (!myFollows) {
      return res.status(404).send({
        status: "error",
        message: "No se han encontrado seguidores ni seguidos",
      });
    }
    //Find o publicaciones IN
    const publications = await Publication.paginate(
      {
        user: myFollows.following,
      },
      options
    );

    if (!publications) {
      return res.status(404).send({
        status: "error",
        message:
          "No se han encontrado publicaciones para los uaurios sugeridos",
      });
    }
    //Devolvemos resultado
    return res.status(200).send({
      status: "success",
      message: "Feed de publicaciones",
      myFollows: myFollows.following,
      publications,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No hemos podido obtener el Feed",
      error: e.message,
    });
  }
};

//Accion para crear un comentario en la publicación
const addComent = async (req, res) => {
  //Recogemos parametro de id de usuario logueado (usuario comentador)
  const idUser = req.user.id;
  //Recogemos id del post que se está comentando
  const idPublication = req.params.id;
  //Recogemos el texto (contenido del comentario)
  const { text } = req.body;
  try {
    //Comprobamos que nos llega contenido
    if (!text || text.length === 0) {
      return res.status(400).send({
        status: "error",
        message: "No se ha obtenido contenido del comentario",
      });
    }
    //Comprobamos y obtenemos (si existe) el post cuyo id se envia por url
    const post = await Publication.findOneAndUpdate(
      { _id: idPublication },
      {
        $push: {
          comments: {
            user: idUser,
            text: text,
            created_at: new Date(),
          },
        },
      },
      { new: true }
    ).populate({
      path: "comments.user",
      select: "username avatar",
    });
    if (!post) {
      return res.status(404).send({
        status: "error",
        message: "No se ha encontrado la publicación solicitada",
      });
    }

    //Devolvemos resultado
    return res.status(200).send({
      status: "success",
      message: "Comentario agregado a la publicación",
      post,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No hemos podido comentar la publicación",
      error: e.message,
    });
  }
};

//Accion para editar un comentario
const updateComent = async (req, res) => {
  //Recogemos el id del comentario que queremos eliminar y de la publicacion que lo contiene
  const { idPublication, idComment } = req.params;
  //Recogemos el texto del comentario
  const { text } = req.body;
  //Recogemos el id del usuario logueado
  const idUser = req.user.id;
  try {
    //Buscamos la publicacion
    const publicationToUpdate = await Publication.findById({
      _id: idPublication,
    }).populate({
      path: "comments.user",
      select: "username avatar",
    });
    if (!publicationToUpdate) {
      return res.status(404).send({
        status: "error",
        message: "No hemos encontrado esa publicación",
      });
    }
    //Buscamos el comentario que queremos eliminar
    const commentToUpdate = publicationToUpdate.comments.id(idComment);
    if (!commentToUpdate) {
      return res.status(404).send({
        status: "error",
        message: "No se ha encontrado el comentario",
      });
    }
    //Comprobamos que el usuario del comentario y el logueado es el mismo
    if (idUser != commentToUpdate.user._id && idUser.role !== "admin") {
      return res.status(403).send({
        status: "error",
        message: "No tienes permisos para editar ese comentario",
      });
    }
    //Eliminamos del array comments
    commentToUpdate.text = text;
    commentToUpdate.created_at = new Date(); //Actualizamos la fecha del comentario tambien

    //Guardamos el cambio
    await publicationToUpdate.save();
    //Devolvemos resupuesta
    return res.status(200).send({
      status: "success",
      message: "Comentario editado correctamente",
      post: publicationToUpdate,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No hemos podido editar el comentario de la publicación",
      error: e.message,
    });
  }
};

//Accion para eliminar un comentario en la publicacion
const deleteComent = async (req, res) => {
  //Recogemos el id del comentario que queremos eliminar y de la publicacion que lo contiene
  const { idPublication, idComment } = req.params;
  //Recogemos el id del usuario logueado
  const idUser = req.user.id;
  try {
    //Buscamos la publicacion
    const publicationToUpdate = await Publication.findById({
      _id: idPublication,
    }).populate({
      path: "comments.user", // Aquí usamos `comments.user` para poblar los datos del usuario en cada comentario
      select: "username avatar", // Seleccionamos los campos que queremos del usuario (username y avatar)
    });
    if (!publicationToUpdate) {
      return res.status(404).send({
        status: "error",
        message: "No hemos encontrado esa publicación",
      });
    }
    //Buscamos el comentario que queremos eliminar
    const commentToDelete = publicationToUpdate.comments.id(idComment);
    if (!commentToDelete) {
      return res.status(404).send({
        status: "error",
        message: "No se ha encontrado el comentario",
      });
    }
    //Comprobamos que el usuario del comentario y el logueado es el mismo
    if (idUser != commentToDelete.user._id && idUser.role !== "admin") {
      return res.status(403).send({
        status: "error",
        message: "No tienes permisos para eliminar ese comentario",
        userLogued: idUser,
        idPropietario: commentToDelete.user,
      });
    }
    //Eliminamos del array comments
    publicationToUpdate.comments.pull(commentToDelete);
    //Guardamos el cambio
    await publicationToUpdate.save();
    //Devolvemos resupuesta
    return res.status(200).send({
      status: "success",
      message: "Comentario eliminado correctamente",
      post: publicationToUpdate,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No hemos podido eliminar el comentario de la publicación",
      error: e.message,
    });
  }
};

//Accion para agregar o quitar (si ya le hemos dado) un like a la publicacion
const like = async (req, res) => {
  //Recogemos parametro de id de usuario logueado (usuario comentador)
  const idUser = req.user.id;
  //Recogemos id del post que se está dando like
  const idPublication = req.params.id;
  try {
    // Verificamos si el usuario ya ha dado like para evitar duplicados
    const post = await Publication.findById(idPublication);
    if (!post) {
      return res.status(404).send({
        status: "error",
        message: "No se ha encontrado la publicación solicitada",
      });
    }

    // Si el usuario ya dio like, lo removemos (toggle like)
    if (post.likes.includes(idUser)) {
      const publication = await Publication.findByIdAndUpdate(
        idPublication,
        { $pull: { likes: idUser } }, // Quita el like
        { new: true }
      );
      return res.status(200).send({
        status: "success",
        message: "Like eliminado",
        publication,
      });
    }
    // Si no ha dado like, lo agregamos
    const updatedPost = await Publication.findByIdAndUpdate(
      idPublication,
      { $push: { likes: idUser } }, // Agrega el like
      { new: true }
    ).populate({
      path: "comments.user",
      select: "username avatar",
    });

    return res.status(200).send({
      status: "success",
      message: "Like agregado a la publicación",
      post: updatedPost,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No hemos podido agregar like a la publicación",
      error: e.message,
    });
  }
};

module.exports = {
  createPublication,
  deletePublication,
  showPosts,
  showOnePost,
  updatePost,
  addMediaPost,
  deleteMediaPost,
  feed,
  addComent,
  updateComent,
  deleteComent,
  like,
};
