const Coffeelog = require("../models/Coffeelog");
const { cloudinary } = require("../services/cloudinary");
//Validador de imagen
const { validateAvatarUserUpload } = require("../services/validatorService");

//Accion para crear una nueva entrada en el coffeLog
const createRegister = async (req, res) => {
  //Recogemos el token del usuario autenticado (que es al que va a pertenecer el registro)
  const userOwner = req.user.id;
  //Recogemos parametros enviados por el body
  const params = req.body;
  //Validamos que nos llegan los campos obligatorios
  if (!params.coffeeName && !req.file) {
    //Agregamos mensaje de error
    return res.status(400).send({
      status: "error",
      message: "Faltan datos obligatorios por enviar (Nombre y media)",
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
  //Obtenemos la url segura de cloudinary
  const mediaUrl = req.file.path;

  //Comprobamos que el score enviado se encuentra entre 80 y 100
  if (params.score < 80 || params.score > 100 || params.score === "NaN") {
    return res.status(400).send({
      status: "error",
      message: "La puntuación SCA no esta entre 80 y 100",
    });
  }

  try {
    //Buscamos en la bd que no tengamos ya un cafe con ese nombre
    let coffeSaved = await Coffeelog.find({
      coffeeName: params.coffeeName,
      user: userOwner,
    });
    if (coffeSaved && coffeSaved.length >= 1) {
      return res.status(401).send({
        status: "error",
        message: "El cafe con ese nombre ya existe",
      });
    }
    //Creamos el cafe agregando el usuario logueado
    const coffe = { ...params, user: userOwner, media: mediaUrl };
    //Creamos el registro en la bd
    const newCoffe = new Coffeelog(coffe);
    //Guardamos el nuevo cafe
    const request = await newCoffe.save();
    //Devolvemos resultado
    if (request) {
      return res.status(200).send({
        status: "success",
        message: "Café registrado correctamente",
        coffe,
      });
    }
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "Registro de cafe fallido",
      error: e.message,
    });
  }
};

//Accion para listar todas las entradas del coffelog del usuario con id enviado por params
const viewRegister = async (req, res) => {
  //Obtenemos el token del usuario autenticado
  const userLogued = req.user.id;
  //Obtenemos el id del usuario que nos envia por parametro
  const userOwner = req.params.id;
  //Variable para permitir o no la edicion
  let editionPermited = false;
  userLogued !== userOwner && userLogued.role !== "admin"
    ? (editionPermited = false)
    : (editionPermited = true);
  //Comprobar si nos llega la page, por def = 1
  const page = req.params.page ? parseInt(req.params.page) : 1;
  //Cuantos usuarios por pagina mostramos
  const itemsPerPage = 8;
  //Configuramos las opciones de configuración de paginación
  const options = {
    page: page,
    limit: itemsPerPage,
    sort: { created_at: -1 }, //Opcional, ordenar por fecha descendente
  };
  try {
    //Buscamos todos los registros que tienen user = userOwner
    const coffeLogs = await Coffeelog.paginate({ user: userOwner }, options);
    // console.log(coffeLogs)
    //Si no encontramos registro lanzamos mensaje
    if (!coffeLogs.docs || coffeLogs.docs.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "No se encontraron registros de cafe para este usuario",
      });
    }
    //Dejamos solo los parametros que nos interesan
    const coffeData = coffeLogs.docs.map((coffe) => ({
      coffeeName: coffe.coffeeName,
      id: coffe._id,
      origin: coffe.origin,
      high: coffe.high,
      varietal: coffe.varietal,
      process: coffe.process,
      score: coffe.score,
      media: coffe.media,
      roaster: coffe.roaster,
      tastingNotes: coffe.tastingNotes,
      brewMethod: coffe.brewMethod,
      notes: coffe.notes,
    }));
    //Si lo encontramos, lo devolvemos
    return res.status(200).send({
      status: "success",
      message: "Registro de cafes encontrados",
      coffeLogs: coffeData,
      total: coffeLogs.totalDocs,
      pages: coffeLogs.totalPages,
      hasPrevPage: coffeLogs.hasPrevPage,
      hasNextPage: coffeLogs.hasNextPage,
      editionPermited,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No se pudo obtener los registros de café",
      error: e.message,
    });
  }
};

//Accion para ver solo 1 cafe del registro
const viewCoffe = async (req, res) => {
  //Recogemos el id del cafe que queremos ver
  const idCoffe = req.params.id;
  try {
    const coffeToView = await Coffeelog.findById({ _id: idCoffe });
    if (!coffeToView) {
      return res.status(404).send({
        status: "error",
        message: `No hemos podido localizar el cafe con ID ${idCoffe}`,
      });
    }
    //Devolvemos resultado
    return res.status(200).send({
      status: "success",
      message: "Cafe encontrado",
      coffee: coffeToView,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No hemos podido mostrar el cafe",
      error: e.message,
    });
  }
};

//Accion para actualizar un registro en la bd
const updateRegister = async (req, res) => {
  //Recogemos los parametros que nos envian por el body
  const params = req.body;
  //Recogemos el id del registro que vamos a eliminar
  const idCoffee = req.params.id;
  //Recogemos el token de autorización
  const idUser = req.user.id;
  try {
    //Actualizar el registro con los nuevos datos
    let registerToUpdate = await Coffeelog.findOneAndUpdate(
      { _id: idCoffee, user: idUser },
      params,
      { new: true }
    );
    //Comprobar que tenemos algun resultado
    if (!registerToUpdate) {
      return res.status(404).send({
        status: "error",
        message: "No se ha podido encontrar el registro indicado",
      });
    }
    //Devolver resultado
    return res.status(200).send({
      status: "success",
      message: "Registro actualizado",
      coffe: registerToUpdate,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No se ha podido actualizar el registro",
      error: e.message,
    });
  }
};

//Accion para eliminar un registro en la bd
const deleteRegister = async (req, res) => {
  //Obtenemos el id del elemento que queremos eliminar pasado por url
  const idCoffee = req.params.id;
  //Obtenemos el token de autenticacion de usuario del header
  const idUser = req.user.id;
  try {
    //Buscamos el registro de cafe para ver las imagenes asociadas
    const coffeToDelete = await Coffeelog.findOne({
      _id: idCoffee,
      user: idUser,
    });
    //Si no encontramos el post retornamos el error
    if (!coffeToDelete) {
      return res.status(404).send({
        status: "error",
        message: `No existe el post con ID ${coffeToDelete} o no pertenece al usuario ${idUser}`,
      });
    }
    //Si el registro de cafe, tiene imagenes procedemos a eliminarlos de cloudinary
    if (coffeToDelete.media && coffeToDelete.media.length > 0) {
      // Creamos un array de promesas de eliminación de imágenes de Cloudinary
      const deletePromises = coffeToDelete.media.map((image) => {
        // Extraemos el public_id de la ruta de la imagen
        const urlParts = image.split("/"); // Separa la URL en partes por "/"
        const publicId = `coffelog/${idUser}/${urlParts.pop().split(".")[0]}`; // Toma todas las partes después del primer "/" y elimina la extensión
        return cloudinary.uploader.destroy(publicId); // Eliminamos la imagen de Cloudinary
      });
      // Esperamos a que todas las imágenes sean eliminadas
      await Promise.all(deletePromises);
    }
    //Ahora eliminamos el cafe de la base de datos
    const coffeDeleted = await Coffeelog.findOneAndDelete({
      _id: idCoffee,
      user: idUser,
    }).populate("user", "username avatar");
    // Verificamos si el post fue realmente eliminado
    if (!coffeDeleted) {
      return res.status(404).send({
        status: "error",
        message: `No se pudo eliminar el post con ID ${idCoffee}`,
      });
    }
    // Respuesta exitosa
    return res.status(200).send({
      status: "success",
      message: "Publicación y sus imágenes han sido eliminadas con éxito",
      coffeDeleted,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No se ha podido eliminar el registro ",
      error: e.message,
    });
  }
};

//Accion para agregar mas media al registro
const addMediaRegister = async (req, res) => {
  try {
    //Recogemos el id del registro que vamos a editar
    const idCoffee = req.params.id;
    //Recogemos el token de autorización
    const idUser = req.user.id;
    //Comprobamos que nos llega una imagen
    if (!req.file) {
      console.log(req.file);
      return res.status(401).send({
        status: "error",
        message: "No se ha recibido imagen para agregar",
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
    // Obtener la URL segura de la imagen en Cloudinary
    const mediaUrl = req.file.path;

    // Buscar y actualizar el registro de café, agregando la nueva imagen al array `media`
    const updatedCoffee = await Coffeelog.findOneAndUpdate(
      { _id: idCoffee, user: idUser },
      { $push: { media: mediaUrl } }, // Agrega la URL al array
      { new: true } // Devuelve el documento actualizado
    );

    // Si no se encuentra el registro, enviar un mensaje de error
    if (!updatedCoffee) {
      return res.status(404).send({
        status: "error",
        message: "No se encontró el registro de café",
      });
    }

    // Devolver la respuesta con el registro actualizado
    return res.status(200).send({
      status: "success",
      message: "Imagen añadida correctamente",
      updatedCoffee,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No se ha podido agregar la imagen",
    });
  }
};

//Accion para eliminar media del registro
const deleteMediaRegister = async (req, res) => {
  try {
    //Obtenemos el id del registro que queremos modificar
    const idCoffee = req.params.id;
    //url de la imagen que queremos eliminar
    const urlImage = req.body.urlImage;
    //Id del usuario logueado
    const idUser = req.user.id;
    //Comprobamos que nos llega una imagen
    if (!urlImage) {
      return res.status(401).send({
        status: "error",
        message: "No se ha recibido url de imagen",
      });
    }

    //Buscamos el registro que queremos editar en la bd
    let coffeToDeleteMedia = await Coffeelog.findOne({ _id: idCoffee });
    if (!coffeToDeleteMedia) {
      return res.status(404).send({
        status: "error",
        message: "Café no encontrado",
      });
    }
    //Eliminamos la imagen de cloudinary
    const urlParts = urlImage.split("/");
    // Con pop() extraemos "imagen.jpg" y eliminamos la extensión para obtener el public_id
    const publicId = `coffeLog/${idUser}/${urlParts.pop().split(".")[0]}`;
    // Eliminamos la imagen de Cloudinary usando el public_id
    await cloudinary.uploader.destroy(publicId);

    //Actualizamos el registro eliminando la imagen del array media
    // Usamos `findByIdAndUpdate` con `$pull` para eliminar del array `media`
    const result = await Coffeelog.findByIdAndUpdate(
      idCoffee,
      { $pull: { media: urlImage } },
      { new: true }
    );
    if (!result) {
      return res.status(404).send({
        status: "error",
        message: "No se ha actualizado el registro",
      });
    }
    return res.status(200).send({
      status: "success",
      message: "Imagen eliminada correctamente",
      coffe: result,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      status: "error",
      message: "No se ha podido eliminar la imagen",
    });
  }
};

//Accion para agregar filtros (hacer busquedas en el coffelog)
const searchCoffee = async (req, res) => {
  try {
    //Usuario autenticado
    const idUserLogued = req.user.id;
    //Id del usuario que estamos viendo el coffeLog
    const idOwnerCoffeeLog = req.params.id;

    const {
      coffeeName,
      origin,
      varietal,
      process,
      score,
      page = 1,
      limit = 10,
    } = req.query; //Obtenemos la busqueda

    //Construimos el objeto de filtro de forma dinamica
    let filter = {user: idOwnerCoffeeLog}; //Agregamos al filtro el usuario

    if (coffeeName) filter.coffeeName = { $regex: coffeeName, $options: "i" }; //Filtro por nombre, sin tener en cuenta mayus y minus
    if (origin) filter.origin = { $regex: origin, $options: "i" };
    if (varietal) filter.varietal = { $regex: varietal, $options: "i" };
    if (process) filter.process = { $regex: process, $options: "i" };
    //Comprobamos que score es un numero y sino lo convertimos
    if (score) {
      const scoreNumber = parseInt(score);
      if(!isNaN(scoreNumber)){
        filter.score = scoreNumber;
      } else {
        return res.status(400).send({
          status: "error",
          message: "El valor de score debe ser un numero valido"
        })
      }
    };

    //Configuramos las opciones de paginación
    const options = {
      page,
      limit,
      sort: { created_at: -1 }, //Ordena por fecha de creacion (mas recientes primero)
      select: "-__v",
      populate: [{ path: "user", select: "username avatar" }],
    };

    //Realizamos la busqueda con la paginacion y los filtros
    const coffeeLog = await Coffeelog.paginate(filter, options);
    if (!coffeeLog) {
      return res.status(404).send({
        status: "error",
        message: "No se ha encontrado el café con esos filtros",
      });
    }
    //Devolvemos resultado
    return res.status(200).send({
      status: "success",
      total: coffeeLog.total,
      pages: coffeeLog.pages,
      coffeeLog: coffeeLog,
    });
  } catch (e) {
    return res.status(500).send({
      status: "Error",
      message: "Error al buscar café",
      error: e.message,
    });
  }
};

module.exports = {
  createRegister,
  viewRegister,
  viewCoffe,
  deleteRegister,
  updateRegister,
  addMediaRegister,
  deleteMediaRegister,
  searchCoffee,
};
