export const SerializeForm = (form) => {
  const formData = new FormData(form);
  const completeObj = {};

  for (let [name, value] of formData) {
    //Si es un campo repetido, convertimos en array
    if (completeObj.hasOwnProperty(name)) {
      if (!Array.isArray(completeObj[name])) {
        completeObj[name] = [completeObj[name]];
      }
      completeObj[name].push(value);
    } else {
      completeObj[name] = value;
    }

    //  Inicializar `openingHours` antes de usarlo (solo si no existe, si existe mantenemos valores)
    if (!completeObj.openingHours) {
      completeObj.openingHours = {};
    }

    // Manejo de `openingHours`
    if (completeObj.day && completeObj.hour) {
      const days = Array.isArray(completeObj.day)
        ? completeObj.day
        : [completeObj.day];
      const hours = Array.isArray(completeObj.hour)
        ? completeObj.hour
        : [completeObj.hour];

      days.forEach((day, index) => {
        const hour = hours[index] || "";

        if (!completeObj.openingHours[day]) {
          completeObj.openingHours[day] = hour;
        } else {
          if (!Array.isArray(completeObj.openingHours[day])) {
            completeObj.openingHours[day] = [completeObj.openingHours[day]];
          }
          completeObj.openingHours[day].push(hour);
        }
      });

      // Eliminamos `day` y `hour` después de procesarlos
      delete completeObj.day;
      delete completeObj.hour;
    }
  }

  if(completeObj.location) {
    completeObj.location = {
        type: "Point",
        coordinates: [
            completeObj.location[0],
            completeObj.location[1]
        ]
    }
  }

  return completeObj;
};
