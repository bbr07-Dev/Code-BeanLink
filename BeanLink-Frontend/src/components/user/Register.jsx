import React, { useEffect, useRef, useState } from "react";
import { useForm } from "../../hooks/useForm";
import { Global } from "../../helpers/Global";
import { useNavigate } from "react-router-dom";
import avatar from "../../assets/img/user.png";
import { useValidation } from "../../hooks/useValidation";

export const Register = () => {
  //Desestructuación de lo que nos devuelve el hook creado useForm
  const { form, changed } = useForm({});
  //Desestructuramos el hook de validar los datos de formulario
  const { validateRegister, errors } = useValidation();
  //Estado para conocer desde el front el resultado de la petición
  const [saved, setSaved] = useState("not-saved");
  const [message, setMessage] = useState("not-saved");
  //Hook para redirigir a otra url mediante navigate
  const navigate = useNavigate();
  //Estado para saber si el check de ver contraseña esta activado
  const [showPassword, setShowPassword] = useState(false);

  //Seguridad
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    symbol: false,
  });

  //Funcion para guardar usuario y llamar a la api
  const saveUser = async (e) => {
    //Obtenemos el evento y prevenimos comportamiento por defecto
    e.preventDefault();
    //Validamos primero los datos antes de crear el usuario
    validateRegister(form);
    if (errors.length > 1) return;
    //El nuevo usuario es lo que tenemos en el estado formulario (recogemos los datos)
    let newUser = form;
    //Si no metemos avatar ponemos por defecto
    if (newUser.avatar === "" || !newUser.avatar) newUser.avatar = avatar;
    //Guardar usuario en el backend (hacemos petición a api)
    const request = await fetch(Global.url + "auth/register", {
      method: "POST",
      body: JSON.stringify(newUser), //Pasamos el usuario a json
      headers: {
        "Content-type": "application/json",
      },
    });
    //Hacer request legible
    const data = await request.json();
    if (data.status == "success") {
      setSaved("saved");
      setMessage(data.message);
      //Esperamos para redirigir hasta que se muestre el mensaje
      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } else {
      setSaved("error");
      setMessage(data.message);
    }
  };

  //Función para ir comprobando la seguridad de la password
  useEffect(() => {
    //Cada vez que hay cambio en password
    const password = form.password;
    if (password) {
      setPasswordStrength({
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        symbol: /[!@#$%^&*_\-(),.?":{}|<>]/.test(password),
      });
    }
  }, [form.password]);

  return (
    <div className="min-h-screen flex items-center justify-center mb-6">
      <div className="p-8 rounded-md bg-white shadow-md max-w-4xl w-full">
        <h1 className="text-3xl text-center">Registro</h1>
        <form className="space-y-6 mt-8" onSubmit={saveUser}>
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
            <div className="flex-1 mt-6 md:mt-0">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  required
                  onChange={changed}
                  className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
                {errors.email && (
                  <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <strong className="font-bold">{errors.email}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Grupo Contraseña y Repite Contraseña */}
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Contraseña
                </label>
              </div>
              <div className="mt-2 flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  required
                  onChange={changed}
                  className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="flex-1 mt-6 md:mt-0">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password2"
                  className="block text-sm font-medium text-gray-900"
                >
                  Repite Contraseña
                </label>
              </div>
              <div className="mt-2 flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password2"
                  id="password2"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
                <input
                  type="checkbox"
                  className="h-5 w-5 ml-2"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                {errors.passwordDiferent && (
                  <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <strong className="font-bold">
                      {errors.passwordDiferent}
                    </strong>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            {/* Seguridad de contraseña */}
            <div className="mt-4 flex justify-around space-y-1 text-center p-2 rounded-md bg-gray-200 p-2">
              <p
                className={`text-sm font-bold ${
                  passwordStrength.length ? "text-lime-600" : "text-amber-500"
                }`}
              >
                Mínimo 8 caracteres
              </p>
              <p
                className={`text-sm font-bold ${
                  passwordStrength.uppercase
                    ? "text-lime-600"
                    : "text-amber-500"
                }`}
              >
                Al menos una mayúscula
              </p>
              <p
                className={`text-sm font-bold ${
                  passwordStrength.lowercase
                    ? "text-lime-600"
                    : "text-amber-500"
                }`}
              >
                Al menos una minúscula
              </p>
              <p
                className={`text-sm font-bold ${
                  passwordStrength.symbol ? "text-lime-600" : "text-amber-500"
                }`}
              >
                Al menos un símbolo
              </p>
            </div>
            {errors.password && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">{errors.password}</strong>
              </div>
            )}
          </div>

          {/* Campo Tipo de perfil */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-900"
              >
                Tipo de perfil
              </label>
            </div>
            <div className="mt-2">
              <select
                name="role"
                onChange={changed}
                className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              >
                <option value="">Selecciona rol</option>
                <option value="user">Usuario</option>
                <option value="barista">Barista</option>
                <option value="cafe">Cafetería</option>
                <option value="roaster">Tostador</option>
                <option value="producer">Productor</option>
              </select>
              {errors.role && (
                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  <strong className="font-bold">{errors.role}</strong>
                </div>
              )}
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
                onChange={changed}
                className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Botón de Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="flex justify-center rounded-full bg-amber-700 border border-transparent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-800 hover:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-800"
            >
              Sign Up
            </button>
          </div>
        </form>
        <strong>
          {saved == "saved" ? (
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
      </div>
    </div>
  );
};
