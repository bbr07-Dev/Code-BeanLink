import { useEffect, useState } from "react";
import ReactTimeAgo from "react-time-ago";
import useAuth from "../../../../../hooks/useAuth";
import { Global } from "../../../../../helpers/Global";

//Iconos react
import { IoMdAddCircle } from "react-icons/io";
import { TiTrash, TiEdit } from "react-icons/ti";
import { IoMdSend } from "react-icons/io";

export const ViewComments = ({ comments, idPost }) => {
  //Obtenemos el usuario logueado
  const { auth } = useAuth();
  //Estado para guardar los comentarios
  const [coments, setComents] = useState(comments);
  //Comentario a editar o eliminar
  const [commentToUpdated, setCommentToUpdated] = useState(null);
  //Estado para almacenar el texto editado
  const [text, setText] = useState("");
  //Estado para saber si estamos creando el comentario nuevo
  const [newComment, setNewComment] = useState(false);

  //Accion para eliminar comentario mediante petición a la api
  const deleteComment = async (idcomment) => {
    try {
      const request = await fetch(
        Global.url + `posts/post/${idPost}/comment/${idcomment}`,
        {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await request.json();
      if (data.status === "success") {
        setComents(data.post.comments);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //Accion para actualizar comentario mediante petición a la api
  const updateComment = async (idcomment) => {

    const formData = new URLSearchParams();
    formData.append("text", text); 

    try {
      const request = await fetch(
        Global.url + `posts/post/${idPost}/comment/${idcomment}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await request.json();
      if (data.status === "success") {
        console.log(data);
        setComents(data.post.comments);
        setCommentToUpdated(null);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //Accion para crear un comentario
  const addComment = async () => {
    const formData = new URLSearchParams();
    formData.append("text", text); 
    try {
      const request = await fetch (Global.url + `posts/post/comment/${idPost}`, {
        method: "POST",
        body: formData,
        headers:{
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: localStorage.getItem("token"),
        }
      });
      const data = await request.json();
      if(data.status === "success") {
        setComents(data.post.comments);
        setNewComment(false);
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="mt-6">
      {/* Título de los comentarios */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Comentarios</h3>

      {/* Recorremos los comentarios y los mostramos */}
      <div className="space-y-4">
        {coments && coments.length > 0 ? (
          coments.map((comment) => (
            <div
              key={comment._id}
              className="flex items-start gap-4 border-b py-4"
            >
              {/* Avatar del usuario que hizo el comentario */}
              <img
                src={comment.user.avatar}
                alt={`Avatar de ${comment.user.username}`}
                className="w-10 h-10 rounded-full object-cover"
              />
              {commentToUpdated && commentToUpdated._id === comment._id ? (
                //Si el comentario esta en modo edición
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800">
                      {comment.user.username}
                    </h4>
                  </div>
                  <div className="flex justify-around items-center gap-2">
                    <input
                      name="text"
                      defaultValue={comment.text}
                      onChange={(e) => setText(e.target.value)}
                      className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 file:py-2 file:px-4 file:bg-amber-700 file:text-white file:rounded-md hover:border-amber-500 focus:outline-none hover:file:bg-amber-800"
                    />
                    <IoMdSend
                      onClick={() => updateComment(comment._id)}
                      className="text-blue-500 hover:text-blue-700 cursor-pointer"
                      size={25}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800">
                      {comment.user.username}
                    </h4>
                    <p className="text-sm text-gray-500">
                      <ReactTimeAgo date={comment.created_at} locale="es-ES" />
                    </p>
                  </div>
                  <p className="text-gray-700 mt-2">{comment.text}</p>
                </div>
              )}
              <div className="flex">
                {comment.user._id === auth._id && (
                  <>
                    <TiTrash
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      size={20}
                      onClick={() => deleteComment(comment._id)}
                    />
                    <TiEdit
                      onClick={() => {
                        // Si el comentario ya está siendo editado, desactivar el modo de edición
                        if (
                          commentToUpdated &&
                          commentToUpdated._id === comment._id
                        ) {
                          setCommentToUpdated(null); // Desactivamos la edición
                        } else {
                          setCommentToUpdated(comment); // Activamos la edición para este comentario
                          setText(comment.text); // Establecemos el texto para editar
                        }
                      }}
                      className="text-amber-500 hover:text-amber-700 cursor-pointer"
                      size={20}
                    />
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay comentarios aún.</p>
        )}
        {newComment && (
          <div className="flex-1">
            <div className="flex justify-around items-center gap-2">
              <input
                name="text"
                onChange={(e) => setText(e.target.value)}
                className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 file:py-2 file:px-4 file:bg-amber-700 file:text-white file:rounded-md hover:border-amber-500 focus:outline-none hover:file:bg-amber-800"
              />
              <IoMdSend
                onClick={addComment}
                className="text-blue-500 hover:text-blue-700 cursor-pointer"
                size={25}
              />
            </div>
          </div>
        )}
        <div className="flex items-center justify-center hover:text-lime-700">
          <IoMdAddCircle size={25} onClick={() => setNewComment(true)} />
        </div>
      </div>
    </div>
  );
};
