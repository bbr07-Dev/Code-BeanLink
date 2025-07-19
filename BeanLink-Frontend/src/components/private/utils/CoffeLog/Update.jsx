import { SerializeForm } from "../../../../helpers/SerializeForm";
import { Global } from "../../../../helpers/Global";
import { useState, useRef, useEffect } from "react";
//Iconos de React
import { RiCloseCircleFill } from "react-icons/ri";
import { FiUploadCloud } from "react-icons/fi";
import { TiDelete } from "react-icons/ti";

export const Update = ({ isOpen, onClose, coffeToUpdate }) => {
  //estado para recibir las alertas de la api
  const [message, setMessage] = useState("");
  //Estado para indicar si se ha actualizado o no
  const [saved, setSaved] = useState("not-loaded");
  //Referencia para la imagen
  const fileInputRef = useRef(null);
  //Estado para saber si se esta subiendo la imagen
  const [charge, setCharge] = useState("not-loaded");
  //Estado para manejar el cafe
  const [coffe, setCoffe] = useState(coffeToUpdate);

  useEffect(() => {
    console.log(coffeToUpdate)
  }, [])

  //función para actualizar el cafe mediante endpint de api
  const updateCoffe = async (e) => {
    //Prevenimos envio del formulario
    e.preventDefault();
    console.log(coffe)
    //Recogemos los datos del formulario
    let newCoffe = SerializeForm(e.target);
    //Hacemos petición
    try {
      const request = await fetch(Global.url + "coffeelog/update/" + coffeToUpdate.id, {
        method: "PUT",
        body: JSON.stringify(newCoffe),
        headers: {
          "Content-type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
      //Pasamos respuesta a legible
      const data = await request.json();
      if (data.status === "success") {
        setCoffe(data.coffe);
        setSaved("saved");
        setMessage(data.message);
      } else {
        setSaved("error");
        setMessage(data.message);
      }
    } catch (e) {
      console.log(e);
      setMessage(data.message);
      setSaved("error");
    }
  };

  //Función para agregar una imagen mas al registro de cafe
  const addMedia = async () => {
    setCharge("charging");
    //Obtenemos el archivo subido
    let file = document.querySelector("#file");
    //Comprobamos que nos ha llegado
    if (file.files[0]) {
      //Creamos un form data y agregamos dentro el archivo
      const formData = new FormData();
      formData.append("file0", file.files[0]);
      //Lanzamos petición a la API
      try {
        const request = await fetch(
          Global.url + "coffeelog/media/" + coffeToUpdate.id,
          {
            method: "PUT",
            body: formData,
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        //Hacemos respuesta legible
        const data = await request.json();
        if (data.status === "success") {
          setCoffe(data.updatedCoffee);
          setCharge("charged");
          setSaved("saved");
          setMessage(data.message);
        } else {
          setCharge("charged");
          setSaved("error");
          setMessage(data.message);
        }
      } catch (e) {
        console.log(e);
        setCharge("charged");
        setSaved("error");
        setMessage(e.message);
      }
    }
  };

  //Funcion para eliminar una de las imagenes del registro
  const deleteMedia = async (index) => {
    //Obtenemos url de la imagen en la posicion que nos llega por parametro
    const imageUrl = coffe.media[index];
    //Hacemos petición a la API para su eliminación
    try {
      const request = await fetch(Global.url + "coffeelog/media/" + coffe.id, {
        method: "DELETE",
        body: JSON.stringify({urlImage: imageUrl}),
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
      //Recogemos respuesta de forma legible
      const data = await request.json();
      console.log(data);
      if (data.status === "success") {
        setCharge("charged");
        setSaved("saved");
        setMessage(data.message);
        setCoffe(data.coffe);
      } else {
        setCharge("charged");
        setSaved("error");
        setMessage(data.message);
      }
    } catch (e) {
      console.log(e);
      setCharge("charged");
      setSaved("error");
      setMessage(e.message);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900/30 backdrop-blur-md transition-all duration-300 z-50">
        <div className="p-8 rounded-md bg-white shadow-md max-w-4xl w-full max-h-[98vh] relative overflow-auto md:max-w-4xl sm:max-w-xl">
          <RiCloseCircleFill
            size={30}
            className="absolute top-2 right-2 text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={onClose}
          />
          <h2 className="mt-6 text-lg font-semibold mb-4">Editar Café</h2>
          <form className="space-y-6 mt-8" onSubmit={updateCoffe}>
            {/* Campos nombre cafe, roaster y puntuación SCA  */}
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="flex-1">
                <label
                  htmlFor="coffeeName"
                  className="block text-sm font-medium text-gray-900"
                >
                  Nombre
                </label>
                <div className="mt-2">
                  <input
                    defaultValue={
                      coffe.coffeName !== "undefined" ? coffe.coffeName : ""
                    }
                    type="text"
                    name="coffeeName"
                    className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex-1 mt-6 md:mt-0">
                <label
                  htmlFor="roaster"
                  className="block text-sm font-medium text-gray-900"
                >
                  Roaster
                </label>
                <div className="mt-2">
                  <input
                    defaultValue={
                      coffe.roaster !== "undefined" ? coffe.roaster : ""
                    }
                    type="text"
                    name="roaster"
                    className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex-1 md:flex-[0.5] mt-6 md:mt-0">
                <label
                  htmlFor="score"
                  className="block text-sm font-medium text-gray-900"
                >
                  Puntuación SCA
                </label>
                <div className="mt-2">
                  <input
                    defaultValue={coffe.score !== "undefined" ? coffe.score : ""}
                    type="text"
                    name="score"
                    className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            {/* Campo Origen, Valietal, altura y proceso */}
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="flex-1">
                <label
                  htmlFor="origin"
                  className="block text-sm font-medium text-gray-900"
                >
                  Origen
                </label>
                <div className="mt-2">
                  <input
                    defaultValue={
                      coffe.origin !== "undefined" ? coffe.origin : ""
                    }
                    type="text"
                    name="origin"
                    className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex-1 mt-6 md:mt-0">
                <label
                  htmlFor="high"
                  className="block text-sm font-medium text-gray-900"
                >
                  Altura
                </label>
                <div className="mt-2">
                  <input
                    defaultValue={coffe.high !== "undefined" ? coffe.high : ""}
                    type="text"
                    name="high"
                    className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex-1 mt-6 md:mt-0">
                <label
                  htmlFor="varietal"
                  className="block text-sm font-medium text-gray-900"
                >
                  Varietal
                </label>
                <div className="mt-2">
                  <input
                    defaultValue={
                      coffe.varietal !== "undefined" ? coffe.varietal : ""
                    }
                    type="text"
                    name="varietal"
                    className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="process"
                  className="block text-sm font-medium text-gray-900"
                >
                  Proceso
                </label>
                <div className="mt-2">
                  <input
                    defaultValue={
                      coffe.process !== "undefined" ? coffe.process : ""
                    }
                    type="text"
                    name="process"
                    className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            {/* Campo Notas de cata*/}
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="flex-1">
                <label
                  htmlFor="tastingNotes"
                  className="block text-sm font-medium text-gray-900"
                >
                  Notas de cata
                </label>
                <div className="mt-2">
                  <input
                    defaultValue={
                      coffe.tastingNotes[0] !== "undefined" ? coffe.tastingNotes : ""
                    }
                    type="text"
                    name="tastingNotes"
                    className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            {/* Campo Brew method, notas del creador */}
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="flex-1">
                <label
                  htmlFor="brewMethod"
                  className="block text-sm font-medium text-gray-900"
                >
                  Método de extracción recomendado
                </label>
                <div className="mt-2">
                  <input
                    defaultValue={
                      coffe.brewMethod !== "undefined" ? coffe.brewMethod : ""
                    }
                    type="text"
                    name="brewMethod"
                    className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex-1 mt-6 md:mt-0">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-900"
                >
                  Notas
                </label>
                <div className="mt-2">
                  <input
                    defaultValue={
                      coffe.notes !== "undefined" ? coffe.notes : ""
                    }
                    type="text"
                    name="notes"
                    className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            {/* Imagen o multimedia  */}
            <div className="flex justify-center flex-wrap gap-1">
              <div className="flex">
                {Array.isArray(coffe.media) && coffe.media.length > 1 ? (
                  coffe.media.map((mediaUrl, index) => (
                    <div key={index} className="relative m-4">
                      <img
                        className="w-[80%] object-cover border rounded-xl mt-2"
                        src={mediaUrl}
                        alt={`Preview ${index}`}
                      />
                      <TiDelete
                        onClick={() => deleteMedia(index)}
                        className="absolute top-0 right-[20%] text-gray-900 bg-white rounded-full cursor-pointer shadow-md hover:text-red-600"
                        size={25}
                      />
                    </div>
                  ))
                ) : (
                  <div className="relative m-4">
                    <img
                      className="w-[30%] object-cover border rounded-xl mt-2"
                      src={coffe.media}
                      alt="Preview"
                    />
                    <TiDelete
                      onClick={() => deleteMedia(index)}
                      className="absolute top-0 right-[70%] text-gray-900 bg-white rounded-full cursor-pointer shadow-md hover:text-red-600"
                      size={25}
                    />
                  </div>
                )}
              </div>
            </div>
            <div
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-100"
            >
              <FiUploadCloud className="mx-auto text-gray-500" size={40} />
              <p className="text-sm text-gray-500">
                Haz clic para agregar otra imagen
              </p>
            </div>
            <input
              type="file"
              name="file0"
              className="hidden"
              id="file"
              ref={fileInputRef}
              onChange={addMedia}
            />
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
                <p className="text-amber-600 font-medium">Subiendo imagen...</p>
              </div>
            )}
            {/* Botón de Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="flex justify-center rounded-full bg-amber-700 border border-transparent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-800 hover:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-800"
              >
                Actualizar
              </button>
            </div>
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
