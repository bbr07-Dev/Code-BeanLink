import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helpers/Global";
import avatar from "../../assets/img/user.png";
import { useNavigate } from "react-router-dom";
//Iconos react
import { RiCloseCircleFill } from "react-icons/ri";

export const Following = ({
  isOpen,
  onClose,
  setFollowings,
  user,
  permited,
}) => {
  //Sacamos datos de usuario autenticado
  const { auth } = useAuth();
  //Lista de personas que estamos siguiendo
  const [listFollowings, setListFollowings] = useState({});
  //Estado para saber si nos sigue a la persona que seguimos
  const [whoFollowings, setWhoFollowings] = useState([]);
  //Para navegar al perfil de usuario cuando pinchamos en su nombre
  const navigate = useNavigate();

  useEffect(() => {
    following();
  }, [auth]);

  const following = async () => {
    //Obtenemos id de usuario autenticado
    const userId = auth._id;
    //Obtenemos el id del usuario enviado por prop
    const userIdToShow = user._id;
    if (!userId || !userIdToShow) return;
    //Hacemos peticion a api para que devuelva lista de seguidos
    try {
      const request = await fetch(Global.url + "followings/" + userIdToShow, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      //Pasamos a legible
      const data = await request.json();
      if (data.status !== "success") return;
      setWhoFollowings(data.users_folowing);
      setListFollowings(data.follows);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  //Funcion para hacer follow
  const follow = async (user) => {
    //Recogemos el id del usuario que queremos seguir
    const userId = user;
    //Hacemos petición de follow a la api
    try {
      const request = await fetch(Global.url + "follow", {
        method: "POST",
        body: JSON.stringify({ followed: userId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
      const data = await request.json();
      //Agregamos al estado (a lo que ya tiene) el nuevo id
      setWhoFollowings((prev) => [...prev, data.follow.followed]);
      //Decrementamos el numero de seguidores
      setFollowings((prev) => parseInt(prev) + 1);
    } catch (e) {
      console.log(e);
    }
  };

  //Función para hacer unfollow
  const unfollow = async (user) => {
    let userId = user;
    //Obtenemos el id del usuario que queremos dejar de seguir
    try {
      const request = await fetch(Global.url + "/unfollow/" + userId, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const data = await request.json();
      if (data.status !== "success") return;
      //Si el usuario que dejamos de seguir, lo tenemos guardado en el estado, lo eliimnamos
      if (whoFollowings.includes(data.followed)) {
        //Encontramos el indice del usuario a eliminar
        const index = whoFollowings.indexOf(data.followed);
        if (index === -1) return;
        //Creamos una nueva copia del array excluyendo ese indice
        const updatedWhoFollowings = [...whoFollowings];
        updatedWhoFollowings.splice(index, 1);
        //Actualizamos el estado
        setWhoFollowings(updatedWhoFollowings);
        //Decrementamos el numero de seguidores
        setFollowings((prev) => prev - 1);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900/30 backdrop-blur-md transition-all duration-300 z-50 overflow-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-full w-[90%] sm:w-[60%] md:w-[40%] lg:w-[30%] xl:w-[20%]">
          <RiCloseCircleFill
            size={30}
            className="absolute top-2 right-2 text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={onClose}
          />
          <h2 className="text-lg font-semibold mb-4">Personas que sigues</h2>
          {/* Mostrar los usuarios que se siguen */}
          {listFollowings.length > 0 ? (
            <div className="p-4 max-h-80 overflow-auto">
              {listFollowings.map((followed, index) => (
                <div key={index} className="flex items-center space-x-3 mb-4">
                  <img
                    src={
                      followed.followed.avatar
                        ? followed.followed.avatar
                        : avatar
                    }
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3
                      onClick={() => {
                        navigate("/private/profile/", {
                          state: { user: followed.followed._id },
                        });
                        onClose();
                      }}
                      className="font-semibold cursor-pointer"
                    >
                      {followed.followed.username}
                    </h3>
                  </div>
                  {/* Boton seguir o dejar de seguir  */}
                  {permited &&
                    whoFollowings.includes(followed.followed._id) && (
                      <div className="ml-10 flex justify-center">
                        <button
                          onClick={() => unfollow(followed.followed._id)}
                          type="submit"
                          className="flex justify-center rounded-full bg-amber-700 border border-transparent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-800 hover:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-800"
                        >
                          Siguiendo
                        </button>
                      </div>
                    )}
                  {permited &&
                    !whoFollowings.includes(followed.followed._id) && (
                      <div className="ml-10 flex justify-center">
                        <button
                          onClick={() => follow(followed.followed._id)}
                          type="submit"
                          className="flex justify-center rounded-full bg-amber-700 border border-transparent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-800 hover:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-800"
                        >
                          Seguir
                        </button>
                      </div>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No sigues a nadie aún.</p>
          )}
        </div>
        <div></div>
      </div>
    )
  );
};
