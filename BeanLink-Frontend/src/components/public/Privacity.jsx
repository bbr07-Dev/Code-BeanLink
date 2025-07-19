import { Link } from "react-router-dom";
import policy from "../../assets/img/Landing/policy.png";
import terms from "../../assets/img/Landing/terms.jpg"
import { Footer } from "./Footer";

export const Privacity = () => {
  return (
    <div className="bg-gray-100">
      {/* Imagen en la parte superior con opacidad */}
      <div className="relative">
        <img
          src={policy}
          alt="Café de especialidad"
          className="w-full h-[400px] object-cover"
        />
        {/* Frase centrada sobre la imagen */}
        <div className="absolute inset-0 flex justify-center items-center">
          <h2 className="text-4xl font-semibold text-white text-center px-6">
            Política de Privacidad
          </h2>
        </div>
      </div>

      {/* Contenedor con la información debajo de la imagen */}
      <div className="flex justify-center">
        <div className="w-full md:max-w-6xl">
          <div className="mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6 mt-8">
            <h2 className="text-3xl font-semibold text-gray-900">
              1. Información que Recopilamos
            </h2>
            <p className="text-lg leading-relaxed mt-4">
              Recopilamos la siguiente información personal cuando interactúas
              con nuestro sitio web o plataforma:
            </p>
            <ul className="list-inside list-disc pl-5 mt-4">
              <li>
                <strong className="text-gray-700">
                  Información proporcionada directamente por el usuario:
                </strong>{" "}
                Nombre, correo electrónico, mensaje de contacto, etc.
              </li>
              <li>
                <strong className="text-gray-700">
                  Información recopilada automáticamente:
                </strong>{" "}
                Dirección IP, tipo de navegador, dispositivo, información de
                navegación.
              </li>
            </ul>
          </div>

          <div className="mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6 mt-8">
            <h2 className="text-3xl font-semibold text-gray-900">
              2. Cómo Usamos tu Información
            </h2>
            <p className="text-lg leading-relaxed mt-4">
              Utilizamos los datos personales recopilados para los siguientes
              fines:
            </p>
            <ul className="list-inside list-disc pl-5 mt-4">
              <li>
                Proveer nuestros servicios de manera eficiente y personalizada.
              </li>
              <li>Responder a tus consultas, solicitudes o comentarios.</li>
              <li>Mejorar la experiencia del usuario en nuestra plataforma.</li>
              <li>Enviar correos electrónicos relacionados con el servicio.</li>
              <li>Cumplir con nuestras obligaciones legales y reguladoras.</li>
            </ul>
          </div>

          <div className="mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6 mt-8">
            <h2 className="text-3xl font-semibold text-gray-900">
              3. Cómo Compartimos tu Información
            </h2>
            <p className="text-lg leading-relaxed mt-4">
              En BeanLink, no vendemos ni compartimos tu información personal
              con terceros para fines comerciales. Sin embargo, podemos
              compartir tu información con:
            </p>
            <ul className="list-inside list-disc pl-5 mt-4">
              <li>
                <strong className="text-gray-700">
                  Proveedores de servicios:
                </strong>{" "}
                Empresas que nos ayudan a operar la plataforma.
              </li>
              <li>
                <strong className="text-gray-700">Razones legales:</strong> Si
                es requerido por la ley, como en el caso de una orden judicial.
              </li>
            </ul>
          </div>

          <div className="mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6 mt-8">
            <h2 className="text-3xl font-semibold text-gray-900">
              4. Tus Derechos sobre tus Datos
            </h2>
            <p className="text-lg leading-relaxed mt-4">
              De acuerdo con la legislación aplicable, tienes derecho a:
            </p>
            <ul className="list-inside list-disc pl-5 mt-4">
              <li>
                Acceder, corregir, actualizar o eliminar tu información
                personal.
              </li>
              <li>Solicitar la restricción del uso de tus datos.</li>
              <li>
                Oponerte al procesamiento de tus datos para fines de marketing.
              </li>
            </ul>
            <p className="mt-4">
              Para ejercer tus derechos, contáctanos{" "}
              <Link to={"/"} className="font-bold text-amber-700">
                Aqui
              </Link>
              .
            </p>
          </div>

          <div className="mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6 mt-8">
            <h2 className="text-3xl font-semibold text-gray-900">
              5. Seguridad de la Información
            </h2>
            <p className="text-lg leading-relaxed mt-4">
              Tomamos medidas de seguridad razonables para proteger tus datos
              personales contra accesos no autorizados.
            </p>
          </div>

          <div className="mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6 mt-8">
            <h2 className="text-3xl font-semibold text-gray-900">
              6. Cambios en la Política de Privacidad
            </h2>
            <p className="text-lg leading-relaxed mt-4">
              Podemos modificar esta política de privacidad de vez en cuando.
              Cualquier cambio será publicado en esta página y será efectivo tan
              pronto como se haga disponible.
            </p>
          </div>

          <div className="mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6 mt-8">
            <h2 className="text-3xl font-semibold text-gray-900">
              7. Contacto
            </h2>
            <p className="text-lg leading-relaxed mt-4">
              Si tienes alguna pregunta o inquietud sobre nuestra política de
              privacidad, por favor contáctanos en:
            </p>
            <p className="mt-4">
              <Link to={"/"} className="font-bold text-amber-700">
                Aqui
              </Link>
            </p>
            <p>Equipo BeanLink</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-100">
        {/* Imagen en la parte superior con opacidad */}
        <div className="relative mt-8">
          <img
            src={terms}
            alt="Café de especialidad"
            className="w-full h-[400px] object-cover"
          />
          {/* Frase centrada sobre la imagen */}
          <div className="absolute inset-0 flex justify-center items-center">
            <h2 className="text-4xl font-semibold text-white text-center px-6">
              Términos de Uso
            </h2>
          </div>
        </div>

        {/* Contenedor con la información debajo de la imagen */}
        <div className="flex justify-center">
          <div className="w-full md:max-w-6xl">
            <div className="mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6 mt-8">
              <h2 className="text-3xl font-semibold text-gray-900">
                1. Aceptación de los Términos
              </h2>
              <p className="text-lg leading-relaxed mt-4">
                Al acceder y utilizar BeanLink, aceptas estar sujeto a estos
                Términos, así como a nuestra Política de Privacidad. Si no
                aceptas alguna de las condiciones, no debes utilizar la
                plataforma.
              </p>
            </div>

            <div className="mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6 mt-8">
              <h2 className="text-3xl font-semibold text-gray-900">
                2. Uso de la Plataforma
              </h2>
              <p className="text-lg leading-relaxed mt-4">
                Te comprometes a utilizar la plataforma de manera legal, ética y
                conforme a los principios de buena fe. No podrás usar los
                servicios para:
              </p>
              <ul className="list-inside list-disc pl-5 mt-4">
                <li>Realizar actividades ilegales o fraudulentas.</li>
                <li>
                  Interrumpir el funcionamiento del sitio o los servicios.
                </li>
                <li>Violar derechos de propiedad intelectual.</li>
              </ul>
            </div>

            <div className="mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6 mt-8">
              <h2 className="text-3xl font-semibold text-gray-900">
                3. Propiedad Intelectual
              </h2>
              <p className="text-lg leading-relaxed mt-4">
                El contenido de BeanLink, incluyendo textos, imágenes,
                logotipos, diseños y código fuente, es propiedad de BeanLink o
                de nuestros licenciantes. No se permite el uso sin autorización
                expresa.
              </p>
            </div>

            <div className="mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6 mt-8">
              <h2 className="text-3xl font-semibold text-gray-900">
                4. Limitación de Responsabilidad
              </h2>
              <p className="text-lg leading-relaxed mt-4">
                En BeanLink no nos hacemos responsables de los daños que puedan
                surgir del uso de la plataforma, incluyendo la pérdida de datos
                o ingresos.
              </p>
            </div>

            <div className="mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6 mt-8">
              <h2 className="text-3xl font-semibold text-gray-900">
                5. Modificaciones en el Servicio
              </h2>
              <p className="text-lg leading-relaxed mt-4">
                Nos reservamos el derecho de modificar o suspender el servicio
                en cualquier momento y sin previo aviso.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
