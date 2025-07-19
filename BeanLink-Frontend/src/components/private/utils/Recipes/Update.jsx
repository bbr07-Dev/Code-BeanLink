import { useEffect, useState } from "react";
import { useForm } from "../../../../hooks/useForm";
import useAuth from "../../../../hooks/useAuth";
import { SerializeForm } from "../../../../helpers/SerializeForm";

// Iconos react
import { RiCloseCircleFill } from "react-icons/ri";
import { Global } from "../../../../helpers/Global";

export const Update = ({ isOpen, onClose, recipe, onUpdate }) => {
  //Obtenemos los datos del usuario autenticado
  const { auth } = useAuth();
  //Estado para guardar los cafes del usuario
  const [coffeeLog, setCoffeLog] = useState([]);
  //Estado para guardar mensajes de respuesta
  const [message, setMessage] = useState(null);
  //Estado para saber si se ha guardado el elemento
  const [saved, setSaved] = useState(null);
  //Estado para saber si se esta cargando algo y que se vea el spinner
  const [charge, setCharge] = useState(null);

  useEffect(() => {
    //Cuando cargamos el formulario, comprobamos los cafés que tiene creados ese usuario para mostrarlos
    showCoffelog();
  }, []);

  //Funcion para llamar a la api y ver que cafés tiene creados
  const showCoffelog = async () => {
    try {
      const request = await fetch(Global.url + `coffeelog/${auth._id}`, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const data = await request.json();
      if (data.status !== "success") return;
      setCoffeLog(data.coffeLogs);
    } catch (e) {
      console.log(e);
    }
  };

  //Función para hacer la petición a la api para editar la receta
  const updateRecipe = async (e) => {
    setCharge("charging");
    e.preventDefault();
    //Recogemos los datos del formulario con el Serialice
    const newData = SerializeForm(e.target)
    try {
      const request = await fetch (Global.url + 'recipes/recipe/' + recipe._id, {
        method: "PUT",
        body: JSON.stringify(newData),
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
        }
      });
      const data = await request.json();
      if(data.status === "success") {
        onUpdate(data.recipe);
        setMessage(data.message);
        setSaved("saved");
        setCharge("charged");
        setTimeout(() => {
          onClose()
        }, 200);
      } else {
        setMessage(data.message);
        setSaved("error");
        setCharge("charged");
      }
    } catch (e) {
      setCharge("charged");
      setMessage(e.message);
      setSaved("error");
    }
  }

  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900/30 backdrop-blur-md transition-all duration-300 z-50">
        <div className="p-8 rounded-md bg-white shadow-md max-w-4xl w-full max-h-[98vh] relative overflow-auto">
          <RiCloseCircleFill
            size={30}
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 cursor-pointer hover:text-gray-800"
          />
          <h2 className="text-lg font-semibold text-center mb-6">
            Editar Receta
          </h2>

          <form className="space-y-6" onSubmit={updateRecipe}>
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Título
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={recipe.title}
                  className="mt-2 block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Café
                </label>
                <select
                  name="coffee"
                  defaultValue={recipe.coffee ? recipe.coffee.coffeName : ""}
                  className="mt-2 block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                >
                  {coffeeLog.map((coffee) => (
                    <option key={coffee.id} value={coffee.id}>
                      {coffee.coffeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Detalles de preparación */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Método
                </label>
                <input
                  type="text"
                  name="method"
                  defaultValue={recipe.method}
                  className="mt-2 block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Peso (g)
                </label>
                <input
                  type="text"
                  name="coffee_weight"
                  defaultValue={recipe.coffee_weight}
                  className="mt-2 block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Tiempo extracción
                </label>
                <input
                  type="text"
                  name="brew_time"
                  defaultValue={recipe.brew_time}
                  className="mt-2 block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Temperatura (ºC)
                </label>
                <input
                  type="text"
                  name="temperature"
                  defaultValue={recipe.temperature}
                  className="mt-2 block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Parámetros adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Ratio
                </label>
                <input
                  type="text"
                  name="ratio"
                  defaultValue={recipe.ratio}
                  className="mt-2 block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Tamaño molienda
                </label>
                <input
                  type="text"
                  name="grind_size"
                  defaultValue={recipe.grind_size}
                  className="mt-2 block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Preinfusión (s)
                </label>
                <input
                  type="text"
                  name="preinfusion_time"
                  defaultValue={recipe.preinfusion_time}
                  className="mt-2 block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Descripción
              </label>
              <textarea
                name="description"
                defaultValue={recipe.description}
                className="mt-2 block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm h-40 min-h-40 resize-none"
              />
            </div>

            {/* Botón de Envío */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-amber-700 text-white py-2 px-4 rounded-full hover:bg-amber-800"
              >
                Agregar
              </button>
            </div>
            {charge === "charging" && (
              <div className="flex justify-center items-center mt-4">
                <svg
                  className="animate-spin h-6 w-6 text-amber-600 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
                  ></path>
                </svg>
                <p className="text-amber-600 font-medium">
                  Creando registro...
                </p>
              </div>
            )}
            <strong>
              {saved === "saved" ? (
                <div
                  className=" mt-4 bg-lime-100 border border-lime-400 text-lime-700 px-4 py-3 rounded relative"
                  role="alert-success"
                >
                  <strong className="">
                    <p className="block sm:inline ml-2"> {message} </p>
                  </strong>
                  <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                    {/* Aquí podrías colocar un ícono o un botón para cerrar la alerta */}
                  </span>
                </div>
              ) : (
                ""
              )}
            </strong>
            <strong>
              {saved == "error" ? (
                <div
                  className=" mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert-danger"
                >
                  <strong className="">
                    <p className="block sm:inline ml-2"> {message} </p>
                  </strong>
                  <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                    {/* Aquí podrías colocar un ícono o un botón para cerrar la alerta */}
                  </span>
                </div>
              ) : (
                ""
              )}
            </strong>
          </form>
        </div>
      </div>
    )
  );
};
