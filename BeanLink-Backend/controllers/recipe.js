//Importamos modelo de recetas
const Recipe = require("../models/Recipe");

//Función para crear una receta
const createRecipe = async (req, res) => {
  //Recogemos los parametros que nos envian por el body (datos receta)
  const params = req.body;
  //Recogemos el id del usuario autenticado
  const idUser = req.user.id;
  try {
    //Validamos que nos llegan los campos obligtorios
    if (
      !params.title ||
      !params.method ||
      !params.coffee_weight ||
      !params.brew_time ||
      !params.temperature ||
      !params.ratio ||
      !idUser
    ) {
      return res.status(400).send({
        status: "error",
        message: "No se han enviado todos los parámetros obligatorios",
      });
    }
    //Buscamos en la bd no tener ninguna receta con ese titulo
    let recipeSaved = await Recipe.find({ title: params.title, user: idUser });
    if (recipeSaved && recipeSaved.length >= 1) {
      return res.status(401).send({
        status: "error",
        message: "Ya tenemos una receta con ese titulo para ese usuario",
        recipeSaved,
      });
    }
    //Creamos la receta agregando el usuario logueado
    const recipe = { ...params, user: idUser };
    //Creamos el registro en la bd
    const newRecipe = new Recipe(recipe);
    //Guardamos la nueva receta
    const request = await newRecipe.save();
    //Devolvemos resultado
    if (request) {
      return res.status(200).send({
        status: "success",
        message: "Receta registrada correctamente",
        recipe,
      });
    }
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No hemos podido crear el registro",
      error: e.message,
    });
  }
};

//Función para eliminar una receta
const deleteRecipe = async (req, res) => {
  //Recogemos id de la receta que queremos eliminar
  const idRecipe = req.params.id;
  //Recogemos id del usuario que esta logueado
  const idUser = req.user.id;
  try {
    //Comprobamos que el usuario logueado y el propietario de la receta es el mismo (o es admin)
    const recipeToDelete = await Recipe.findById({ _id: idRecipe });
    if (!recipeToDelete) {
      return res.status(404).send({
        status: "error",
        message: `No hemos encontrado la receta con ID ${idRecipe}`,
      });
    }
    if (
      recipeToDelete.user.toString() !== idUser &&
      req.user.role !== "admin"
    ) {
      return res.status(403).send({
        status: "error",
        message: "No tienes permisos para eliminar la receta",
        userOwner: recipeToDelete.user,
        userLogued: idUser,
      });
    }
    //Si todo es correcto, intentamos eliminar de la bd
    const recipeDeleted = await Recipe.findByIdAndDelete({ _id: idRecipe });
    if (!recipeDeleted) {
      return res.status(404).send({
        status: "error",
        message: "No se ha eliminado ninguna receta",
      });
    }
    //Devolvemos resultado
    return res.status(200).send({
      status: "success",
      message: "Receta eliminada correctamente",
      recipe: recipeDeleted,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No hemos podido eliminar la receta",
      error: e.message,
    });
  }
};

//Función para editar una receta
const updateRecipe = async (req, res) => {
  //Recogemos los parametros enviados por el body (parametros a editar en la receta)
  const params = req.body;
  //Recogemos el id de la receta que vamos a editar
  const idRecipe = req.params.id;
  //Recogemos el id del usuario logueado (y en propietario de la receta)
  const idUser = req.user.id;
  try {
    //Buscamos la receta en la bd
    const recipeToUpdate = await Recipe.findById({ _id: idRecipe });
    if (!recipeToUpdate) {
      return res.status(404).send({
        status: "error",
        message: `No hemos podido localizar la receta con ID ${idRecipe}`,
      });
    }
    //Comprobamos que el usuario logueado es el propietario (o es admin)
    if (
      recipeToUpdate.user.toString() !== idUser &&
      req.user.role !== "admin"
    ) {
      return res.status(403).send({
        status: "error",
        message: "No tienes permisos para editar esta receta",
      });
    }
    //Actualizamos la receta en la bd con los nuevos parametros
    let recipeUpdated = await Recipe.findByIdAndUpdate(
      { _id: idRecipe, user: idUser },
      params,
      { new: true }
    );
    if (!recipeUpdated) {
      return res.status(404).send({
        status: "error",
        message: "No se ha encontrado el registro a actualizar",
      });
    }
    //Devolvemos resultado
    return res.status(200).send({
      status: "success",
      message: "Receta actualizada correctamente",
      recipe: recipeUpdated,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No hemos podido actualizar la publicación",
      error: e.message,
    });
  }
};

//Función para ver todas las recetas de un usuario
const showRecipes = async (req, res) => {
  //Recogemos el id del usuario del que queremos ver las recetas
  const idUserRecipes = req.params.id;
  //Comprobar si nos llega la page, por def = 1
  const page = req.params.page ? parseInt(req.params.page) : 1;
  //Cuantos usuarios por pagina mostramos
  const itemsPerPage = 8;
  //Configuramos las opciones de configuración de paginación
  //Configuramos las opciones de configuración de paginación
  const options = {
    page: page,
    limit: itemsPerPage,
    populate: [
      { path: "user", select: "username avatar" },
      {
        path: "coffee",
        select:
          "origin varietal coffeeName process high score tastingNotes brewMethod roaster notes media",
      },
    ],
    sort: { created_at: -1 }, //Opcional, ordenar por fecha descendente
  };
  try {
    //Buscamos todas las recetas que tienen como propietario el id de usuario pasado por parametros
    const recipes = await Recipe.paginate({ user: idUserRecipes }, options);
    if (!recipes.docs || recipes.docs.length === 0) {
      return res.status(404).send({
        status: "success",
        message: "No hay seguidores todavia",
        total: 0,
      });
    }
    //Devolvemos resultado
    return res.status(200).send({
      status: "success",
      message: "Recetas encontradas",
      recipes: recipes.docs,
      total: recipes.totalDocs,
      pages: recipes.totalPages,
      hasPrevPage: recipes.hasPrevPage,
      hasNextPage: recipes.hasNextPage,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No hemos podido acceder a las recetas",
      error: e.message,
    });
  }
};

//Función para ver una receta en concreto
const showRecipe = async (req, res) => {
  //Recogemos id de la receta que queremos ver
  const idRecipe = req.params.id;
  console.log(idRecipe);
  try {
    //Localizamos la receta que queremos ver en la bd
    const recipeToShow = await Recipe.findById({ _id: idRecipe }).populate([
      { path: "user", select: "username avatar" },
      { path: "coffee", select: "coffeeName" },
    ]);
    if (!recipeToShow) {
      return res.status(404).send({
        status: "error",
        message: `No hemos podido localizar la receta con ID ${idRecipe}`,
      });
    }
    //Devolvemos resupuesta
    return res.status(200).send({
      status: "success",
      message: "Receta encontrada",
      recipe: recipeToShow,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No hemos podido localizar la receta",
      error: e.message,
    });
  }
};

//Accion para agregar filtros (hacer busquedas dentro de todas las recetas)
const searchRecipe = async (req, res) => {
  try {
    //Usuario autenticado
    const idUserLogued = req.user.id;
    //Id del usuario que estamos viendo el recetario
    const idOwnerCoffeeLog = req.params.id;
    //Obtenemos los parametros de busqueda que nos solicitan
    const {
      coffeeName,
      origin,
      varietal,
      process,
      method,
      page = 1,
      limit = 10,
    } = req.query;
    //Construimos el objeto de filtro de forma dinamica
    let filter = { user: idOwnerCoffeeLog }; //Agregamos al filtro el usuario
    if (method) filter.method = { $regex: method, $options: "i" };
    //Configuramos las opciones de paginación
    const options = {
      page,
      limit,
      sort: { created_at: -1 }, //Ordena por fecha de creacion (mas recientes primero)
      select: "-__v",
      populate: [
        { path: "user", select: "username avatar" },
        {
          path: "coffee",
          //Aplicamos match dentro del populate, si no coinciden los datos no se trae el documento
          match: {
            ...(coffeeName && {
              coffeeName: { $regex: coffeeName, $options: "i" },
            }),
            ...(origin && { origin: { $regex: origin, $options: "i" } }),
            ...(varietal && { varietal: { $regex: varietal, $options: "i" } }),
            ...(process && { process: { $regex: process, $options: "i" } }),
          },
          select:
            "origin varietal coffeeName process high score tastingNotes brewMethod roaster notes media",
        },
      ],
    };
    //Realizamos la busqueda con la paginacion y los filtros
    const recipes = await Recipe.paginate(filter, options);
    // Filtramos las recetas que realmente tienen el "populate" encontrado
    recipes.docs = recipes.docs.filter((recipe) => recipe.coffee !== null);
    if (!recipes) {
      return res.status(404).send({
        status: "error",
        message: "No se ha encontrado ninguna receta con esos filtros",
      });
    }
    //Devolvemos resultado
    return res.status(200).send({
      status: "success",
      total: recipes.total,
      pages: recipes.pages,
      recipes: recipes,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No se ha podido localizar la receta",
      error: e.message,
    });
  }
};

module.exports = {
  createRecipe,
  deleteRecipe,
  updateRecipe,
  showRecipes,
  showRecipe,
  searchRecipe,
};
