import { useEffect, useRef, useState } from "react";
import maplibre from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import useAuth from "../../../../hooks/useAuth";
import { Global } from "../../../../helpers/Global";
import { useNavigate } from "react-router-dom";

export const Map = () => {
  //Usuario autenticado
  const { auth } = useAuth();
  //Usuarios que nos devuelve la peticion y que estan en el mapa
  const [users, setUsers] = useState([]);
  //Refenciamos al mapa en el componente html que va a ir
  const mapContainerRef = useRef(null);
  //Referenciamos al componente mapa
  const mapRef = useRef(null);
  //Uso de navegacion para pasar al perfil del usuario cuando pulsamos en su nombre
  const navigate = useNavigate();

  //Cada vez que se carga el componente, si tenemos localizacion buscamos los usuarios
  useEffect(() => {
    if (auth.location) searchUsers();
  }, [auth.location]);

  const searchUsers = async () => {
    try {
      const response = await fetch(
        Global.url +
          `users/location/search?lat=${auth.location.coordinates[0]}&lng=${auth.location.coordinates[1]}`,
        {
          method: "GET",
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setUsers(data.users);
      }
    } catch (e) {
      console.log("Error obteniendo usuarios:", e);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    //Si el usuario autenticado no tiene localizacion se la pedimos
    if (!auth.location) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          auth.location = { coordinates: [longitude, latitude] };
          searchUsers();
        },
        (error) => {
          console.warn("No se pudo obtener la ubicación del navegador:", error);
          auth.location = { coordinates: [-6.5918, 42.5464] };
          searchUsers();
        }
      );
    }

    if (!auth.location || !auth.location.coordinates) return;

    const map = new maplibre.Map({
      container: mapContainerRef.current,
      style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
      center: [auth.location.coordinates[0], auth.location.coordinates[1]],
      zoom: 15,
      pitch: 60,
      bearing: -15,
      antialias: true,
    });

    mapRef.current = map;

    new maplibre.Marker({ color: "red" })
      .setLngLat([auth.location.coordinates[0], auth.location.coordinates[1]])
      .setPopup(
        new maplibre.Popup().setHTML(`
          <p><strong>Tu estas aquí </strong> ${auth.username}</p>
        `)
      )
      .addTo(map);

    return () => map.remove();
  }, [auth.location]);

  useEffect(() => {
    if (!mapRef.current || users.length === 0) return;

    users.forEach((user) => {
      if (user.location && user.location.coordinates) {
        const popupContent = document.createElement("div");

        // Crear el enlace al perfil
        const userLink = document.createElement("span");
        userLink.innerText = `${user.username}`;
        userLink.style.color = "#d97706";
        userLink.style.cursor = "pointer";

        // Al hacer clic, navegamos al perfil igual que en el Feed
        userLink.onclick = () =>
          navigate("/private/profile/", { state: { user: user._id } });

        popupContent.appendChild(userLink);

        // Creamos el marcador en el mapa
        new maplibre.Marker({ color: "blue" })
          .setLngLat([
            user.location.coordinates[0],
            user.location.coordinates[1],
          ])
          .setPopup(new maplibre.Popup().setDOMContent(popupContent))
          .addTo(mapRef.current);
      }
    });
  }, [users, navigate]);

  return (
    <div className="w-full h-screen overflow-hidden">
      <div ref={mapContainerRef} className="w-[100vw] h-[100vh] mt-[2%]" />
    </div>
  );
};
