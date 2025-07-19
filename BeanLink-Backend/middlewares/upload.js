//Importamos multer para la subida de archivos
const multer = require("multer");
//Importamos el almacenamiento de cloundinary
const { storage, storagePublication, storagePosts } = require("../services/cloudinary");
//Configuramos el multer para usar cloudinary
const uploads = multer({storage}); //Es igual que multer({storage:storage}) (AVATARS)
const uploadsPublication = multer({storage : storagePublication}) //Multer para subida de archivos en coffelog
const uploadsPosts = multer({storage : storagePosts}) //Multer para subida de archivos en POSTS
//Expostamos
module.exports = {
    uploads,
    uploadsPublication,
    uploadsPosts,
}