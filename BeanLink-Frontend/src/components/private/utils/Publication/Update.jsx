import { useEffect, useState } from "react";
import { Global } from "../../../../helpers/Global";
import { SerializeForm } from "../../../../helpers/SerializeForm";
import useAuth from "../../../../hooks/useAuth";

//Iconos react
import { RiCloseCircleFill } from "react-icons/ri";

export const Update = ({ isOpen, onClose, post, onUpdate }) => {
  //Usuario logueado
  const {auth} = useAuth();
  //Estado para la publicacion
  const [publication, setPublication] = useState(post);
  // Estado para imágenes nuevas
  const [images, setImages] = useState([]);
  // Estado para imágenes existentes
  const [existingImages, setExistingImages] = useState(post.media || []);
  //Estado para saber si se ha guardado
  const [saved, setSaved] = useState("not-loaded");
  //Estado para saber si se esta cargando
  const [charge, setCharge] = useState("not-loaded");
  //Estado para ver el mensaje de error o de success
  const [message, setMessage] = useState("");
  //Recetas del usuario para poder vincular a la publicacion
  const [recipes, setRecipes] = useState([]);

  //Cuando cargamos este componente, comprobamos las recetas que tenemos
  useEffect(() => {
    showRecipes();
  }, []);

  // Manejar selección de nuevas imágenes
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = images.length + existingImages.length + files.length;

    if (totalImages > 5) {
      alert("Solo puedes subir hasta 5 imágenes.");
      return;
    }

    setImages([...images, ...files]);
  };

  // Eliminar imagen nueva seleccionada
  const removeNewImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  //Eliminar imagen existente, peticion a API y recargamos post
  const removeExistingImage = async (image, index) => {
    setCharge("charging");
    try {
      const request = await fetch(Global.url + "posts/post/media/" + post._id, {
        method: "DELETE",
        body: JSON.stringify({ url: image }),

        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
      //Recogemos respuesta
      const data = await request.json();
      if (data.status === "success") {
        setCharge("charged");
        setMessage(data.message);
        setSaved("saved");
        setPublication(data.publication);
        setExistingImages(data.publication.media);
        //Actualizamos para que el componente padre lo detecte
        onUpdate(data.publication);
      }
    } catch (e) {
      setCharge("charged");
      setMessage(e.message);
      setSaved("error");
    }
  };

  //Actualizar registro mediante peticion a la api
  const updateRegister = async (e) => {
    setCharge("charging");
    e.preventDefault();
    //Recogemos los datos del formulario
    const newData = SerializeForm(e.target);
    //Creamos un formData
    const formData = new FormData();
    //Agregamos las imagenes al formData
    images.forEach((image, index) => {
      formData.append("file0", image);
    });
    try {
      //Petición para actualizar descripción
      const request = await fetch(Global.url + "posts/post/" + post._id, {
        method: "PUT",
        body: JSON.stringify({ text: newData.text, recipe: newData.recipe }),
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
      //Recogemos respuesta
      const data = await request.json();
      //Petición para actualizar imagenes
      const mediaRequest = await fetch(
        Global.url + "posts/post/media/" + post._id,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      //Recogemos resultado
      const mediaData = await mediaRequest.json();

      //Seteamos estados y enviamos mensajes
      if (data.status === "success") {
        setCharge("charged");
        setMessage(data.message);
        setSaved("saved");
        setPublication(data.publication);
        //Actualizamos para que el componente padre lo detecte
        onUpdate(data.publication);
      }
      if (mediaData.status === "success") {
        setCharge("charged");
        setMessage(mediaData.message);
        setSaved("saved");
        setPublication(mediaData.publication);
        //Actualizamos para que el componente padre lo detecte
        onUpdate(mediaData.publication);
      }
    } catch (e) {
      setCharge("charged");
      setMessage(e.message);
      setSaved("error");
    }
  };

  //Accion para llamar a la API y ver las recetas creadas de ese usuario para poder enlazarla al post
  const showRecipes = async () => {
    try {
      const request = await fetch(Global.url + "recipes/" + auth._id, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const data = await request.json();
      if (data.status === "success") {
        setRecipes(data.recipes);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900/30 backdrop-blur-md z-50">
        <div className="p-8 rounded-md bg-white shadow-md max-w-4xl w-full max-h-[98vh] relative overflow-auto">
          <RiCloseCircleFill
            size={30}
            className="absolute top-2 right-2 text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={onClose}
          />
          <h2 className="text-lg font-semibold mb-4">Editar Publicación</h2>
          <form className="space-y-6" onSubmit={updateRegister}>
            {/* Descripcion  */}
            <label className="block text-sm font-medium text-gray-900">
              Descripción
            </label>
            <input
              type="text"
              name="text"
              defaultValue={publication.text}
              className="block w-full bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 file:py-2 file:px-4 file:bg-amber-700 file:text-white hover:file:bg-amber-800"
            />
            {/* Recetas del usuario  */}
            <label className="block text-sm font-medium text-gray-900">
              Recetas
            </label>
            <select
              name="recipe"
              className="mt-2 block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            >
              <option value="">Selecciona una Receta</option>
              {recipes.map((recipe) => (
                <option key={recipe.id} value={recipe._id}>
                  {recipe.title}
                </option>
              ))}
            </select>
            {/* Imagenes  */}
            <label className="block text-sm font-medium text-gray-900">
              Imágenes (Máx. 5)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              name="file0"
              onChange={handleFileChange}
              className="block w-full bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 file:py-2 file:px-4 file:bg-amber-700 file:text-white hover:file:bg-amber-800"
            />
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {/* Imágenes */}
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {/* IMAGENES EXISTENTES EN EL POST  */}
                {existingImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image} // Asegúrate de que `post.media` almacena URLs accesibles
                      alt="Imagen guardada"
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1"
                      onClick={() => removeExistingImage(image, index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {/* IMAGENES QUE AGREGAMOS  */}
                {/* Nuevas imágenes */}
                {images.map((image, index) => (
                  <div key={`new-${index}`} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Nueva imagen"
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1"
                      onClick={() => removeNewImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
                  Actualizando publicacion...
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
