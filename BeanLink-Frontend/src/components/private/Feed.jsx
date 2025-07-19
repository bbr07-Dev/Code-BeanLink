import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helpers/Global";
import avatar from "../../assets/img/user.png";
import { View } from "./utils/Recipes/View";
import ReactTimeAgo from "react-time-ago";
import { ViewPublication } from "./utils/Publication/ViewPublication";

//Iconos react
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { TfiReload } from "react-icons/tfi";
import { BsCup, BsFillCupHotFill } from "react-icons/bs";

export const Feed = ({ onUpdate }) => {
  //Usuario logueado
  const { auth } = useAuth();

  //Para navegar entre rutas
  const navigate = useNavigate();

  //Estado para las publicaciones del feed
  const [publications, setPublications] = useState({});
  //Estado para la pagina, por defecto 1
  const [page, setPage] = useState(1);
  //Estado para manejar pagina siguiente
  const [nextPage, setNextPage] = useState(null);
  //Estado para manejar pagina anterior
  const [prevPage, setPrevPage] = useState(null);
  //Estado para manejar el numero total de paginas (por defecto 1)
  const [totalPages, setTotalPages] = useState(1);
  //Esado para saber si hemos pulsado en ver receta
  const [viewRecipe, setViewRecipe] = useState(false);
  //Receta que queremos abrir
  const [recipe, setRecipe] = useState(null);
  //Estado  para saber si hemos pulsado en la publicación
  const [viewPost, setViewPost] = useState(false);
  //Estado para saber que publicación hemos clickado
  const [post, setPost] = useState(null);

  //Cuando carguemos el componente hacemos la petición para ver el feed de publicaciones
  useEffect(() => {
    showFeed();
  }, [page]);

  //Petición a la api para ver el Feed del usuario logueado
  const showFeed = async (showNews = false) => {
    try {
      if (showNews) {
        setPublications({});
        setPage(1);
      }

      const request = await fetch(Global.url + `posts/feed/${page}`, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const data = await request.json();
      if (data.status === "success") {
        setPublications(data.publications.docs);
        if (data.publications.hasNextPage)
          setNextPage(data.publications.hasNextPage);
        if (data.publications.hasPrevPage)
          setPrevPage(data.publications.hasPrevPage);
        if (data.publications.totalPages)
          setTotalPages(data.publications.totalPages);
      }
    } catch (e) {
      console.log(e);
      setPublications({});
    }
  };

  //Petición para dar Like a la publicacion (o quitarlo si ya lo tiene)
  const like = async (publi) => {
    //Recogemos el id de la publicación que vamos a editar
    const idPostToLike = publi._id;
    try {
      const request = await fetch(
        Global.url + `posts/post/like/${idPostToLike}`,
        {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await request.json();
      if (
        data.status === "success" &&
        data.message === "Like agregado a la publicación"
      ) {
        setPublications((prevPublications) =>
          prevPublications.map((p) =>
            p._id === idPostToLike ? { ...p, likes: data.post.likes } : p
          )
        );
      }
      // Caso de 'Like eliminado'
      if (data.status === "success" && data.message === "Like eliminado") {
        // Filtramos el like del usuario que quitó su like
        setPublications((prevPublications) =>
          prevPublications.map((p) =>
            p._id === idPostToLike
              ? {
                  ...p,
                  likes: p.likes.filter((like) => like !== data.userId), // Elimina el like del usuario
                }
              : p
          )
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="w-full max-w-4xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-[20%] sm:mt-[20%] md:mt-[10%] lg:mt-[7%] xl:mt-[7%] 2xl:mt-[5%] mb-10 md:mb-0">
      <div className="relative items-center mb-6">
        <div className="flex justify-center">
          <TfiReload
            className="text-gray-600 bg-white rounded-md p-2 hover:text-gray-800 hover:shadow-md cursor-pointer transition-all duration-200 ease-in-out"
            size={35}
            onClick={() => showFeed(true)}
          />
        </div>
        {publications.length > 0 ? (
          publications.map((publication, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-8 m-8 sm:m-1 flex flex-col gap-3 cursor-pointer"
            >
              {/* Usuario */}
              <div
                onClick={() =>
                  navigate("/private/profile/", {
                    state: { user: publication.user._id },
                  })
                }
                className="flex items-center gap-3 cursor-pointer"
              >
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={
                    publication.user.avatar ? publication.user.avatar : avatar
                  }
                  alt={publication.user.username}
                />
                <span className="font-semibold text-gray-800">
                  {publication.user.username}
                </span>
              </div>
              {/* Imagen */}
              <div
                className="cursor-pointer"
                onClick={() => {
                  setViewPost(true);
                  setViewRecipe(false);
                  setPost(publication);
                }}
              >
                <img
                  className="w-full rounded-lg object-cover"
                  src={publication.media[0]}
                  alt="Preview"
                />
              </div>
              {/* Descripción */}
              <p className="text-gray-700 text-sm">{publication.text}</p>
              {/* Sección de la Receta (si existe) */}
              {publication.recipe && (
                <div
                  onClick={() => {
                    setViewRecipe(true);
                    setViewPost(false);
                    setRecipe(publication.recipe);
                  }}
                  className="mt-2 mb-2 p-4 bg-gray-100 rounded-lg shadow-md cursor-pointer"
                >
                  <h3 className="text-lg font-bold text-gray-800">
                    🍽️ {publication.recipe.title}
                  </h3>
                  <p className="text-gray-600 mt-2 whitespace-pre-wrap">
                    {publication.recipe.method}
                  </p>
                </div>
              )}
              {/* Fecha y hora  */}
              <div>
                <p className="text-gray-600 mt-2 whitespace-pre-wrap">
                  <ReactTimeAgo date={publication.created_at} locale="es-ES" />
                </p>
              </div>
              {/* Estadísticas */}
              {publication.likes && (
                <BsFillCupHotFill
                  className={
                    publication.likes.includes(auth._id)
                      ? "text-red-700"
                      : "text-gray-400"
                  }
                  size={25}
                  onClick={() => {
                    like(publication);
                  }}
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No hay publicaciones</p>
        )}
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
      </div>
      {/* Modales  */}
      {viewRecipe && (
        <View
          isOpen={viewRecipe}
          onClose={() => {
            setViewRecipe(false);
            onUpdate();
          }}
          recipe={recipe}
        />
      )}
      {viewPost && (
        <ViewPublication
          isOpen={viewPost}
          onClose={() => {
            setViewPost(false);
            onUpdate();
          }}
          post={post}
        />
      )}
    </div>
  );
};
