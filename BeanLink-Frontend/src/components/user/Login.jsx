import { useRef, useState } from "react";
import { Global } from "../../helpers/Global";
import { useForm } from "../../hooks/useForm";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useValidation } from "../../hooks/useValidation";

export const Login = () => {
  //Uso del useForm para serializar el formulario
  const { form, changed } = useForm({});
  //Estado para saber si se ha inidiado sesion okey o no
  const [isLoggin, setIsLoggin] = useState("not-sended");
  const [message, setMessage] = useState("");
  //Para rederigir a la parte privada
  const navigate = useNavigate();
  //Guardamos en el contexto el usuario loggeado
  const { setAuth } = useAuth();
  //Hook para validar datos del formulario
  const { errors, validateLogin } = useValidation();
  //Estado para saber si el check de ver contraseña esta activado
  const [showPassword, setShowPassword] = useState(false);

  const userToLoggin = async (e) => {
    //Prevenimos el envio del formulario
    e.preventDefault();
    //Validamos primero los datos del form
    let validate = !validateLogin(form);
    if (!validate) {
      return;
    }
    //Recogemos datos del usuario que va a loggear
    let userToLoggin = form;
    //Hacemos petición para comprobar que existe
    const request = await fetch(Global.url + "auth/login", {
      method: "POST",
      body: JSON.stringify(userToLoggin),
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    });
    //Hacemos legible
    const data = await request.json();
    //Si se devuelve el estado de satisfactorio
    if (data.status === "success") {
      //Persistimos los datos del usuario en el localStorage para guardar el token (guardamos sesión)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsLoggin(true);
      setMessage(data.message);
      setAuth(data.user);
    } else {
      setIsLoggin(false);
      setMessage(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-md bg-white shadow-md max-w-xs w-full">
        <h1 className="text-3xl text-center">Inicio de sesión</h1>
        <form className="space-y-6 mt-8" onSubmit={userToLoggin}>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Username
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="username"
                required
                onChange={changed}
                className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              />
              {errors.username && (
                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  <strong className="font-bold">{errors.username}</strong>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-semibold text-amber-700 hover:text-amber-500"
                >
                  He olvidado mi contraseña
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  required
                  onChange={changed}
                  className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="h-5 w-5 ml-2"
                />
              </div>
              {errors.password && (
                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  <strong className="font-bold">{errors.password}</strong>
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-full bg-amber-700 border border-transparent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-800 hover:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-800"
            >
              Acceder
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          ¿Todavía no eres miembro?{" "}
          <a
            href="/register"
            className="font-semibold text-amber-700 hover:text-amber-500"
          >
            Únete
          </a>
        </p>
        {/* Alertas en caso de posible error  */}
        <strong>
          {isLoggin == true ? (
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
          {isLoggin == false ? (
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
      </div>
    </div>
  );
};
