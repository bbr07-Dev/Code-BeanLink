import React, { useEffect, useState } from "react";
import { useForm } from "../../../../hooks/useForm";
import { Global } from "../../../../helpers/Global";
// Iconos react
import { RiCloseCircleFill } from "react-icons/ri";

export const Add = ({ isOpen, onClose }) => {
  //Agregamos useForm para recoger los datos del formulario cuando pulsamos en agregar
  const { changed, form, setForm } = useForm();

  //Estado de cargando
  const [charge, setCharge] = useState("not-loaded");

  //estado para recibir las alertas de la api
  const [message, setMessage] = useState("");

  //Estado para saber si se esta subiendo la imagen
  const [saved, setSaved] = useState("not-loaded");
  //UseEffect para cerrar la ventana cuanto termine la peticion
  useEffect(() => {
    if (charge === "charged") {
    }
  }, [charge, onClose]);

  //Función para hacer llamada a API y agregar un nuevo registro en coffelog
  const addCoffe = async (e) => {
    //Cargando
    setCharge("charging");
    //Prevenimos el envío del formulario
    e.preventDefault();

    //Generamos un formData
    const formData = new FormData();
    //Agregamos todos los datos del formulario
    formData.append("coffeeName", form.coffeeName);
    formData.append("origin", form.origin);
    formData.append("varietal", form.varietal);
    formData.append("process", form.process);
    formData.append("high", form.high);
    formData.append("roaster", form.roaster);
    formData.append("tastingNotes", form.tastingNotes);
    formData.append("score", parseFloat(form.score));
    formData.append("brewMethod", form.brewMethod);
    formData.append("notes", form.notes);

    if (form.file0) {
      formData.append("file0", form.file0); // Debe coincidir con el campo que el backend espera
    }

    //Relizamos la petición a la API
    try {
      const request = await fetch(Global.url + "coffeelog", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: localStorage.getItem("token"),
          //Para formData fetch maneja el contentType automaticamente
        },
      });
      //Pasamos la respuesta a legible
      const data = await request.json();
      console.log(data)
      if (data.status === "success") {
        setCharge("charged");
        setSaved("saved");
        setMessage(data.message);
        setTimeout(() => {
          onClose();
        }, 500);
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
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900/30 backdrop-blur-md transition-all duration-300 z-50 mt-20 md:mt-0 mb-8 md:mb-0">
        <div className="p-8 rounded-md bg-white shadow-md max-w-4xl w-full max-h-[98vh] relative overflow-auto md:max-w-4xl sm:max-w-xl">
          <RiCloseCircleFill
            size={30}
            className="absolute top-2 right-2 text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={onClose}
          />
          <h2 className="mt-6 text-lg font-semibold mb-4">Agregar Café</h2>
          <form className="space-y-6 mt-8" onSubmit={addCoffe}>
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
                    onChange={changed}
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
                    onChange={changed}
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
                    onChange={changed}
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
                    onChange={changed}
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
                    onChange={changed}
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
                    onChange={changed}
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
                    onChange={changed}
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
                    onChange={changed}
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
                    onChange={changed}
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
                    onChange={changed}
                    type="text"
                    name="notes"
                    className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            {/* Imagen o multimedia  */}
            <div>
              <label
                htmlFor="file0"
                className="block text-sm font-medium text-gray-900"
              >
                Imagen o Multimedia
              </label>
              <div className="mt-2">
                <input
                  onChange={(e) =>
                    setForm({ ...form, file0: e.target.files[0] })
                  }
                  type="file"
                  name="file0"
                  accept="image/*"
                  className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-700 file:text-white hover:file:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
            </div>
            {/* Botón de Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="flex justify-center rounded-full bg-amber-700 border border-transparent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-800 hover:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-800"
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
