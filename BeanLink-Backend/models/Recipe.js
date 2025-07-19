const { Schema, model } = require("mongoose");
//importamos mongoose paginate
const mongoosePagination = require("mongoose-paginate-v2");

const RecipeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  method: { type: String, required: true },
  coffee_weight: { type: Number, required: true },
  grind_size: { type: String },
  brew_time: { type: String, required: true },
  notes: { type: String },
  temperature: { type: Number, required: true },
  preinfusion_time: { type: Number },
  ratio: { type: String, required: true },
  // Relaciones
  user: { type: Schema.Types.ObjectId, ref: "User"},
  coffee: { type: Schema.Types.ObjectId, ref: "Coffelog", required:true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // Usuarios que dieron like
  comments: [{ 
    user: { type: Schema.Types.ObjectId, ref: "User" },
    text: String,
    created_at: { type: Date, default: Date.now },
  }], // Comentarios dentro de la publicación
  // 🔥 Relación opcional con una publicación
  // post: { type: Schema.Types.ObjectId, ref: "Publication", required: false },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
//Aplicamos el plugin para la paginacion
RecipeSchema.plugin(mongoosePagination);
//Creamos el modelo y lo exportamos
module.exports = model("Recipe", RecipeSchema, "recipes");