import { useState } from "react";
//Iconos React
import { IoClose } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const ViewCoffe = ({ isOpen, onClose, coffeToView }) => {
  //Estado para conocer la posicion de la imagen que mostramos
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !coffeToView) return null;

  const {
    coffeeName,
    origin,
    varietal,
    process,
    high,
    score,
    tastingNotes,
    brewMethod,
    roaster,
    notes,
    media,
  } = coffeToView;

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + media.length) % media.length
    );
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900/30 backdrop-blur-md transition-all duration-300 z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative text-center">
        {/* Botón de Cerrar */}
        <IoClose
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-600 cursor-pointer"
          size={25}
        />
        <h2 className="mb-4 text-2xl font-bold text-gray-800">{coffeeName}</h2>
        {/* Carrusel de Imágenes */}
        <div className="relative w-full h-90 flex justify-center items-center">
          {media.length > 1 && (
            <FaChevronLeft
              className="absolute left-2 text-gray-700 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-200"
              size={30}
              onClick={handlePrev}
            />
          )}
          <img
            src={media[currentImageIndex]}
            alt={`Coffe ${coffeeName}`}
            className="w-full h-full object-cover rounded-lg shadow"
          />
          {media.length > 1 && (
            <FaChevronRight
              className="absolute right-2 text-gray-700 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-200"
              size={30}
              onClick={handleNext}
            />
          )}
        </div>

        {/* Información del Café */}
        <div className="mt-4">
          <p className="text-gray-600 text-lg">{origin}</p>
          <p className="text-gray-500">Varietal: {varietal}</p>
          <p className="text-gray-500">Proceso: {process}</p>
          <p className="text-gray-500">Altitud: {high} m</p>
          <p className="text-gray-500 font-semibold">SCA: {score}</p>
          <p className="text-gray-500">Método de preparación: {brewMethod}</p>
          <p className="text-gray-500">Tostador: {roaster}</p>
          <p className="text-gray-500">
            Notas de cata: {tastingNotes.join(", ")}
          </p>
          {notes && <p className="text-gray-500">Notas adicionales: {notes}</p>}
        </div>
      </div>
    </div>
  );
};
