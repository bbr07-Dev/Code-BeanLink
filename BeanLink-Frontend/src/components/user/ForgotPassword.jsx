import { useState } from "react";
import { Global } from "../../helpers/Global";
import { useForm } from "../../hooks/useForm";

export const ForgotPassword = () => {
  //Estado para obtener lo que indicamos en el formulario
  const { changed, form } = useForm();
  //Estados para manejar mensajes y errores
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  //Estado para saber si se ha enviado el correo
  const [isSended, setIsSended] = useState("not-sended");

  const sendEmail = async (e) => {
    //Prevenimos el envio del formulario
    e.preventDefault();
    try {
      //Realizamos petición a la API para que envie el correo
      const request = await fetch(Global.url + "user/forgot-password", {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
      //Recogemos resultado de la peticion
      const response = await request.json();
      if (response.status === "success") {
        setMessage(response.message);
        setIsSended(true);
      } else {
        setMessage(response.message);
        setError(response.error);
        setIsSended(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-md bg-white shadow-md max-w-xs w-full">
        <h1 className="text-3xl text-center">Restablecer contraseña</h1>
        <form className="space-y-6 mt-8" onSubmit={sendEmail}>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Email
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                placeholder="Email de recuperación"
                onChange={changed}
                required
                className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-full bg-amber-700 border border-transparent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-800 hover:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-800"
            >
              Enviar
            </button>
          </div>
          {isSended === true ? (
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
          {isSended === false ? (
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
        </form>
      </div>
    </div>
  );
};
