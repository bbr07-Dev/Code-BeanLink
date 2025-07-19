//Importamos dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

//Clave secreta para generar el Token
const secretKey = "Secret_Key_For_Login_Users_1995*";

//Creamos función para generar el token
exports.createToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    iat: moment().unix(), //Momento en el que generamos el payload
    exp: moment().add(30, "days").unix(), //Fecha de expiración del token
  };
  //Devolvemos un JWT Token codificado
  return jwt.encode(payload, secretKey);
};

exports.secretKey = secretKey;

//Token temporal para la recuperacioon de contraseña
exports.createResetToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    type: "password-reset", // Lo usamos para distinguir este token del anterior
    iat: moment().unix(),
    exp: moment().add(15, "minutes").unix(), // válido por 15 min
  };
  return jwt.encode(payload, secretKey)
};
