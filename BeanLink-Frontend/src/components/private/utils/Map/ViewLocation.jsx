import { useEffect, useState } from "react";
import { Global } from "../../../../helpers/Global";
//Iconos de react
import { GoAlert } from "react-icons/go";


export const ViewLocation = ({ coordinates }) => {

  //No mostramos nada si no nos llegan coordenadas (aunque ya no debería entrar)
  if (!coordinates) return null;

  //Obtenemos la longitud y latitud que nos llega
  const lat = coordinates[1];
  const lng = coordinates[0];

  //Estado para la imagen estática
  const [mapUrl, setMapUrl] = useState(null);
  //Estado para el manejo de la direccion
  const [address, setAddress] = useState(null);
  //Estado para errores (Serivio no disponible generalmente)
  const [error, setError] = useState(null);

  //Cargamos la imagen estática cuando entramos en el componente
  useEffect(() => {
    //Obtenemos la imagen estática del mapa de las coordenadas que nos llegan
    getStaticImage();
    //Obtenemos la dirección de las coordenadas que nos llegan
    getGeolicationAddress();
  }, [])

  //Función para obtener la imagen estática con las coordenadas que tenemos
  const getStaticImage = async () => {
    try {
      //Hacemos peticion a nuestra api para que devuelva la imagen, no directamente a mapbox
      const request = await fetch(Global.url + `mapbox/static-image?lat=${lat}&lng=${lng}`, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token")
        },
      });
      //Pasamos respuesta a legible (json)
      const data = await request.json();
      if(data.status === "success") {
        setMapUrl(data.mapUrl);
      } else {
        setError("Servicio no disponible");
        setMapUrl("No se ha podido obtener la imagen");
      }
    } catch (e) {
      console.error("No se ha podido obtener la imagen estatica del mapa: ", e); 
    }
  }

  //Función para obtener la direccion de las coordenadas y poder mostrarlo tambien
  const getGeolicationAddress = async () => {
    try {
      //Hacemos petición a nuestra api para tener el contador
      const request = await fetch(Global.url + `mapbox/geocode?lat=${lat}&lng=${lng}`, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token")
        },
      });
      //Pasamos respuesta a legible (json)
      const data = await request.json();
      if(data.status === "success") {
        setAddress(data.geocodingUrl);
      } else {
        setAddress("No se ha encontrado la dirección");
      }
    } catch (e) {
      setAddress("No se ha encontrado la dirección");
    }
  }

  return (
    <div className="w-full flex flex-col justify-center items-center space-y-2">
      {address && (
        <div className="bg-white p-2 rounded-lg shadow-md text-gray-800 text-center">
          <p className="font-semibold">{address}</p>
        </div>
      )}
      {error ? (
        <div className="bg-amber-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <GoAlert className="w-5 h-5" />
          <p className="font-semibold text-black">Servicio no disponible</p>
        </div>
      ) : (
        <img src={mapUrl} alt="Mapa estático" className="rounded-lg shadow-md" />
      )}
    </div>
  );
};
