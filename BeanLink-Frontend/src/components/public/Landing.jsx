import React, { useState } from "react";
import beans from "../../assets/img/Landing/beans.jpg";
import { Footer } from "./Footer";
import { useForm } from "../../hooks/useForm";
import { Global } from "../../helpers/Global";

export const Landing = () => {
  //Recogida datos formulario
  const { changed, form } = useForm();
  //Estado para mensajes de envio y de error
  const [message, setMessage] = useState(null);
  const [isSended, setIsSended] = useState(null);

  //Recogemos los datos del formulario y los mandamos a la api para envio de correo a soporte
  const sendSupportEmail = async (e) => {
    //Prevenimos el envio del formulario
    e.preventDefault();
    // //Hacemos petición a api
    try {
      const request = await fetch(Global.url + "send/support-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const response = await request.json();
      if (response.status === "success") {
        setMessage(response.message);
        setIsSended(true);
        setTimeout(() => {
          setIsSended(null);
        }, 4000);
      } else {
        setMessage(response.message);
        setIsSended(false);
        setTimeout(() => {
          setIsSended(null);
        }, 4000);
      }
    } catch (e) {
      console.log(e);
      setIsSended(false);
      setMessage(e.message);
    }
  };
  return (
    <div className="bg-gray-300">
      {/* Imagen en la parte superior con opacidad */}
      <div className="relative">
        <img
          src={beans}
          alt="Café de especialidad"
          className="w-full h-[400px] object-cover"
        />
        {/* Frase centrada sobre la imagen */}
        <div className="absolute inset-0 flex justify-center items-center">
          <h2 className="text-4xl font-semibold text-white text-center px-6">
            Conecta con el mundo del café de especialidad.
          </h2>
        </div>
      </div>

      {/* Contenedor con la información debajo de la imagen */}
      <div className="flex justify-center">
        <div className="w-full md:max-w-6xl">
          <div
            className="mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6"
            id="home"
          >
            <p className="text-lg leading-relaxed mt-4">
              En nuestra plataforma, cada taza de café cuenta una historia
              única, desde la finca que lo cultiva hasta el barista que lo
              prepara. Nuestro objetivo es crear una red de conexión que valore
              cada paso del proceso de producción del café y promueva la
              transparencia, la calidad y la colaboración entre productores,
              cafeterías y amantes del café.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              Ya sea que seas un productor de café buscando nuevos mercados, una
              cafetería queriendo compartir tus mejores recetas o un usuario que
              disfruta descubrir nuevas experiencias, aquí encontrarás un
              espacio para ti. A través de nuestra plataforma podrás registrar
              tus cafés, compartir tus recetas y descubrir publicaciones con
              recomendaciones y resultados.
            </p>
            <p className="text-xl font-semibold mt-4">
              Características principales:
            </p>
            <ul className="pl-5 space-y-2 mt-4">
              <li>
                <strong className="text-gray-700">
                  Conexión entre usuarios:
                </strong>{" "}
                conecta con productores, cafeterías y otros amantes del café.
              </li>
              <li>
                <strong className="text-gray-700">
                  Registro de cafés de especialidad:
                </strong>{" "}
                guarda y organiza los cafés que pruebas y disfrutas.
              </li>
              <li>
                <strong className="text-gray-700">
                  Recetas personalizadas:
                </strong>{" "}
                vincula recetas a tus cafés favoritos y compártelas con la
                comunidad subiendo publicaciones con el contenido que deseas.
              </li>
              <li>
                <strong className="text-gray-700">
                  Geolocalización dinámica:
                </strong>{" "}
                encuentra productores y cafeterías cercanas con nuestro mapa
                interactivo.
              </li>
            </ul>
          </div>
          <div
            className="mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6"
            id="about-us"
          >
            <h2 className="text-4xl font-semibold text-center mb-6">
              Sobre Nosotros
            </h2>
            <p className="text-lg leading-relaxed mt-4">
              <strong className="text-gray-700">
                Más que un café, una comunidad.
              </strong>{" "}
              Somos un equipo apasionado por el café de especialidad y creemos
              que cada paso en la cadena de producción tiene un impacto
              significativo en el sabor final de la taza. Nuestro proyecto nace
              con la misión de crear un espacio en el que cada parte de esa
              cadena sea reconocida y valorizada. Desde los productores que
              cultivan el café con cuidado y dedicación, hasta los baristas que
              convierten cada taza en una obra de arte, todos tienen un lugar en
              nuestra plataforma.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              Queremos facilitar la conexión entre las diferentes partes de este
              mundo fascinante del café, promoviendo la colaboración, el
              aprendizaje y la sostenibilidad. A través de nuestra plataforma,
              buscamos no solo mejorar la experiencia del café, sino también
              construir una red sólida que apoya la calidad y la transparencia
              en todo el proceso.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              <strong className="text-gray-700">Misión</strong>: Promover el
              café de especialidad y conectar a todos los involucrados en su
              cadena de valor de manera accesible, colaborativa y responsable.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              <strong className="text-gray-700">Visión:</strong> Ser la
              plataforma de referencia global para los amantes del café, creando
              una red interconectada que celebre la excelencia, la creatividad y
              la sostenibilidad.
            </p>
          </div>
          <div
            className="mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6"
            id="contact"
          >
            <h2 className="text-4xl font-semibold text-center mb-6">
              Contacto
            </h2>
            <form onSubmit={sendSupportEmail}>
              <div className="flex flex-wrap gap-6">
                {/* Formulario de inputs */}
                <div className="w-full sm:w-1/3">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Tu nombre
                  </label>
                  <input
                    name="name"
                    type="text"
                    onChange={changed}
                    className="mt-2 block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Tu email
                  </label>
                  <input
                    name="email"
                    type="email"
                    onChange={changed}
                    className="mt-2 block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>

              <label className="mt-4 block text-sm font-medium text-gray-900">
                Tu mensaje
              </label>
              <textarea
                type="text"
                name="message"
                onChange={changed}
                className="mt-2 block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm h-40 resize-none"
              />
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-amber-700 text-white py-2 px-4 mt-4 rounded-full hover:bg-amber-800"
                >
                  Enviar
                </button>
              </div>
              {/* Alertas en caso de posible error  */}
              <strong>
                {isSended == true ? (
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
                {isSended == false ? (
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
      </div>
      <Footer />
    </div>
  );
};
