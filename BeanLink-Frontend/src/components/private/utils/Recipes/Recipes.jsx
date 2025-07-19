import { useEffect, useState } from "react";
import { Global } from "../../../../helpers/Global";
import useAuth from "../../../../hooks/useAuth";
import { Add } from "./Add";
import { View } from "./View";
import { Update } from "./Update";
import { useForm } from "../../../../hooks/useForm";

//Iconos react
import { IoMdAddCircle } from "react-icons/io";
import { TiTrash, TiEdit } from "react-icons/ti";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import { FaCheckCircle } from "react-icons/fa";

export const Recipes = ({ onUpdate, user, permited }) => {
  //Usuario logueado
  const { auth } = useAuth();
  //Estado con la lista de recetas
  const [recipes, setRecipes] = useState([]);
  //Estado para saber si estamos agregando una receta
  const [add, setAdd] = useState(false);
  //Estado para saver si estamos viendo una receta
  const [viewRecipe, setViewRecipe] = useState(false);
  //Estado para saber si estamos editando la receta
  const [updateRecipe, setUpdateRecipe] = useState(false);
  //Estado para pasar la receta que queremos editar o ver a los componentes hijos
  const [recipe, setRecipe] = useState(false);
  //Estado para enviar la page a la peticion (1 por defecto)
  const [page, setPage] = useState(1);
  //Estado para manejar pagina siguiente
  const [nextPage, setNextPage] = useState(null);
  //Estado para manejar pagina anterior
  const [prevPage, setPrevPage] = useState(null);
  //Estado para manejar el numero total de paginas (por defecto 1)
  const [totalPages, setTotalPages] = useState(1);

  //Estado para los filtros
  const [filters, setFilters] = useState({
    coffeeName: "",
    origin: "",
    varietal: "",
    process: "",
    method: "",
  });
  // Estado para saber si se a abierto algun filtro
  const [activeFilter, setActiveFilter] = useState(null);
  //Para recoger los cambios del input
  const { changed, form, setForm } = useForm();

  useEffect(() => {
    //Cuando cargamos el componente llamamos a la funcion para ver las recetas
    showRecipes();
  }, [add, viewRecipe, page]);

  // Función para manejar la adición o eliminación de una receta
  const handleUpdate = () => {
    showRecipes(); // Recarga recetas
    if (onUpdate) onUpdate(); // Notifica al componente padre (Profile)
  };

  //Función para ver todas las recetas del usuario logueado
  const showRecipes = async () => {
    //Obtener usuario que nos envian por porp
    const userIdToShow = user._id;
    try {
      //Hacemos petición a la api para ver las recetas
      const request = await fetch(
        Global.url + `recipes/${userIdToShow}/${page}`,
        {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      //Obtenemos resultado
      const data = await request.json();
      if (data.status === "success") {
        setRecipes(data.recipes);
        if (data.hasNextPage) setNextPage(data.hasNextPage);
        if (data.hasPrevPage) setPrevPage(data.hasPrevPage);
        if (data.pages) setTotalPages(data.pages);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  //Función para eliminar una de las recetas cuando pulsamos el boton de papelera
  const deleteRecipe = async (recipe) => {
    //Id de la receta que queremos eliminar
    const idRecipe = recipe._id;
    try {
      const request = await fetch(Global.url + "recipes/recipe/" + idRecipe, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const data = await request.json();
      if (data.status === "success") showRecipes();
    } catch (e) {
      console.log(e);
    }
  };

  //Función para buscar y darle funcionalidad a los filtros
  const search = async () => {
    try {
      //Pasamos el contenido del form a parametros query (que es lo que espera el servidor)
      const queryParams = new URLSearchParams(form).toString();
      const request = await fetch(
        Global.url + `recipes/search/${user._id}?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await request.json();
      if (data.status === "success") {
        setRecipes(data.recipes.docs);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="mt-20 relative max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-6 p-6">
      <div className="mt -6 flex flex-col gap-4 cursor-pointer">
        {/* // Sección de filtros */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex flex-col gap-4">
            {/* Filtros  */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Filtros</span>
              {/* // Mostrar los filtros activos como "chips" */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(form).map(
                  ([key, value]) =>
                    value && (
                      <div
                        key={key}
                        className="flex items-center bg-lime-400 text-white rounded-full px-3 py-1 shadow-sm"
                      >
                        <span className="text-sm capitalize mr-2">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span className="text-sm font-medium">{value}</span>
                        <TiDelete
                          onClick={() => {
                            setForm((prev) => ({ ...prev, [key]: "" }));
                            showRecipes(); // Vuelve a cargar los cafés sin el filtro eliminado
                          }}
                          className="hover:text-red-600"
                        />
                      </div>
                    )
                )}
              </div>
              {/* Botones de filtros como bolitas */}
              <div className="flex flex-wrap gap-2">
                {Object.keys(filters).map((filterKey) => (
                  <button
                    key={filterKey}
                    onClick={() => {
                      setActiveFilter(
                        activeFilter === filterKey ? null : filterKey
                      );
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
        ${
          filters[filterKey]
            ? "bg-lime-500 text-white"
            : "bg-white text-gray-500"
        }
        border ${
          activeFilter === filterKey
            ? "border-lime-600 shadow-lg"
            : "border-gray-300"
        }
        hover:shadow-md hover:border-lime-500`}
                    title={filterKey.replace(/([A-Z])/g, " $1").trim()}
                  >
                    {filterKey === "coffeeName" && "☕"}
                    {filterKey === "origin" && "🌍"}
                    {filterKey === "varietal" && "🌱"}
                    {filterKey === "process" && "⚙️"}
                    {filterKey === "method" && "📋"}
                  </button>
                ))}
              </div>
            </div>
            {/* Input valor de filtro (oculto hasta que pulsamos) */}
            <div>
              {activeFilter && (
                <div className="max-w-full bg-white p-4 rounded-lg shadow-xl border border-gray-100">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        {activeFilter.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      <TiDelete
                        onClick={() => setActiveFilter(null)}
                        className="hover:text-red-600"
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        name={activeFilter}
                        type="text"
                        autoFocus
                        className="w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        onChange={changed}
                      />
                      <FaCheckCircle
                        onClick={search}
                        className="mr-4 hover:text-green-600"
                        size={17}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Café</th>
                <th className="py-3 px-6 text-left">Origen</th>
                <th className="py-3 px-6 text-left">Varietal</th>
                <th className="py-3 px-6 text-left">Método</th>
                {permited && (
                  <th className="py-3 px-6 text-center">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-md font-light">
              {recipes && recipes.length > 0 ? (
                recipes.map((recipe, index) => (
                  <tr
                    onClick={() => {
                      setViewRecipe(true);
                      setRecipe(recipe);
                    }}
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    {/* Celda del nombre del cafe */}
                    <td className="py-4 px-6">
                      <div className="bg-gray-50 rounded-lg shadow p-4">
                        <p className="font-medium text-gray-800">
                          {recipe.coffee ? recipe.coffee.coffeeName : ""}
                        </p>
                      </div>
                    </td>

                    {/* Celda del origen */}
                    <td className="py-4 px-6">
                      <div className="bg-gray-50 rounded-lg shadow p-4">
                        <p className="text-gray-600">
                          {recipe.coffee ? recipe.coffee.origin : ""}
                        </p>
                      </div>
                    </td>

                    {/* Celda del varietal */}
                    <td className="py-4 px-6">
                      <div className="bg-gray-50 rounded-lg shadow p-4">
                        <p className="text-gray-600">
                          {recipe.coffee ? recipe.coffee.varietal : ""}
                        </p>
                      </div>
                    </td>

                    {/* Celda del método */}
                    <td className="py-4 px-6">
                      <div className="bg-gray-50 rounded-lg shadow p-4">
                        <p className="text-gray-600">{recipe.method}</p>
                      </div>
                    </td>

                    {/* Celda de acciones */}
                    {permited && (
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center gap-3">
                          <TiTrash
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRecipe(recipe);
                              setViewRecipe(false);
                            }}
                            className="text-red-500 hover:text-red-700 cursor-pointer z-50"
                            size={20}
                          />
                          <TiEdit
                            onClick={() => {
                              setUpdateRecipe(true);
                              setViewRecipe(false);
                              setRecipe(recipe);
                            }}
                            className="text-amber-500 hover:text-amber-700 cursor-pointer"
                            size={20}
                          />
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <p className="text-center text-gray-600">
                      No hay registros de recetas.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Botón agregar */}
        <div className="mt-4 p-1 flex justify-center hover:text-lime-700">
          {permited && <IoMdAddCircle onClick={() => setAdd(true)} size={30} />}
        </div>
        {/* Paginación */}
        {totalPages && totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <MdNavigateBefore
              className="text-gray-600 bg-white rounded-full p-2 hover:text-gray-800 hover:rounded-full hover:shadow-md cursor-pointer transition-all duration-200 ease-in-out"
              onClick={() => {
                if (prevPage) setPage((prev) => Math.max(prev - 1, 1));
              }}
              size={40}
            />
            <span className="text-gray-700">
              Página {page} de {totalPages}
            </span>
            <MdNavigateNext
              className="text-gray-600 bg-white rounded-full p-2 hover:text-gray-800 hover:rounded-full hover:shadow-md cursor-pointer transition-all duration-200 ease-in-out"
              size={40}
              onClick={() => {
                if (nextPage) setPage((prev) => Math.min(prev + 1, totalPages));
              }}
            />
          </div>
        )}
        {add && <Add isOpen={add} onClose={() => setAdd(false)} />}
        {viewRecipe && (
          <View
            isOpen={viewRecipe}
            onClose={() => setViewRecipe(false)}
            recipe={recipe}
          />
        )}
        {updateRecipe && (
          <Update
            isOpen={updateRecipe}
            onClose={() => {
              setUpdateRecipe(false);
              setViewRecipe(false);
            }}
            onUpdate={handleUpdate}
            recipe={recipe}
          />
        )}
      </div>
    </div>
  );
};
