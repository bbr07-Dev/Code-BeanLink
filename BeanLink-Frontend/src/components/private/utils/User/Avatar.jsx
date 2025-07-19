import React, { useEffect, useRef, useState } from "react";
import { Global } from "../../../../helpers/Global";
import useAuth from "../../../../hooks/useAuth";
import avatar from "../../../../assets/img/user.png";
// Iconos react
import { RiCloseCircleFill } from "react-icons/ri";
import { FiUploadCloud } from "react-icons/fi";

export const Avatar = ({ isOpen, onClose }) => {
  //Estado auth de sesion iniciada
  const { auth, setAuth } = useAuth();

  //Estado de cargando
  const [charge, setCharge] = useState("not-loaded");

  //Referencia para la imagen
  const fileInputRef = useRef(null);

  //Cierre automatico de ventana
  useEffect(() => {
    if(charge === "charged"){
      setTimeout(() => {
        onClose();
        setCharge("not-loaded")
      }, 500);
    }  
  }, [charge, onClose])
  
  //Función para obtener y actualizar la imagen (llamada a api)
  const uploadFile = async () => {
    setCharge("charging");
    //Obtenemos el archivo subido
    let file = document.querySelector("#file");
    //Comprobamos que nos ha llegado
    if (file.files[0]) {
      //Creamos un formData y agregamos el archivo dentro
      const formData = new FormData();
      formData.append("file0", file.files[0]);
      //Hacemos la petición ajax
      try {
        const uploadRequest = await fetch(
          Global.url + "/users/avatar/" + auth._id,
          {
            method: "PUT",
            body: formData,
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const uploadData = await uploadRequest.json();
        if (uploadData.status === "success") {
          setAuth((prev) => ({
            ...prev,
            avatar: uploadData.user.avatar,
          }));
          setCharge("charged");
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900/30 backdrop-blur-md transition-all duration-300 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg relative w-80">
          <RiCloseCircleFill
            size={30}
            className="absolute top-2 right-2 text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={onClose}
          />
          <h2 className="text-lg font-semibold mb-4">Actualizar Imagen</h2>

          {/* Imagen previsualizada */}
          <div className="flex justify-center mb-4">
            <img
              className="w-32 h-32 border rounded-full object-cover"
              src={auth.avatar ? auth.avatar : avatar}
              alt="Preview"
            />
          </div>

          {/* Input file oculto */}
          <div
            className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-100"
            onClick={() => fileInputRef.current.click()}
          >
            <FiUploadCloud className="mx-auto text-gray-500" size={40} />
            <p className="text-sm text-gray-500">
              Haz clic para subir una imagen
            </p>
          </div>
          <input
            type="file"
            name="file0"
            className="hidden"
            id="file"
            ref={fileInputRef}
            onChange={uploadFile}
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
        </div>
      </div>
    )
  );
};
