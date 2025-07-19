const mongoose = require("mongoose");
//Importamos mongoose paginate
const mongoosePagination = require("mongoose-paginate-v2");

const PublicationSchema = new mongoose.Schema({
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  media: [{ type: String, required: true }],
  text: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Usuarios que dieron like
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    created_at: { type: Date, default: Date.now },
  }], // Comentarios dentro de la publicación
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Aplicamos el plugin de paginación al esquema
PublicationSchema.plugin(mongoosePagination);

// Creamos el modelo y lo exportamos
const Publication = mongoose.model("Publication", PublicationSchema);

module.exports = Publication;