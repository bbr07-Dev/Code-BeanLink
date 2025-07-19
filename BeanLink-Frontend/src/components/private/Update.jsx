import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Horario } from "./utils/User/Horario";
import { Menu } from "./utils/User/Menu";
import { Origins } from "./utils/User/Origins";
import { Certifications } from "./utils/User/Certifications";
import { Varietals } from "./utils/User/Varietals";
import { Search } from "./utils/Map/Search";
import { ViewLocation } from "./utils/Map/ViewLocation";
import { SerializeForm } from "../../helpers/SerializeForm";
import { Global } from "../../helpers/Global";
import { useValidation } from "../../hooks/useValidation";
// Iconos react
import { RiCloseCircleFill } from "react-icons/ri";

export const Update = ({ isOpen, onClose }) => {
  //Recogemos contexto de autenticación
  const { auth, setAuth } = useAuth();
  //Validador
  const { validateUpdate, errors } = useValidation();
  //Estado para enviar mensaje de api al front
  const [saved, setSaved] = useState("not-saved");
  const [message, setMessage] = useState("not-saved");
  //Estado para recoger las coordenadas del mapa
  const [coordinates, setCoordinates] = useState(null);

  // useEffect(() => {
  //   console.log(auth)
  // }, [])

  //Función para llamar a la API y actualizar todos los datos que tenemos en el formulario
  const updateUser = async (e) => {
    e.preventDefault();
    //Recogemos todos los datos del formulario
    let newDataUser = SerializeForm(e.target);
    console.log(newDataUser)
    //Agregamos las coordenadas si existen
    if (coordinates) {
      newDataUser.location = {
        type: "Point",
        coordinates: [coordinates.lng, coordinates.lat],
      };
    }
    //Validamos los datos de nwwDataUser
    const validate = validateUpdate(newDataUser);
    if (!validate) return;
    try {
      //Actualizamos el usuario en la bd
      const request = await fetch(Global.url + "users/update/" + auth.id, {
        method: "PUT",
        body: JSON.stringify(newDataUser),
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });

      const data = await request.json();
      if (data.status === "success") {
        setSaved("saved");
        setMessage(data.message);
        setAuth(data.user);
        console.log(data.user); //Aqui me devuelve openingHours vacio
        setTimeout(() => {
          onClose();
        }, 1800);
      } else {
        setSaved("error");
        setMessage(data.message);
      }
    } catch (e) {
      setSaved("error");
      setMessage(data.message);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center sm:flex-row bg-gray-900/30 backdrop-blur-md transition-all duration-300 z-50 ">
        <div className="p-8 rounded-md bg-white shadow-md max-w-4xl w-full h-full md:max-h-[98vh] relative overflow-auto">
          <RiCloseCircleFill
            size={30}
            className="absolute top-2 right-2 text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={onClose}
          />
          <h1 className="text-3xl text-center">Editar Usuario</h1>
          <form className="space-y-6 mt-8" onSubmit={updateUser}>
            {/* CAMPOS PARA EL USUARIO BASE  */}
            {/* Grupo Username y Email */}
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="flex-1">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-900"
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="username"
                    defaultValue={auth.username}
                    className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                  {errors.username && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                      <strong className="font-bold">{errors.username}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Campo Biografía */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-900"
                >
                  Biografía
                </label>
              </div>
              <div className="mt-2">
                <textarea
                  name="bio"
                  rows="10"
                  cols="50"
                  defaultValue={auth.bio}
                  className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
            </div>
            {/* CAMPOS PARA EL USUARIO CON ROLL DIFERENTE A USER Y BARISTA  */}
            {auth.role !== "user" && auth.role !== "barista" && (
              <div>
                <div className="flex justify-center mb-8 gap-6 flex-col sm:flex-row">
                  {/* Campo Horario  */}
                  <Horario />
                </div>
                <div className="flex justify-around mb-8 gap-6 flex-col sm:flex-row">
                  {/* Campo menu  */}
                  <Menu />
                  {/* Campo certificaciones  */}
                  <Certifications />
                </div>
                <div className="flex justify-around mb-8 gap-6 flex-col sm:flex-row">
                  {/* Campo variatales de cafe  */}
                  <Varietals />
                  {/* Campo origenes  */}
                  <Origins />
                </div>
                <div className="w-full">
                  {/* Campo busqueda direccion  */}
                  <Search setCoordinates={setCoordinates} />
                </div>
                <div className="mt-6">
                  {/* Si tenemos localizacion abrimos mapa (imagen fija) */}
                  {auth.location && (
                    <ViewLocation coordinates={auth.location.coordinates} />
                  )}
                </div>
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
