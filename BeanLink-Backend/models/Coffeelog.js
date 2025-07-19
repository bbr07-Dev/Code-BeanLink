const { Schema, model } = require("mongoose");
//Agregamos mongoose paginate
const mongoosePagination = require("mongoose-paginate-v2");

const CoffeelogSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  coffeeName: { type: String, required: true },
  origin: String,
  varietal: String,
  process: String,
  high: String,
  roaster: { type: Schema.Types.Mixed, ref: "User" }, //Permitimos que sea ref de usuario o un string (Mixed)
  tastingNotes: [String],
  score: { type: Number, min: 80, max: 100},
  media: [String],
  brewMethod: String, //Método de preparación recomendado
  notes: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});
//Aplicamos el plugin para la paginacion
CoffeelogSchema.plugin(mongoosePagination);

module.exports = model("Coffelog", CoffeelogSchema, "coffeeslog");
