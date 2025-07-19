import { useEffect, useState } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { ViewCoffe } from "../CoffeLog/ViewCoffe";
import { Global } from "../../../../helpers/Global";

export const View = ({ isOpen, onClose, recipe }) => {
  //Estado para manejar si queremos ver el cafe de la receta
  const [viewCoffe, setViewCoffe] = useState(false);
  //Estado para obtener la respuesta de la api de la receta
  const [recipeRequest, setRecipeRequest] = useState({});
  //Cafe seleccionado
  const [coffee, setCoffe] = useState({});
  //Id del cafe para manejo de la peticion
  const [idCoffee, setIdCoffee] = useState(null);

  //Buscamos el cafe cada vez que cargamos el componente
  useEffect(() => {
    showRecipe();
  }, []);

  //Cuando la petición ya nos devuelva el id del cafe lanzamos request a la api
  useEffect(() => {
    showCoffe();
  }, [idCoffee]);

  //Funcion para ver la receta completa con los datos que nos pasa el componente padre
  const showRecipe = async () => {
    try {
      const request = await fetch(
        Global.url + "recipes/recipe/" + recipe._id ,
        {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await request.json();
      if(data.status === "success") {
        setRecipeRequest(data.recipe);
        setIdCoffee(data.recipe.coffee._id);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //Funcion para ver el cafe
  const showCoffe = async () => {
    try {
      const request = await fetch(
        Global.url + "coffeelog/coffee/" + idCoffee ,
        {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await request.json();
      if(data.status === "success") {
        setCoffe(data.coffee);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900/30 backdrop-blur-md z-50">
        <div className="p-8 rounded-md bg-white shadow-md max-w-4xl w-full h-full md:max-h-[98vh] relative overflow-auto">
          {/* Botón de cierre */}
          <RiCloseCircleFill
            size={30}
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 cursor-pointer hover:text-gray-800"
          />

          {/* Encabezado */}
          <h2 className="text-lg font-semibold text-center mb-6">
            Detalles de la Receta
          </h2>

          {/* Sección de información básica */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-3">
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <p className="text-gray-500 text-sm">Título</p>
                <p className="text-gray-900 font-semibold">{recipeRequest.title}</p>
              </div>
              <div
                onClick={() => {
                  // setCoffe(recipeRequest.coffee);
                  setViewCoffe(true);
                }}
                className="bg-gray-100 p-4 rounded-lg shadow cursor-pointer"
              >
                <p className="text-gray-500 text-sm">Café</p>
                <p className="text-gray-900 font-semibold">
                  {coffee.coffeeName}
                </p>
              </div>
            </div>
          </div>

          {/* Sección de detalles de preparación */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-3">
              Preparación
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <p className="text-gray-500 text-sm">Método</p>
                <p className="text-gray-900 font-semibold">{recipeRequest.method}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <p className="text-gray-500 text-sm">Peso (g)</p>
                <p className="text-gray-900 font-semibold">
                  {recipeRequest.coffee_weight}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <p className="text-gray-500 text-sm">Tiempo extracción</p>
                <p className="text-gray-900 font-semibold">
                  {recipeRequest.brew_time} s
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <p className="text-gray-500 text-sm">Temperatura</p>
                <p className="text-gray-900 font-semibold">
                  {recipeRequest.temperature} ºC
                </p>
              </div>
            </div>
          </div>

          {/* Sección de parámetros adicionales */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-3">
              Parámetros Adicionales
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <p className="text-gray-500 text-sm">Ratio</p>
                <p className="text-gray-900 font-semibold">{recipeRequest.ratio}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <p className="text-gray-500 text-sm">Molienda</p>
                <p className="text-gray-900 font-semibold">
                  {recipeRequest.grind_size}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <p className="text-gray-500 text-sm">Preinfusión</p>
                <p className="text-gray-900 font-semibold">
                  {recipeRequest.preinfusion_time} s
                </p>
              </div>
            </div>
          </div>

          {/* Sección de descripción */}
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">
              Descripción
            </h3>
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <p className="text-gray-900">{recipeRequest.description}</p>
            </div>
          </div>
        </div>
        {viewCoffe && (
          <ViewCoffe
            isOpen={viewCoffe}
            onClose={() => setViewCoffe(false)}
            coffeToView={coffee}
          />
        )}
      </div>
    )
  );
};
