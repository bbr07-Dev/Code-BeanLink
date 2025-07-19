//Importamos el validator
const validator = require("validator");

// Valida los datos de un usuario antes de registrarlo
const validateUser = (user) => {
  let errors = {};

  // Validar username (requerido, longitud máxima)
  if (!user.username || user.username.length > 30) {
    errors.username =
      "El nombre de usuario es obligatorio y no debe superar los 30 caracteres.";
  }

  // Validar email con formato correcto
  if (!user.email || !validator.isEmail(user.email)) {
    errors.email = "El email no es válido.";
  }

  // Validar password (mínimo 8 caracteres, al menos una mayúscula, un número y un símbolo)
  if (
    !user.password ||
    !validator.isStrongPassword(user.password, {
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    errors.password =
      "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.";
  }

  // Validar role (debe ser uno de los valores permitidos)
  const validRoles = ["user", "barista", "roaster", "cafe", "producer", "admin"];
  if (!user.role || !validRoles.includes(user.role)) {
    errors.role = "El rol proporcionado no es válido.";
  }

  return {
    valid: Object.keys(errors).length === 0, // Si no hay errores, es válido
    errors,
  };
};

// Valida los datos de un usuario antes de actualizarlo
const validateUserUpdate = (user) => {
  let errors = {};

  // Validar username (solo si se envía, longitud máxima)
  if (user.username && user.username.length > 30) {
    errors.username = "El nombre de usuario no debe superar los 30 caracteres.";
  }

  // Validar email (solo si se envía, con formato correcto)
  if (user.email && !validator.isEmail(user.email)) {
    errors.email = "El email no es válido.";
  }

  // Validar password solo si se envía (mínimo 8 caracteres, una mayúscula, un número y un símbolo)
  if (
    user.password &&
    !validator.isStrongPassword(user.password, {
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    errors.password =
      "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.";
  }

  // Validar role solo si se envía
  const validRoles = ["user", "barista", "roaster", "cafe", "producer"];
  if (user.role && !validRoles.includes(user.role)) {
    errors.role = "El rol proporcionado no es válido.";
  }

  // Validar location solo si el rol es cafe, roaster o producer
  if (user.location) {
    if (!user.location.coordinates || user.location.coordinates.length !== 2) {
      errors.location =
        "La ubicación debe contener coordenadas válidas [longitude, latitude].";
    }
  }

  return {
    valid: Object.keys(errors).length === 0, // Si no hay errores, es válido
    errors,
  };
};

//Valida que el avatar que intentamos subit tiene formato de imagen
const validateAvatarUserUpload = (file) => {
  let errors = {};

  //Verificamos que hemos proporcionado un archivo
  if(!file) {
    errors.avatar = "No se ha proporcionado ninguna imagen";
    return {valid: false, errors}
  }
  //Lista de formatos de imagen permitidos
  const allowedFormats = [ "image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];

  //Validamos que el formato que se envia sea correspondiente a alguno de la lista
  if (!allowedFormats.includes(file.mimetype)) {
    errors.avatar = "Formato de imagen no valido (jpeg, jpg, png, webp, gif";
  }

  return {
    valid: Object.keys(errors).length === 0, //Si no hay errores es valido
    errors,
  };

};

//Validar las imagenes de publicaciones (mas de una)
const validatePostMedia = (files) => {
  let errors = {};

  // Verificamos que se hayan proporcionado archivos
  if (!files || files.length <= 0) {
    errors.avatar = "No se han proporcionado imágenes";
    return { valid: false, errors };
  }

  // Lista de formatos de imagen permitidos
  const allowedFormats = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];

  // Iteramos sobre cada archivo y validamos
  files.forEach((file, index) => {
    // Validamos que el formato sea uno de los permitidos
    if (!allowedFormats.includes(file.mimetype)) {
      errors[`avatar_${index}`] = `El archivo ${index + 1} tiene un formato no válido. Se permiten los formatos: jpeg, jpg, png, webp, gif.`;
    }
  });

  // Si hay errores, devolvemos la validación como falsa
  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  // Si todo es correcto, devolvemos la validación como válida
  return { valid: true, errors };
};

module.exports = {
  validateUser,
  validateUserUpdate,
  validateAvatarUserUpload,
  validatePostMedia
};
