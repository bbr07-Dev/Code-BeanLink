import { useState } from "react";
import avatar from "../../../../assets/img/user.png";
import { useNavigate } from "react-router-dom";
import { Global } from "../../../../helpers/Global";
import useAuth from "../../../../hooks/useAuth";

import { RiFindReplaceLine } from "react-icons/ri";


export const Search = () => {
  //Uusuario logueado
  const { auth } = useAuth();
  //Para navegar entre rutas
  const navigate = useNavigate();
  //Estado con el texto que enviamos
  const [userName, setUserName] = useState(null);
  //Estado con los usuarios encontrados
  const [usersFinded, setUsersFinded] = useState({});
  //Estado para saber si estamos siguiendo al los usuarios de la lista que buscamos
  const [whoFollowings, setWhoFollowings] = useState([]);

  //Accion para que la API nos devuelva las coincidencias de usuarios
  const searchUsers = async () => {
    try {
      const request = await fetch(Global.url + `users/search?q=${userName}`, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const data = await request.json();
      if (data.status === "success") {
        setUsersFinded(data.users);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //Funcion para hacer follow
  const follow = async (user) => {
    //Recogemos el id del usuario que queremos seguir
    const userId = user._id;
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
      if(data.follow.followed.length > 0) setWhoFollowings(data.follow.followed); //Comprobamos que hay algun seguidor, sino no hay prev
      setWhoFollowings((prev) => [...prev, data.follow.followed]);
    } catch (e) {
      console.log(e);
    }
  };

  //Función para hacer unfollow
  const unfollow = async (user) => {
    let userId = user._id;
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
      }
    } catch (e) {
      console.log(e);
    }
  };

  //Función para saber si estamos siguiendo a los usuarios
  const following = async () => {
    //Obtenemos id de usuario autenticado
    const userId = auth._id;
    //Hacemos peticion a api para que devuelva lista de seguidos
    try {
      const request = await fetch(Global.url + "followings/" + userId, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      //Pasamos a legible
      const data = await request.json();
      if (data.status !== "success") return;
      setWhoFollowings(data.users_folowing);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="w-full max-w-4xl sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-[20%] sm:mt-[20%] md:mt-[10%] lg:mt-[7%] xl:mt-[7%] 2xl:mt-[5%] p-6">
      <div className="relative items-center mb-6">
        <label
          htmlFor="user"
          className="block text-sm font-medium text-gray-900"
        >
          Usuario
        </label>
        <div className="flex gap-2 items-center mt-2">
          <input
            type="text"
            name="user"
            onChange={(e) => setUserName(e.target.value)}
            className="block w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
          <RiFindReplaceLine
            onClick={() => {
                searchUsers();
                following();
            }}
            size={20}
            className="hover:text-lime-700"
          />
        </div>
        {/* Resultados de la búsqueda */}
        {usersFinded.length > 0 && (
          <div className="mt-4 space-y-4">
            <h4 className="font-semibold text-gray-800">
              Usuarios Encontrados:
            </h4>
            {usersFinded.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 border border-gray-300 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar del usuario */}
                  <img
                    src={user.avatar ? user.avatar : avatar}
                    alt={`Avatar de ${user.username}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      navigate("/private/profile/", {
                        state: { user: user._id },
                      })
                    }
                  >
                    <p className="font-semibold text-gray-800">
                      {user.username}
                    </p>
                    <p className="text-sm text-gray-500">{user.bio}</p>
                  </div>
                </div>
                {/* Condición para mostrar el botón de "Seguir" o "Siguiendo" */}
                {whoFollowings && whoFollowings.includes(user._id) ? (
                  <button
                    onClick={() => unfollow(user)}
                    className="px-4 py-2 rounded-full bg-gray-400 text-white text-sm font-semibold"
                  >
                    Siguiendo
                  </button>
                ) : (
                  <button
                    onClick={() => follow(user)}
                    className="px-4 py-2 rounded-full bg-amber-700 border border-transparent text-sm font-semibold text-white shadow-sm hover:bg-amber-800 hover:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-800"
                  >
                    Seguir
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Mensaje cuando no se encuentra ningún usuario */}
        {usersFinded.length === 0 && userName !== "" && (
          <p className="mt-4 text-gray-500">No se encontraron usuarios.</p>
        )}
      </div>
    </div>
  );
};
