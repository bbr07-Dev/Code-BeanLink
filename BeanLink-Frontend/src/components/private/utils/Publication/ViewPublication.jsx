import { useEffect, useState } from "react";
import { Global } from "../../../../helpers/Global";
import { Update } from "./Update";
import ReactTimeAgo from "react-time-ago";
import { View } from "../Recipes/View";
import { ViewComments } from "./Comments/ViewComments";
import useAuth from "../../../../hooks/useAuth";

//Iconos react
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { TiTrash, TiEdit, TiTimes } from "react-icons/ti";
import { BsFillCupHotFill } from "react-icons/bs";

export const ViewPublication = ({ isOpen, onClose, post }) => {
  //Usuario logueado
  const { auth } = useAuth();
  //Estado para manejar la publicacion que nos llega
  const [publication, setPublication] = useState(post);
  //Estado para conocer la posicion de la imagen que mostramos
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  //Estado para saber si estamos actualizando el post
  const [updatePost, setUpdatePost] = useState(false);
  //Estado para saber si estamos viendo la receta vinculada si la tiene
  const [viewRecipe, setViewRecipe] = useState(false);

  //Funciones siguente y anterior para el carrusel
  const handleNext = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % publication.media.length
    );
  };
  const handlePrev = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + publication.media.length) % publication.media.length
    );
  };

  //Accion para eliminar una publicación cuando pulsamos la papelera
  const deletePost = async (post) => {
    //Recogemos el id que es lo que tenemos que enviar a la api
    const idPost = post._id;
    try {
      const request = await fetch(Global.url + "posts/post/" + idPost, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      //Pasamos a legible
      const data = await request.json();
      if (data.status === "success") {
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (e) {}
  };

  //Accion para actualizar la publicación cuando el componente Update nos devuelve el cambio
  const updatePublication = (updatePost) => {
    setPublication(updatePost);
  };

  //Petición para dar Like a la publicacion (o quitarlo si ya lo tiene)
  const like = async (publi) => {
    //Recogemos el id de la publicación que vamos a editar
    const idPostToLike = publi._id;
    // Actualización optimista del estado: actualizamos el estado de la publicación local

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
      // Solo corregimos si la respuesta no es la esperada
      if (data.status === "success") {
        // Si el mensaje es "Like agregado" o "Like eliminado", actualizamos según corresponda
        setPublication((prevPublication) => ({
          ...prevPublication,
          likes: prevPublication.likes.includes(auth._id)
            ? prevPublication.likes.filter((like) => like !== auth._id) // Eliminar el like
            : [...prevPublication.likes, auth._id], // Agregar el like
        }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/30 backdrop-blur-md transition-all duration-300 z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-xl w-full sm:w-[75%] h-[90vh] flex flex-col sm:flex-row relative">
        {/* Sección de la imagen (lado izquierdo en pantallas grandes, todo el ancho en móviles) */}
        <div className="relative flex-1 flex justify-center items-center bg-black">
          {publication.media.length > 1 && (
            <FaChevronLeft
              className="absolute left-4 text-white bg-gray-700 p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-600"
              size={40}
              onClick={handlePrev}
            />
          )}
          <img
            src={publication.media[currentImageIndex]}
            alt={`Coffe ${publication.user}`}
            className="max-h-full max-w-full object-cover"
          />
          {publication.media.length > 1 && (
            <FaChevronRight
              className="absolute right-4 text-white bg-gray-700 p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-600"
              size={40}
              onClick={handleNext}
            />
          )}
        </div>

        <div className="w-full sm:w-[35%] bg-white p-6 flex flex-col justify-between sm:mt-0 mt-4">
          {/* Sección de detalles (lado derecho en pantallas grandes, debajo de la imagen en móviles) */}
          <div className="bg-white flex flex-col justify-between">
            {/* Botones eliminar y editar */}
            <div className="absolute top-1 right-4 flex gap-2 items-center">
              {auth._id === post.user._id && (
                <TiTrash
                  onClick={() => deletePost(publication)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  size={20}
                />
              )}
              {auth._id === post.user._id && (
              <TiEdit
                onClick={() => {
                  setUpdatePost(true);
                  setViewRecipe(false);
                }}
                className="text-amber-500 hover:text-amber-700 cursor-pointer"
                size={20}
              />
              )}
              {/* Botón de Cerrar */}
              <TiTimes
                onClick={onClose}
                className="text-gray-600 hover:text-red-600 cursor-pointer"
                size={25}
              />
            </div>
            {/* Información de la Publicación */}
            <div>
              <div className="flex gap-4 items-center mb-2">
                <img
                  src={publication.user.avatar}
                  alt={`Avatar de ${publication.user.username}`}
                  className="border rounded-full w-10 h-10 object-cover"
                />
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {publication.user.username}
                </h2>
              </div>
              <hr />
              <p className="text-gray-600 mt-2">{publication.text}</p>
              {/* Sección de la Receta (si existe) */}
              {publication.recipe && (
                <div
                  onClick={() => {
                    setViewRecipe(true);
                    setUpdatePost(false);
                  }}
                  className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md cursor-pointer"
                >
                  <h3 className="text-lg font-bold text-gray-800">
                    🍽️ {publication.recipe.title}
                  </h3>
                  <p className="text-gray-600 mt-2 whitespace-pre-wrap">
                    {publication.recipe.method}
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* Estadísticas */}
          <div className="overflow-auto max-h-[90%] mt-4">
            {/* Comentarios  */}
            <div className="space-y-4">
              <ViewComments
                comments={publication.comments}
                idPost={publication._id}
              />
            </div>
          </div>
          <div>
            {/* Likes  */}
            {publication.likes && (
              <div className="flex items-center gap-2 cursor-pointer">
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
                <p>{publication.likes.length}</p>
              </div>
            )}
            {/* Fecha  */}
            <p className="text-gray-400 mt-4">
              <ReactTimeAgo date={publication.created_at} locale="es-ES" />
            </p>
          </div>
        </div>
        {updatePost && (
          <Update
            isOpen={updatePost}
            onClose={() => setUpdatePost(false)}
            post={publication}
            onUpdate={updatePublication}
          />
        )}
        {viewRecipe && (
          <View
            isOpen={viewRecipe}
            onClose={() => setViewRecipe(false)}
            recipe={publication.recipe}
          />
        )}
      </div>
    </div>
  );
};
