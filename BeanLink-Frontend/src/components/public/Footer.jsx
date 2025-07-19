import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-800 w-full h-max-full text-white py-8 mt-1 md:mt-6 mb-6 md:mb-0 overflow-auto">
      <div className="w-full md:max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row text-center justify-around gap-4">

          {/* Sección de información */}
          <div>
            <h3 className="font-semibold text-xl mb-4">Información</h3>
            <ul>
              <li>
                <Link to="/privacity-policy" className="text-gray-400 hover:text-white">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/privacity-policy" className="text-gray-400 hover:text-white">
                  Términos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección de contacto */}
          <div>
            <h3 className="font-semibold text-xl mb-4">Contacto</h3>
            <ul>
              <li className="text-gray-400">Email: support@beanlink.es</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400">
          <p>&copy; 2025. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
