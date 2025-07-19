//Importamos el modelo User y los submodelos creados
const { User, Cafe, Roaster, Producer } = require("../models/Users");

//Función a la que vamos a llamar desde el controlador
const registeUser = async (userData) => {
  //Usuario que vamos a insertar en la BD
  let newUser = {};
  
  //Seleccionamos el modelo segun el role
  switch (userData.role) {
    case "cafe":
      newUser = new Cafe(userData);
      break;
    case "roaster":
      newUser = new Roaster(userData);
      break;
    case "producer":
      newUser = new Producer(userData);
      break;
    default:
      newUser = new User(userData);
  }

  //Guardamos el usuario en la bd
  const userStored = await newUser.save();
  return userStored;
};

module.exports = {
  registeUser,
};
