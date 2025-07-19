import { useEffect, useState } from "react";
import { Global } from "../../../../helpers/Global";
import useAuth from "../../../../hooks/useAuth";
import { ViewPublication } from "./ViewPublication";
import { Add } from "./Add";

//Iconos React
import { IoMdAddCircle } from "react-icons/io";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

export const Publications = ({ onUpdate, user, permited }) => {
  //Obtenemos usuario autenticado
  const { auth } = useAuth();

  //Estado con las publicaciones del usuario
  const [publications, setPublications] = useState({});
  //Estado de la publicacion que vamos a manejar
  const [publication, setPublication] = useState({});
  //Estado para abrir ventana view
  const [viewPublication, setViewPublication] = useState(false);
  //Estado para abrir la ventana Add
  const [addPublication, setAddPublication] = useState(false);
  //Estado para enviar la page a la peticion (1 por defecto)
  const [page, setPage] = useState(1);
  //Estado para manejar pagina siguiente
  const [nextPage, setNextPage] = useState(null);
  //Estado para manejar pagina anterior
  const [prevPage, setPrevPage] = useState(null);
  //Estado para manejar el numero total de paginas (por defecto 1)
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    showPublications();
  }, [viewPublication, addPublication, page]);

  //Función para sacar todas las publicaciones del usuario logueado al perfil
  const showPublications = async () => {
    try {
      const request = await fetch(Global.url + `posts/${user._id}/${page}`, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      //Pasamos a legible
      const data = await request.json();
      if (data.status === "success") {
        setPublications(data.publications);
        if (data.hasNextPage) setNextPage(data.hasNextPage);
        if (data.hasPrevPage) setPrevPage(data.hasPrevPage);
        if (data.pages) setTotalPages(data.pages);
      }
    } catch (e) {
      console.log(e);
      setPublication({});
    }
  };

  return (
    <div className="relative max-w-4xl xl:max-w-4xl md:max-w-2xl sm:max-w-xs mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-6 p-6">
      {/* Lista de publicaciones */}
      <div className="mt-6 grid grid-cols-2 xl:grid-cols-3 gap-4 md:grid-cols-2 cursor-pointer">
        {publications && publications.length > 0 ? (
          publications.map((publication, index) => (
            <div
              onClick={() => {
                setViewPublication(true);
                setPublication(publication);
              }}
              key={index}
              className={`relative rounded-lg flex flex-col items-center text-center`}
            >
              {/* Imagen */}
              <img
                className="rounded-xl object-cover w-64 h-64 md:w-64 md:h-64 hover:w-68 hover:h-68 transition-all 300ms"
                src={publication.media[0]}
                alt="Preview"
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No hay publicaciones</p>
        )}
      </div>
      {/* Botón agregar */}
      <div className="mt-8 p-1 flex justify-center hover:text-lime-700">
        {permited === true && (
          <IoMdAddCircle onClick={() => setAddPublication(true)} size={30} />
        )}
      </div>
      {/* Paginación */}
      {totalPages && totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <MdNavigateBefore
            className="text-gray-600 bg-white rounded-full p-2 hover:text-gray-800 hover:rounded-full hover:shadow-md cursor-pointer transition-all duration-200 ease-in-out"
            onClick={() => {
              if (prevPage) setPage((prev) => Math.max(prev - 1, 1));
            }}
            size={40}
          />
          <span className="text-gray-700">
            Página {page} de {totalPages}
          </span>
          <MdNavigateNext
            className="text-gray-600 bg-white rounded-full p-2 hover:text-gray-800 hover:rounded-full hover:shadow-md cursor-pointer transition-all duration-200 ease-in-out"
            size={40}
            onClick={() => {
              if (nextPage) setPage((prev) => Math.min(prev + 1, totalPages));
            }}
          />
        </div>
      )}
      {/* Modales  */}
      {viewPublication && (
        <ViewPublication
          isOpen={viewPublication}
          onClose={() => {
            setViewPublication(false);
            onUpdate();
          }}
          post={publication}
        />
      )}
      {addPublication && (
        <Add
          isOpen={addPublication}
          onClose={() => {
            setAddPublication(false);
            onUpdate();
          }}
        />
      )}
    </div>
  );
};
