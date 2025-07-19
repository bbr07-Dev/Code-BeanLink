import React from "react";
import avatar from "../../assets/img/user.png";
import useAuth from "../../hooks/useAuth";
import { NavLink } from "react-router-dom";
// Iconos
import { IoMdHome } from "react-icons/io";
import { FaUser, FaMap } from "react-icons/fa";
import { RiFindReplaceLine } from "react-icons/ri";

export const Nav = () => {
  const { auth } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      {/* Contenedor principal */}
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        {/* Nombre del sitio */}
        <span className="text-2xl font-semibold whitespace-nowrap dark:text-white">
          BeanLink
        </span>

        {/* Menú de navegación - Se oculta en móvil */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          <NavLink
            title="Feed"
            to="/private/feed"
            className="text-gray-900 hover:text-lime-700 dark:text-white dark:hover:text-lime-500"
          >
            <IoMdHome size={20} />
          </NavLink>
          <NavLink
            title="Map"
            to="/private/map"
            className="text-gray-900 hover:text-lime-700 dark:text-white dark:hover:text-lime-500"
          >
            <FaMap size={20} />
          </NavLink>
          <NavLink
            title="Search"
            to="/private/Search"
            className="text-gray-900 hover:text-lime-700 dark:text-white dark:hover:text-lime-500"
          >
            <RiFindReplaceLine size={20} />
          </NavLink>
          <NavLink
            title="Perfil"
            to="/private/profile"
            state={{ user: auth._id }}
            className="text-gray-900 hover:text-lime-700 dark:text-white dark:hover:text-lime-500"
          >
            <FaUser size={20} />
          </NavLink>
        </div>

        {/* Botón de logout y avatar */}
        <div className="flex items-center gap-2">
          <NavLink
            to="/private/logout"
            type="button"
            className="text-white bg-amber-700 hover:bg-amber-800 focus:ring-4 focus:outline-none font-medium rounded-full text-sm px-4 py-2 dark:bg-amber-700 dark:hover:bg-amber-600"
          >
            Salir
          </NavLink>
          <img
            className="border rounded-full w-10 h-10 object-cover"
            src={auth && auth.avatar ? auth.avatar : avatar}
            alt="Avatar"
          />
        </div>
      </div>

      {/* Menú de navegación fijo en la parte inferior en móviles */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-600 p-3 flex justify-around md:hidden">
        <NavLink
          title="Feed"
          to="/private/feed"
          className="text-gray-900 dark:text-white"
        >
          <IoMdHome size={20} />
        </NavLink>
        <NavLink
          title="Search"
          to="/private/search"
          className="text-gray-900 dark:text-white"
        >
          <RiFindReplaceLine size={20} />
        </NavLink>
        <NavLink
          title="Map"
          to="/private/map"
          className="text-gray-900 dark:text-white"
        >
          <FaMap size={20} />
        </NavLink>
        <NavLink
          title="Perfil"
          to="/private/profile"
          state={{ user: auth._id }}
          className="text-gray-900 dark:text-white"
        >
          <FaUser size={20} />
        </NavLink>
      </div>
    </nav>
  );
};
