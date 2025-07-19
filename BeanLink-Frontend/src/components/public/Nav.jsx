import React from "react";
import { IoMdHome } from "react-icons/io";
import { Link } from "react-router-dom";

export const Nav = () => {
  return (
    <>
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4">
          {/* Logo */}
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            BeanLink
          </span>

          {/* Botón de inicio de sesión */}
          <div className="flex items-center gap-2 w-fit md:order-2">
            <a
              href="/login"
              className="flex w-full justify-center rounded-full bg-amber-700 border border-transparent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-800 hover:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-800"
            >
              Acceder
            </a>
          </div>

          {/* Menú de navegación - Visible solo en pantallas grandes */}
          <div className="hidden md:flex md:items-center">
            <ul className="flex space-x-8 font-medium">
              <li>
                <Link
                  title="Home"
                  to="/"
                  className="text-gray-900 dark:text-white hover:text-lime-700 dark:hover:text-lime-500"
                >
                  <IoMdHome size={20} />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Espacio para que no se superponga el nav con el contenido en pantallas pequeñas */}
      <div className="h-[50px]"></div>

      {/* Menú inferior - Solo visible en móviles */}
      <div className="fixed bottom-0 w-full left-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-600 flex justify-around py-3 md:hidden">
        <Link
          title="Home"
          to="/"
          className="text-gray-900 dark:text-white hover:text-lime-700 dark:hover:text-lime-500"
        >
          <IoMdHome size={20} />
        </Link>
      </div>
    </>
  );
};
