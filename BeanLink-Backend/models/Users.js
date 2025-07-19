const { Schema, model } = require("mongoose");

// Opciones para el esquema base, definiendo el discriminatorKey
const options = { discriminatorKey: 'role', collection: 'users' };

// Esquema base: campos comunes a todos los usuarios
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, maxlength: 30 },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  password: { type: String, required: true, minlength: 8 },
  // Puedes definir el rol aquí o dejar que lo asignen los discriminadores
  // Si lo defines aquí, recuerda que al crear un documento mediante un discriminator,
  // Mongoose lo seteará automáticamente con el valor del discriminator.
  role: { 
    type: String, 
    enum: ["user", "barista", "roaster", "cafe", "producer", "admin"],
    default: "user",
  },
  avatar: { type: String },
  bio: { type: String, maxlength: 200 },
  created_at: { type: Date, default: Date.now },
}, options);

// Creamos el modelo base
const User = model("User", UserSchema, "users");

// Definimos el esquema extra para roles que requieren campos adicionales
const ExtendedSchema = new Schema({
  location: {
    type: { type: String, enum: ["Point"] },
    coordinates: { type: [Number] },
  },
  openingHours: { type: Map, of: String },
  menu: { type: [String] },
  certifications: { type: [String] },
  coffeeVarieties: { type: [String] },
  origin: { type: [String] },
});

// Creamos un índice geoespacial para `location` en el esquema extendido
ExtendedSchema.index({ location: "2dsphere" });


// Creamos discriminadores para cada rol que necesite los campos adicionales
const Cafe = User.discriminator("cafe", ExtendedSchema);
const Roaster = User.discriminator("roaster", ExtendedSchema);
const Producer = User.discriminator("producer", ExtendedSchema);

// Ahora, para un usuario con rol "user", se usará el modelo `User` base,
// mientras que para un usuario con rol "cafe", "roaster" o "producer" se usará el
// modelo discriminado correspondiente.
module.exports = {
  User,
  Cafe,
  Roaster,
  Producer
}
