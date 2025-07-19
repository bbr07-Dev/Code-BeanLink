//Importamos el modelo user
const { User } = require("../models/Users");
//Importamos bcrypt para encriptar las passwords
const bcrypt = require("bcrypt");
//IMportar el servicio para valodar los datos
const {
  validateUser,
  validateUserUpdate,
  validateAvatarUserUpload,
} = require("../services/validatorService");
//Validador para validar la contraseña cuando reseteamos
const validator = require("validator");
//Importamos el servcio del token
const jwt = require("../services/jwt");
//Importamos servicio para subida de imagenes a cloudinary
const { cloudinary } = require("../services/cloudinary");
//Importamos servicio para generar modelo segun el role
const { registeUser } = require("../services/userRoleRegister");
//Importamos el servicio de envio de email
const { sendMail } = require("../services/nodemailer");

//Accion para registrar un nuevo usuario en la base de datos
const register = async (req, res) => {
  try {
    //Recogemos los datos de la peticion
    let params = req.body;

    //Validamos que nos llegan los campos obligatorios
    if (!params.username || !params.email || !params.password) {
      return res.status(400).send({
        status: "error",
        message: "Faltan datos obligatorios por enviar",
      });
    }

    //Validar el formato de los datos que nos llegan antes de continuar (llamamos al servicio)
    const { valid, errors } = validateUser(params);
    if (!valid) {
      return res.status(400).send({
        status: "error",
        message: "Error en la validación de los datos",
        errors,
      });
    }

    //Comprobamos que no tenemos un username ni un email duplicados
    const users = await User.find({
      $or: [
        { username: params.username },
        { email: params.email.toLowerCase() },
      ],
    });

    //Si users devuelve longitud, es que el usuario existe y no podemos guardar
    if (users && users.length >= 1) {
      return res.status(401).send({
        status: "error",
        message: "El usuario ya existe",
      });
    }

    //Ciframos la password
    const hash = await bcrypt.hash(params.password, 10); //El 10 indica el numero de veces que se encripta
    params.password = hash;

    //Llamamos al servicio para que cree un modelo (user/barista, roaster, cafe, producer) segun el role
    let userToSave = params;
    const userStored = await registeUser(userToSave);

    //Comprobamos que nos devuelve el usuario creado
    if (userStored) {
      //Devolvemos el resultado success (201 = created)
      return res.status(201).send({
        status: "success",
        message: "Usuario registrado correctamente",
        user: userStored,
      });
    }
  } catch (e) {
    return res.status(500).send({
      status: "error",
      message: "Accion de registro de usuarios FALLIDA",
      error: e.message, //mas detalles del error
    });
  }
};

//Accion para iniciar sesión con un usuario y un Token
const login = async (req, res) => {
  try {
    //Recogemos los parametros del body
    const params = req.body;

    //Comprobamos que nos ha llegado el user y la pass
    if (!params.username || !params.password) {
      return res.status(400).send({
        status: "error",
        message: "Falan datos por enviar",
      });
    }

    //Buscamos en la base de datos si tenemos ese username
    let userSaved = await User.findOne({ username: params.username });

    if (!userSaved) {
      return res.status(404).send({
        status: "error",
        message: "El usuario no existe con ese username",
      });
    }

    //Comprobamos la password
    const pwd = bcrypt.compareSync(params.password, userSaved.password);
    if (!pwd) {
      return res.status(400).send({
        status: "error",
        message: "Esa contraseña no es valida",
      });
    }

    //Devolvemos el token
    const token = jwt.createToken(userSaved);
    //Eliminamos la password para devolver el user
    let userWithoutPassword = userSaved.toObject();

    //Eliminamos parametros que no queremos enviar
    delete userWithoutPassword.password;
    delete userWithoutPassword.__v;

    //Podemos imprimir el token al devolver el usuario
    return res.status(200).send({
      status: "success",
      message: "Te has identificado correctamente",
      user: {
        ...userWithoutPassword,
        id: userWithoutPassword._id,
      },
      token,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      status: "error",
      message: "No se ha podido iniciar sesión",
    });
  }
};

//Accion para actualizar los datos del usuario
const update = async (req, res) => {
  try {
    //Recogemos el ID que enviamos por url (el que queremos actualizar)
    let id = req.params.id;
    //Recogemos los parametros del body
    const params = req.body;
    //Recogemos el ID del usuario que se esta autenticando con el token
    const userIdFromToken = req.user.id;
    const userRole = req.user.role;
    //Usamos el modelo adecuado user/barist, cafe, roaster, producer
    let UserModel;
    if (userRole === "user" || userRole === "barista" || userRole === "admin") {
      UserModel = require("../models/Users").User;
    } else if (userRole === "roaster") {
      UserModel = require("../models/Users").Roaster;
    } else if (userRole === "cafe") {
      UserModel = require("../models/Users").Cafe;
    } else if (userRole === "producer") {
      UserModel = require("../models/Users").Producer;
    }
    //Si el ID que enviamos por parametro y el que ponemos en el token no es el mismo
    if (userIdFromToken !== id && userRole !== "admin") {
      return res.status(403).send({
        status: "error",
        message:
          "No tienes permisos para actualizar a este usuario (Token erroneo)",
      });
    }

    //Validamos los datos
    const { valid, errors } = validateUserUpdate(params);
    if (!valid) {
      return res.status(400).send({
        status: "error",
        message: "Error en la validación de los datos",
        errors,
      });
    }

    //Localizamos el usuario y lo actualizamos
    let userEdited = await UserModel.findOneAndUpdate({ _id: id }, params, {
      new: true,
    }).select({ password: 0, __v: 0 }); //New a true nos devuelve el registro ya actualizado
    //Si no se devuelve un usuario es que no se ha actualizado
    if (!userEdited) {
      return res.status(404).send({
        status: "error",
        message: "Usuario para actualizar no encontrado",
      });
    }
    //Pasamos a JSON plano
    const userPlain = userEdited.toObject();

    //Si opening Hours es un map, lo convertimos para que el frontend lo pueda leer
    if (userPlain.openingHours instanceof Map) {
      //Convertimos el map a un json
      userPlain.openingHours = Object.fromEntries(userPlain.openingHours);
    }

    return res.status(200).send({
      status: "success",
      message: "Usuario actualizado correctamente",
      user: {
        ...userPlain,
        id: userPlain._id,
      },
    });
  } catch (e) {
    return res.status(401).send({
      status: "error",
      message: "No se ha podido actualizar el usuario",
      error: e.message,
    });
  }
};

//Accion para actualizar el avatar del perfil del usuario loggeado
const uploadAvatar = async (req, res) => {
  try {
    //Obtenemos el id del usuario que enviamos por petición
    const userIdUrl = req.params.id;
    //Obtenemos el id del token que recibimos por el header
    const userIdToken = req.user.id;
    const userRole = req.user.role;
    //Obtenemos la imagen que se ha cargado en el body
    const avatar = req.file;
    //Comprobamos que es el mismo usuario el que se identifica por url que el del token
    if (userIdUrl !== userIdToken && userRole !== "admin") {
      return res.status(403).send({
        status: "error",
        message: "No tienes permisos para actualizar el avatar de este usuario",
      });
    }
    //Comprobamos que llega un avatar y con el formato correcto
    const { valid, errors } = validateAvatarUserUpload(avatar);
    if (!valid) {
      return res.status(400).send({
        status: "error",
        message: "Error en la validación de la imagen",
        errors,
      });
    }

    //Comprobamos si ese usuario de la bd ya tiene un avatar para eliminarlo antes de cloudinary
    let userToDeleteAvatar = await User.findOne({ _id: userIdUrl });
    if (userToDeleteAvatar.avatar) {
      const avatarUrlParts = userToDeleteAvatar.avatar.split("/");
      const publicId = `avatars/${avatarUrlParts.pop().split(".")[0]}`; // Extraemos el public_id correcto
      await cloudinary.uploader.destroy(publicId);
    }

    //Obtenemos la URL segura de Cloudinary
    const avatarUrl = req.file.path;

    //Actualizamos el usuario de la base de dats con la url de la iamgen
    let userToUpdateAvatar = await User.findOneAndUpdate(
      { _id: userIdUrl },
      { avatar: avatarUrl },
      { new: true } //Devuelve el ya actualizado
    ).select({ password: 0 });

    //Comprobamos que se ha actualizado algun usuario
    if (!userToUpdateAvatar) {
      return res.status(404).send({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    //Devolvemos el success y el usuario actualizado
    return res.status(200).send({
      status: "success",
      user: userToUpdateAvatar,
      avatar: avatarUrl,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      status: "error",
      message: "No se ha podido actualizar el avatar del usuario",
    });
  }
};

//Accion para obtener el perfil de usuario loggeado
const showMe = async (req, res) => {
  try {
    //Recoger el token del usuario que esta loggeado
    const userIdFromToken = req.user.id;
    //Recogemos el id del usuario que pasamos por parametro (del que queremos ver el perfil)
    const userIdToShow = req.params.id;
    //Obtenemos el role
    const userRole = req.user.role;
    //Variable para indicar si tenemos permisos de edicion o no (por defecto false);
    let editionPermited = false;
    //Comprobamos si el usuario tiene permisos de edicion (si es propietario del perfil o usuario admin)
    if (userIdFromToken === userIdToShow && userRole !== "admin") {
      editionPermited = true;
    }
    //Saber a que usuario corresponde ese token
    const userToShow = await User.findOne({ _id: userIdToShow })
      .select({
        password: 0,
        email: 0,
      })
      .lean(); //Eliminamos la password para que no la muestre
    //Comprobar que existe el usuario correspondiente a ese token
    if (!userToShow) {
      return res.status(404).send({
        status: "error",
        message: "Usuario no encontrado",
      });
    }
    //Convertimos el horario de map a objeto para que el front lo lea bien
    if (userToShow.openingHours instanceof Map) {
      userToShow.openingHours = Object.fromEntries(userToShow.openingHours);
    }

    //Devolver respuesta con información de perfil
    return res.status(200).send({
      status: "success",
      user: {
        ...userToShow,
        id: userToShow._id,
      },
      editionPermited,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      status: "error",
      message: "No se ha podido mostrar el usuario",
    });
  }
};

//Accion para eliminar el perfil de usuario loggeado de la base de datos
const deleteUser = async (req, res) => {
  try {
    //Obtenemos el id del usuario que enviamos por url
    const userIdUrl = req.params.id;
    //Obtenemos el id del usuario con el que nos autenticamos con token
    const userIdToken = req.user.id;
    //Obtenemos el roll
    const userRole = req.user.role;
    //Comprobamos que es el mismo o que tiene permisos de administrador
    if (userIdUrl !== userIdToken && userRole !== "admin") {
      return res.status(403).send({
        status: "error",
        message: "No tienes permisos para eliminar el usuario",
      });
    }

    //Encontramos el usuario antes de borrarlo para ver si tiene avatar
    const userToDeleted = await User.findOne({ _id: userIdUrl });
    //Comprobamos si tiene el avatar
    if (userToDeleted.avatar) {
      //Eliminamos de cloudinary
      const avatarUrlParts = userToDeleted.avatar.split("/");
      const publicId = `avatars/${avatarUrlParts.pop().split(".")[0]}`; // Extraemos el public_id correcto
      await cloudinary.uploader.destroy(publicId);
    }

    //Eliminamos el usuario de la bd
    const userDeleted = await User.findOneAndDelete({ _id: userIdUrl });
    //Comprobamos que nos devuelve un usuario eliminado
    if (!userDeleted) {
      return res.status(404).send({
        status: "error",
        messagge: "No se ha encontrado el usuario a eliminar",
      });
    }
    //Devolvemos el usuario eliminado
    return res.status(200).send({
      status: "sucess",
      message: "Usuario borrado correctamente",
      user: userDeleted,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      status: "error",
      message: "Error al eliminar el usuario de la base de datos",
    });
  }
};

//Accion para buscar usuarios de la bd
const searchUser = async (req, res) => {
  try {
    const searchQuery = req.query.q; // Obtener el término de búsqueda desde el query params
    const users = await User.find({
      username: { $regex: searchQuery, $options: "i" }, // Buscar por nombre de usuario, ignorando mayúsculas/minúsculas
    })
      .limit(10)
      .select({ password: 0, email: 0, role: 0 }); // Limitar la cantidad de resultados a 10
    //Comprobams que se haya comprobado alguno
    if (!users || users.length < 0) {
      return res.status(404).send({
        status: "error",
        message: "No hemos encontrado usuarios con ese nombre",
      });
    }
    //Devolvemos respuesta
    return res.status(200).send({
      status: "success",
      message: "Usuarios encontrados",
      users,
    });
  } catch (e) {
    return res.status(500).send({
      status: "Error",
      message: "Error al buscar usuario",
      error: e.message,
    });
  }
};

//Accion para buscar a usuarios cercanos a una localización
const searchUsersMap = async (req, res) => {
  try {
    //Obtenemos el usuario que esta abriendo el mapa
    const user = req.user.id;
    //Obtenemos la longitud y la latitud
    const { lat, lng } = req.query;
    //Definimos la distancia maxima
    const maxDistance = 50000;
    //Comprobamos que tenemos todos los datos que necsitamos para hacer la consulta
    if (!lat || !lng || !maxDistance) {
      return res.status(400).send({
        status: "error",
        message: "No se han recibido todos los parametros",
      });
    }
    //Realizamos la consulta
    const users = await User.find({
      _id: { $ne: user }, //Excluimos al usuario que abre el mapa (no se muestra a si mismo)
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lat), parseFloat(lng)],
          },
          $maxDistance: parseInt(maxDistance), //Distancia en metros
        },
      },
    });
    if (!users) {
      return res.status(404).send({
        status: "error",
        message: "No se han encontrado usuarios a esa distancia",
      });
    }
    //Devolvemos resultado satisfactorio
    return res.status(200).send({
      status: "success",
      message: "Obteniendo lista de usuarios en el mapa",
      users,
    });
  } catch (e) {
    return res.status(500).send({
      status: "error",
      message: "No se han podido obtener resultados",
      error: e.message,
    });
  }
};

//Accion para enviar token temporal cuando el usuario solicita cambio de password
const forgotPassword = async (req, res) => {
  //Obtenemos el email donde tenemos que enviar el token de recuperacion
  const { email } = req.body;
  try {
    // Buscar usuario por correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "No se ha encontrado ningún usuario con ese correo",
      });
    }

    // Crear un token de recuperación de contraseña
    const resetToken = jwt.createResetToken(user);

    // Crear la URL para la recuperación de la contraseña
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Crear el contenido del correo
    const mailContent = `
      <h3>Recuperación de Contraseña</h3>
      <p>Hola,</p>
      <p>Has solicitado recuperar tu contraseña. Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p>Este enlace expirará en 15 minutos.</p>
    `;

    // Enviar el correo con el token
    await sendMail(email, "Recuperación de Contraseña", mailContent);

    return res.status(200).send({
      status: "success",
      message: "Correo de recuperación enviado con éxito",
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Hubo un error al enviar el correo de recuperación",
      error: error.message,
    });
  }
};

//Accion para resetear la contraseña de un usuario
const resetPassword = async (req, res) => {
  try {
    //Obtenemos y verificamos el token temporal que nos llega
    const userId = req.user.id;
    //Obtenemos la nueva contraseña que nos llega por parametros
    let password = req.body.password;
    //Validamos el formato de la password y si no lo cumple devolvemos error
    if (
      !password ||
      !validator.isStrongPassword(password, {
        minLength: 8,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      return res.status(400).send({
        status: "error",
        message:
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.",
      });
    }
    //Encriptamos la password con bcrypt
    const hash = await bcrypt.hash(password, 10); //El 10 indica el numero de veces que se encripta
    password = hash;
    //Modificamos la contraseña para ese usuario en la BD
    const user = await User.findByIdAndUpdate({_id: userId}, {password: password}, {new: true}).select('-password');
    if(!user){
      return res.status(404).send({
        status: "error",
        message: `Usuario con ID ${userId} no localizado`
      })
    }
    //Devolvemos resultado
    return res.status(200).send({
      status: "success",
      message: `Contraseña cambiada correctamente`,
      user
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No se ha podido modificar la contraseña",
      error: e.message,
    });
  }
};

module.exports = {
  register,
  login,
  update,
  showMe,
  uploadAvatar,
  deleteUser,
  searchUser,
  searchUsersMap,
  forgotPassword,
  resetPassword,
};
