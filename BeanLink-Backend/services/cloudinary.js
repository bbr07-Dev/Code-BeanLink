//Importamos cloudinary
const cloudinary = require("cloudinary").v2;
//Importamos el multer que trabaja con cloudinary
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require('dotenv').config();  // cargar las variables de entorno

//Configuración de Couldinary con las credenciales necesarias para el funcionamiento de la API
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Configuración del multer para usar cloudinary (AVATARS)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatars", //Carpeta en Cloudinary
    allowedFormats: ["image/jpeg", "image/png", "image/webp", "image/gif"], //Formatos permitidos
    transformation: [
      { width: 150, height: 150, crop: "fill", gravity: "auto" }, // Reduce a 150x150 px y se ajusta la imagen y se centra en la parte mas importante
      // { radius: "max" }, // Hacer la imagen completamente redonda
      { quality: "auto:eco" }, //Calidad mas optimizada para la web
      { drp: "auto" }, //Ajusta la resolución segun el dispositivo (bueno para pantallas de retina)
    ],
  },
});
//Configuración del multer para usar cloudinary (CoffeLog)
const storagePublication = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {

    const userId = req.user.id; // Obtener el ID del usuario autenticado
    return {
      folder: `coffelog/${userId}`, // 📂 Carpeta dinámica
      allowedFormats: ["image/jpeg", "image/png", "image/webp", "image/gif"], //Formatos permitidos
      transformation: [
        { width: 1000, height: 1000, crop: "fill", gravity: "auto" },
        { quality: "auto:eco" },
        { dpr: "auto" },
      ],
    };
  },
});
//Configuración del multer para usar cloudinary (POSTS)
const storagePosts = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {

    const userId = req.user.id; // Obtener el ID del usuario autenticado
    return {
      folder: `posts/${userId}`, // 📂 Carpeta dinámica
      allowedFormats: ["image/jpeg", "image/png", "image/webp", "image/gif"], //Formatos permitidos
      transformation: [
        { width: 1000, height: 1000, crop: "fill", gravity: "auto" },
        { quality: "auto:eco" },
        { dpr: "auto" },
      ],
    };
  },
});
//Exportamos
module.exports = {
  cloudinary,
  storage,
  storagePublication,
  storagePosts,
};
