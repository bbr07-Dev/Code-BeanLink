import React from "react";
import { Header } from "./Header";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export const PublicLayout = () => {
  const { auth, loading } = useAuth();

  // Mientras se recuperan los datos, muestra un indicador
  if (loading) {
    return (
      <div className="flex justify-center items-center mt-4">
      <svg
        className="animate-spin h-6 w-6 text-amber-600 mr-2"
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
    );
  }

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gray-700">
        {/* Si no hay usuario autenticado, mostramos el contenido público.
            Si existe auth.id, redirigimos a la parte privada */}
        {!auth || !auth.id ? <Outlet /> : <Navigate to="/private" />}
      </section>
    </>
  );
};
