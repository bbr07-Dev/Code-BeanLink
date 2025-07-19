import { useState } from "react";
//Iconos React
import {
  FaCertificate,
  FaClock,
  FaMapMarkerAlt,
  FaUtensils,
  FaMap
} from "react-icons/fa";
import { GiCoffeeBeans } from "react-icons/gi";
import { ViewLocation } from "../Map/ViewLocation";

const AccordionItem = ({ title, icon, children }) => {
  //Estado para saber si esta abierto el desplegable
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="flex items-center justify-between w-full p-4 text-left font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </div>
        <span className="text-gray-600">{isOpen ? "▲" : "▼"}</span>
      </button>

      <div
        className={`overflow-hidden transition-max-height duration-300 ${
          isOpen ? "max-h-96 p-4" : "max-h-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export const Details = ({ user }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6">
      {/* Certificaciones */}
      {user.certifications?.length > 0 && (
        <AccordionItem
          title="Certificaciones"
          icon={<FaCertificate className="text-amber-600" />}
        >
          <ul className="list-disc pl-6 text-gray-700">
            {user.certifications.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </AccordionItem>
      )}

      {/* Variedades de café */}
      {user.coffeeVarieties?.length > 0 && (
        <AccordionItem
          title="Variedades de Café"
          icon={<GiCoffeeBeans className="text-amber-600" />}
        >
          <ul className="list-disc pl-6 text-gray-700">
            {user.coffeeVarieties.map((variety, index) => (
              <li key={index}>{variety}</li>
            ))}
          </ul>
        </AccordionItem>
      )}

      {/* Menú */}
      {user.menu?.length > 0 && (
        <AccordionItem
          title="Menú"
          icon={<FaUtensils className="text-amber-600" />}
        >
          <ul className="list-disc pl-6 text-gray-700">
            {user.menu.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </AccordionItem>
      )}

      {/* Orígenes */}
      {user.origin?.length > 0 && (
        <AccordionItem
          title="Orígenes"
          icon={<FaMapMarkerAlt className="text-amber-600" />}
        >
          <ul className="list-disc pl-6 text-gray-700">
            {user.origin.map((place, index) => (
              <li key={index}>{place}</li>
            ))}
          </ul>
        </AccordionItem>
      )}

      {/* Horario de apertura */}
      {user.openingHours && (
        <AccordionItem
          title="Horario"
          icon={<FaClock className="text-amber-600" />}
        >
          <ul className="text-gray-700">
            {Object.entries(user.openingHours).map(([day, hours]) => (
              <li key={day} className="mb-1">
                <strong>{day}:</strong> {hours}
              </li>
            ))}
          </ul>
        </AccordionItem>
      )}
      {/* Localizacion  */}
      {user.location && (
        <AccordionItem
          title="Ubicación"
          icon={<FaMap className="text-amber-600" />}
        >
          <ViewLocation coordinates={user.location.coordinates} />
        </AccordionItem>
      )}
    </div>
  );
};
