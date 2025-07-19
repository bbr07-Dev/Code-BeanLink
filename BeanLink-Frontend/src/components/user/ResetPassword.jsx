import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useParams } from "react-router-dom";
import { Global } from "../../helpers/Global";
import { useNavigate } from "react-router-dom";

export const ResetPassword = () => {
  //Hook para recoger las passwords del formulario
  const { changed, form } = useForm();
  //Estado para manejar mensajes y errores
  const [message, setMessage] = useState(null);
  const [passwordChanged, setPasswordChanged] = useState(null);
  //Extraemos el token de la url
  const { token } = useParams();
  //Para rederigir al login
  const navigate = useNavigate();

  //Función para solicitar a la API el cambio de password
  const changePassword = async (e) => {
    e.preventDefault();
    //Comprobamos que las dos passwords son iguales
    if (form.password1 !== form.password2) {
      setMessage("Las contraseñas no son iguales");
      setPasswordChanged(false);
    } else if (
      !/^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*[\W_])).{8,}$/.test(form.password)
    ) {
      setMessage(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un símbolo"
      );
      setPasswordChanged(false);
    }
    try {
      //Hacemos petición a API para que modifique la contraseña de ese usuario
      const request = await fetch(Global.url + "user/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          password: form.password1, // Enviamos la nueva contraseña
        }),
      });
      //Hacemos respuesta legible
      const response = await request.json();
      if (response.status === "success") {
        setPasswordChanged(true);
        setMessage(response.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (e) {
      console.log(e);
      setPasswordChanged(false);
      setMessage(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-md bg-white shadow-md max-w-xs w-full">
        <h1 className="text-3xl text-center">Restablecer contraseña</h1>
        <form className="space-y-6 mt-8" onSubmit={changePassword}>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Contraseña
            </label>
            <div className="mt-2">
              <input
                type="password"
                name="password1"
                placeholder="Nueva contraseña"
                required
                onChange={changed}
                className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Repite contraseña
              </label>
            </div>
            <div className="mt-2">
              <input
                type="password"
                name="password2"
                placeholder="Confirmar contraseña"
                required
                onChange={changed}
                className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-full bg-amber-700 border border-transparent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-800 hover:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-800"
            >
              Cambiar
            </button>
          </div>
          {/* Alertas en caso de posible error  */}
          <strong>
            {passwordChanged == true ? (
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
            {passwordChanged == false ? (
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
  );
};
