import { useEffect } from "react";
import { MapboxSearchBox } from "@mapbox/search-js-web";

export const Search = ({ setCoordinates }) => {
  
  useEffect(() => {
    // Esperamos a que el componente esté en el DOM
    const searchBox = document.querySelector("mapbox-search-box");

    if (searchBox) {
      searchBox.addEventListener("retrieve", (e) => {
        const result = e.detail;

        if (result?.features?.length > 0) {
          const { geometry } = result.features[0]; // [longitud, latitud]
          console.log("Centro:", geometry);
          setCoordinates({
            lat: geometry.coordinates[1],
            lng: geometry.coordinates[0],
          });
        }
      });
    }
  }, [setCoordinates]);


  return (
    <div className="w-full">
      <p className="mb-2 text-sm font-medium text-gray-900">Dirección:  </p>
      <mapbox-search-box
        access-token={import.meta.env.VITE_MAPBOX_API_SECRET}
        proximity="0,0"
        aria-hidden="false"
      ></mapbox-search-box>
    </div>
  );
};
