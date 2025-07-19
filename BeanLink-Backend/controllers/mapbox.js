const fetch = require("node-fetch");
const MapboxUsage = require("../models/Mapbox");

require("dotenv").config(); // cargar las variables de entorno

//Variables para conocer el limite de cada contador
const MAX_STATIC_IMAGE = 200;
const MAX_GEOCODING = 200;

const incrementCounter = async (service) => {
  try {
    if (!service) {
      console.error("Error: El servicio está vacío o es null.");
      return;
    }

    // Obtenemos la fecha actual
    const today = new Date();
    const todayDate = today.getDate();
    const currentMonth = today.getMonth(); // El mes actual (0-11)

    // Buscamos si ya existe un contador para este servicio
    const counter = await MapboxUsage.findOne({ service: service });

    if (!counter) {
      // Si el contador no existe, lo creamos
      await MapboxUsage.create({ service: service, count: 1 });
    } else {
      // Comprobamos si el contador ya fue reiniciado en el primer día del mes
      const lastUpdated = new Date(counter.lastUpdated);
      const lastUpdatedMonth = lastUpdated.getMonth();
      const lastUpdatedDate = lastUpdated.getDate();

      // Si es el primer día del mes y el contador no fue reiniciado hoy, lo reiniciamos
      if (todayDate === 1 && (lastUpdatedMonth !== currentMonth || lastUpdatedDate !== todayDate)) {
        counter.count = 0; // Reiniciamos el contador
        counter.lastUpdated = new Date(); // Actualizamos la fecha de última actualización
        await counter.save();
      }

      // Incrementamos el contador
      counter.count += 1;
      counter.lastUpdated = new Date(); // Actualizamos la fecha de última actualización
      await counter.save();
    }
  } catch (error) {
    console.error("Error al incrementar el contador:", error);
  }
};

// Función para obtener una imagen estática de Mapbox
const getStaticImage = async (req, res) => {
  try {
    //Obtenemos los datos de longitud y latitud
    const { lat, lng } = req.query;
    //Comprobamos que el contador se encuentra dentro de los limites permitidos
    const counter = await MapboxUsage.findOne({ service: "static-image" });
    //Si nos hemos pasado mandamos mensaje de error
    if (counter && counter.count >= MAX_STATIC_IMAGE) {
      return res.status(401).send({
        satus: "error",
        message: "Límite de peticiones de imagen estatica a mapbox alcanzada",
      });
    }
    // Incrementamos el contador para la imagen estática
    await incrementCounter("static-image");
    //Si todavia tenemos peticiones, solicitamos mediante URL la imagen estática
    //Definimos el estilo del mapa
    const mapbox_style = "streets-v11";
    const zoom = 15;
    const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/${mapbox_style}/static/pin-l+ff0000(${lng},${lat})/${lng},${lat},${zoom}/800x600?access_token=${process.env.MAPBOX_API_SECRET}`;
    //Devolvemos resultado
    return res.status(200).send({
      status: "success",
      message: "Dirección recibida",
      mapUrl,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No se ha podido obtener la imágen estática",
    });
  }
};

// Función para obtener la dirección mediante Geocoding
const getGeocoding = async (req, res) => {
  try {
    //Recogemos la longitud y latitud que nos llega
    const { lat, lng } = req.query;
    //Comprobamos el numero de contador que tenemos para esta peticion
    const counter = await MapboxUsage.findOne({ service: "geocoding" });
    //Si nos hemos pasado mandamos mensaje de error
    if (counter && counter.count >= MAX_GEOCODING) {
      return res.status(401).send({
        satus: "error",
        message: "Límite de peticiones de geocoding a mapbox alcanzada",
      });
    }
    // Incrementamos el contador para el geocoding
    await incrementCounter("geocoding");

    // Realizamos la solicitud a Mapbox Geocoding API
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.MAPBOX_API_SECRET}`
    );
    //Convertimos la respuesta a json para su manejo
    const data = await response.json();
    //Procesamos y devolvemos resultado
    if (data.features && data.features.length > 0) {
      return res.status(200).send({
        status: "success",
        message: "Dirección encontrada",
        geocodingUrl: data.features[0].place_name,
      });
    } else {
      return res.status(404).send({
        status: "success",
        message: "Dirección no encontrada por mapbox",
      });
    }
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: "No se ha podido obtener la direccion mediante geocoding",
    });
  }
};

module.exports = {
  getStaticImage,
  getGeocoding,
};
