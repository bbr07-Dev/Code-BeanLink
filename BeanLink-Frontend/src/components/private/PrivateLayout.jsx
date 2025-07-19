import React from "react";
import { Header } from "./Header";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export const PrivateLayout = () => {
  const { auth, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-700">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <svg
            className="animate-spin h-6 w-6 text-amber-600 mb-2"
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
          <p className="text-amber-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header/>
      <section className="min-h-screen bg-gray-700 p-1">
        {/* Si el usuario está autenticado (auth.id existe), mostramos el contenido privado.
            De lo contrario, redirigimos a la parte pública */}
        {auth && auth.id ? <Outlet /> : <Navigate to="/" />}
      </section>
    </>
  );
};
