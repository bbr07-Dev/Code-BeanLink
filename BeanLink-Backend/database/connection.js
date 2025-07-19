require('dotenv').config();  // cargar las variables de entorno

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Importante que hagamos el await para que si tarda un poco espere
    const dbURI = process.env.MONGODB_URI;

    await mongoose.connect(dbURI);

    console.log("La conexion con la base de datos es correcta");
    
  } catch (e) {
    console.log(e);
    throw new Error("No se ha podido conectar a la base de datos");
  }
};

module.exports = { connectDB };
