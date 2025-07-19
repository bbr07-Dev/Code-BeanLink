import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";
import { Avatar } from "./utils/User/Avatar";
import useAuth from "../../hooks/useAuth";
import { Update } from "./Update";
import { Follows } from "../private/Follows";
import { Following } from "../private/Following";
import { CoffeLog } from "./utils/CoffeLog/CoffeLog";
import { Publications } from "./utils/Publication/Publications";
import { Recipes } from "./utils/Recipes/Recipes";
import { useLocation } from "react-router-dom";
import { Details } from "./utils/User/Details";
import { NavLink } from "react-router-dom";

//Iconos react
import { RiEditCircleFill } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import { MdOutlineFeed, MdOutlineCoffeeMaker } from "react-icons/md";
import { GiCoffeeBeans } from "react-icons/gi";

export const Profile = () => {
  //Estado para conocer usuario autenticado
  const { auth, setAuth } = useAuth();
  //Usuario recibido por parametro de URL
  const location = useLocation();
  let userToShow = location.state?.user;
  //Si no enviamos el usuario por url le asignamos el autenticado
  if (!userToShow) userToShow = auth._id;
  //Estado para devolucion de peticion
  const [user, setUser] = useState();
  //Estado para loading
  const [loading, setLoading] = useState(true);
  //Estado para following y followed
  const [follows, setFollows] = useState(0);
  const [following, setFollowing] = useState(0);
  //Estado para conocer el numero de publicaciones
  const [numberPublication, setNumberPublication] = useState(0);
  //Estado para saber si tenemos permiso de edicion de perfil (usuario logueado = que usuario qu vamos a ver)
  const [permited, setPermited] = useState(false);
  //Estados para VENTANAS EMERGENTES
  //Estado para saber si estamos editando la imagen
  const [avatarEdit, setAvatarEdit] = useState(false);
  //Estado para saber si estamos actualizando (configuracion)
  const [update, setUpdate] = useState(false);
  //Estado para abrir seguidores
  const [viewFollows, setViewFollows] = useState(false);
  //Estado para abrir seguidos
  const [viewFollowing, setViewFollowing] = useState(false);
  //Estado para cargar el coffelog cuando hacemos click en el icono correspondiente
  const [coffelogLoaded, setCoffelogLoaded] = useState(false);
  //Estado para cargar las publicaciones cuando hacemos click en el icono correspondiente (por defecto abierto)
  const [publicationLoaded, setPublicationLoaded] = useState(true);
  //Estado para cargar las recetas cuando hacemos click en el icono correspondiente
  const [recipesLoaded, setRecipesLoaded] = useState(false);
  //Forzar la actualización de las publicaciones
  const [reloadPublications, setReloadPublicatons] = useState(false);
  //Estado para saber si seguimos al usuario o no (en caso de no ser el perfil del usuario logueado)
  const [isFollowing, setIsFollowing] = useState(false);

  //Cuando carguemos el componente profile llamamos a show user
  useEffect(() => {
    showUser();
  }, []);
  //Mostramos de nuevo el usuario si hay un cambio en alguno de los parametros
  useEffect(() => {
    showUser();
  }, [auth, publicationLoaded, location.state?.user, isFollowing]);

  //Función que llama al endPoint show-user
  const showUser = async () => {
    setLoading(true);
    try {
      //Con el token hacemos la petición a la bd para que nos devuelva el perfil del usuario
      const request = await fetch(Global.url + "users/" + userToShow, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      //Pasamos a legible
      const data = await request.json();
      if (data.editionPermited === true) setPermited(true);
      else checkFollowing();
      // Hacemos petición para conocer los seguidores (del usuario que enviamos por parametros)
      const followers = await fetch(Global.url + "followers/" + userToShow, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const jsonFollows = await followers.json();
      const numberFollowers = parseInt(jsonFollows.total);
      //Seteamos estado
      setFollows(numberFollowers);
      //Hacemos petición para conocer a los que sigue (el usuario conectado)
      const following = await fetch(Global.url + "/followings/" + userToShow, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const jsonFollowing = await following.json();
      const numberFollowing = parseInt(jsonFollowing.total);
      //Seteamos el estado
      setFollowing(numberFollowing);
      //Comprobamos el numero de publicaciones que tiene el que pasamos por parametro
      const numPublication = await fetch(Global.url + "posts/" + userToShow, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const jsonNumPublication = await numPublication.json();
      const numbPublications = parseInt(jsonNumPublication.total);
      setNumberPublication(numbPublications);
      //Hemos terminado de cargar
      setLoading(false);
      setUser(data.user);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  //Función para saber si el usuario que estamos viendo lo estamos siguiendo o no
  const checkFollowing = async () => {
    try {
      if (!permited && userToShow) {
        // Hacemos petición al endpoint de followings
        const request = await fetch(Global.url + "/followings/" + auth._id, {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        const data = await request.json();

        if (data.status === "success") {
          // Comprobamos si el usuario que estamos viendo está en la lista
          const isFollowingUser = data.users_folowing.includes(userToShow);
          setIsFollowing(isFollowingUser);
        } else {
          setFollowing(false);
        }
      }
    } catch (e) {
      console.error("Error al comprobar si sigues al usuario", e);
    }
  };

  // Función para manejar el botón de seguir/dejar de seguir
  const handleFollowToggle = async () => {
    try {
      if (!isFollowing) {
        // Realizar la petición para SEGUIR al usuario
        const response = await fetch(`${Global.url}follow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ followed: user._id }), // ID del usuario que queremos seguir
        });

        const data = await response.json();

        if (data.status === "success") {
          setIsFollowing(true); // Cambiamos el estado a "Siguiendo"
        } else {
          console.error("Error al seguir al usuario: ", data.message);
        }
      } else {
        // Realizar la petición para DEJAR DE SEGUIR al usuario
        const response = await fetch(`${Global.url}unfollow/${user._id}`, {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        const data = await response.json();
        if (data.status === "success") {
          setIsFollowing(false); // Cambiamos el estado a "No siguiendo"
        } else {
          console.error("Error al dejar de seguir al usuario: ", data.message);
        }
      }
    } catch (error) {
      console.error("Error en la petición: ", error);
    }
  };

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
        <p className="text-amber-600 font-medium">Cargando..</p>
      </div>
    );
  } else {
    return (
      <div className="w-full max-w-4xl sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-[20%] sm:mt-[20%] md:mt-[10%] lg:mt-[7%] xl:mt-[7%] 2xl:mt-[5%] p-6">
        <div className="relative flex justify-around items-center mb-6">
          {/* Contenedor para imagen y botones */}
          <div className="relative flex justify-center items-center">
            <img
              className={`w-45 h-30 md:w-40 md:h-40  lg:h-40 xl:w-40 lg:h-40 border-4 rounded-full object-cover ${
                user && user.avatar ? "border-gray-300" : "border-amber-500"
              }`}
              src={user?.avatar || avatar}
              alt="Imagen"
            />

            {/* Permitimos configuracion si tenemos permisos  */}
            {permited && (
              <>
                {/* Icono de Editar en la esquina inferior derecha */}
                <RiEditCircleFill
                  title="Cambiar Avatar"
                  onClick={() => setAvatarEdit(true)}
                  size={30}
                  className="absolute bottom-1 right-4 text-gray-600 bg-white rounded-full p-1 cursor-pointer shadow-md hover:text-gray-800"
                />

                {/* Icono de Configuración en la esquina inferior izquierda */}
                <IoSettingsSharp
                  title="Configurar"
                  size={30}
                  className="absolute bottom-1 left-4 text-gray-600 bg-white rounded-full p-1 cursor-pointer shadow-md hover:text-gray-800"
                  onClick={() => setUpdate(true)}
                />
              </>
            )}
          </div>

          {/* Información del usuario */}
          <div className="flex flex-col text-center items-center p-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {user.username}
              </h2>
              <p className="mt-2 text-gray-600">{user.bio}</p>
            </div>
            {/* Si está permitido, no mostramos nada */}
            {permited ? (
              ""
            ) : (
              // Si no está permitido, comprobamos si seguimos o no al usuario para mostrar boton seguir o dejar de seguir
              <button
                type="button"
                onClick={handleFollowToggle}
                className={`text-white mt-4 ${
                  isFollowing
                    ? "bg-gray-700 hover:bg-red-600"
                    : "bg-amber-700 hover:bg-amber-800"
                } focus:ring-4 focus:outline-none font-medium rounded-full text-sm px-4 py-2`}
              >
                {isFollowing ? "Dejar de seguir" : "Seguir"}
              </button>
            )}
          </div>
        </div>
        {update && <Update isOpen={update} onClose={() => setUpdate(false)} />}
        {avatarEdit && (
          <Avatar isOpen={avatarEdit} onClose={() => setAvatarEdit(false)} />
        )}

        {/* Detalles completos */}
        <Details user={user} />

        <div className="flex flex-wrap justify-between mt-6 gap-4">
          <button className="flex-1 p-4 text-center bg-gray-50 rounded-md shadow-sm cursor-pointer hover:shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800">
              Publicaciones
            </h3>
            <p className="mt-2 text-gray-600">{numberPublication}</p>
          </button>
          <button
            className="flex-1 p-4 text-center bg-gray-50 rounded-md shadow-sm cursor-pointer hover:shadow-xl"
            onClick={follows > 0 ? () => setViewFollows(true) : undefined}
          >
            <h3 className="text-lg font-semibold text-gray-800">Seguidores</h3>
            <p className="mt-2 text-gray-600">{follows}</p>
          </button>
          {viewFollows && permited !== undefined && (
            <Follows
              isOpen={viewFollows}
              onClose={() => setViewFollows(false)}
              numberFollows={setFollowing}
              user={user}
              permited={permited}
            />
          )}
          <button
            className="flex-1 p-4 text-center bg-gray-50 rounded-md shadow-sm cursor-pointer hover:shadow-xl"
            onClick={following > 0 ? () => setViewFollowing(true) : undefined}
          >
            <h3 className="text-lg font-semibold text-gray-800">Seguidos</h3>
            <p className="mt-2 text-gray-600">{following}</p>
          </button>
          {viewFollowing && permited !== undefined && (
            <Following
              isOpen={viewFollowing}
              onClose={() => setViewFollowing(false)}
              setFollowings={setFollowing}
              user={user}
              permited={permited}
            />
          )}
        </div>
        {/* Cuadrícula de iconos */}
        <div className="mt-10 pl-6 pr-6 flex justify-between ">
          <MdOutlineFeed
            onClick={() => {
              setPublicationLoaded(true);
              setCoffelogLoaded(false);
              setRecipesLoaded(false);
            }}
            className="text-gray-600 bg-white rounded-full p-2 hover:text-gray-800 hover:rounded-full hover:shadow-md cursor-pointer transition-all duration-200 ease-in-out"
            size={40}
          />
          <GiCoffeeBeans
            onClick={() => {
              setCoffelogLoaded(true);
              setPublicationLoaded(false);
              setRecipesLoaded(false);
            }}
            className="text-gray-600 bg-white rounded-full p-2 hover:text-gray-800 hover:rounded-full hover:shadow-md cursor-pointer transition-all duration-200 ease-in-out"
            size={40}
          />
          <MdOutlineCoffeeMaker
            onClick={() => {
              setRecipesLoaded(true);
              setCoffelogLoaded(false);
              setPublicationLoaded(false);
            }}
            className="text-gray-600 bg-white rounded-full p-2 hover:text-gray-800 hover:rounded-full hover:shadow-md cursor-pointer transition-all duration-200 ease-in-out"
            size={40}
          />
        </div>
        <div className="mt-2">
          {coffelogLoaded && permited !== undefined && (
            <CoffeLog user={user} permited={permited} />
          )}
        </div>
        <div className="mt-2">
          {publicationLoaded && permited !== undefined && (
            <Publications
              onUpdate={() => {
                setReloadPublicatons((prev) => !prev);
                setNumberPublication(() => showUser());
              }}
              user={user}
              permited={permited}
            />
          )}
        </div>
        <div className="mt-2">
          {recipesLoaded && permited !== undefined && (
            <Recipes user={user} permited={permited} />
          )}
        </div>
      </div>
    );
  }
};
