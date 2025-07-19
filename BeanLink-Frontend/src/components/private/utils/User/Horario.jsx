import React, { useState, useEffect } from "react";
import useAuth from "../../../../hooks/useAuth";
import { useForm } from "../../../../hooks/useForm";

// Iconos React Icon
import { TiDelete } from "react-icons/ti";
import { IoMdAddCircle } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";

export const Horario = () => {
  // Recogemos contexto de autenticación
  const { auth } = useAuth();

  // Estados para variables que necesitamos iterar
  const [openingHours, setOpeningHours] = useState({});

  // Use form
  const { changed, form } = useForm();

  // Estado para alertas
  const [alert, setAlert] = useState({});

  // Cargamos este useEffect cuando se carga el componente
  useEffect(() => {
    // Seteamos opening hours del usuario autenticado, si lo tiene
    if (auth.openingHours) {
      setOpeningHours(auth.openingHours);
    }
  }, []);

  // Función para eliminar un item de las listas a través de los iconos
  const deleteItem = (day) => {
    setOpeningHours((prev) => {
      let newOpeningHours = { ...prev };
      delete newOpeningHours[day];
      return newOpeningHours;
    });
  };

  // Función para agregar un elemento de las listas a través de los iconos
  const addItem = () => {
    // Creamos la nueva línea de momento vacía
    setOpeningHours((prev) => {
      const newOpeningHours = {
        ...prev,
        [""]: { hour: "", isNew: true },
      };
      return newOpeningHours;
    });
  };

  // Función para setear el valor del nuevo registro
  const setItem = () => {
    let errors = {};
    // Validación básica
    if (!form.day) {
      errors.day = "Es necesario que escriba un día";
      setAlert(errors);
      return;
    }

    // En caso de que nos llegue el valor, sustituimos la clave vacía por el valor de los inputs
    setOpeningHours((prev) => {
      let newOpeningHours = { ...prev };
      delete newOpeningHours[""];
      // Agregamos nuevo valor
      newOpeningHours[form.day] = form.hour;
      return newOpeningHours;
    });
    // Limpiamos errores
    setAlert({});
  };

  return (
    <div>
      <label className="block mt-2 text-lg font-medium text-gray-900">
        Horario
      </label>
      {Object.entries(openingHours).map((data) => {
        return (
          <div
            key={data[0]}
            className="flex flex-col md:flex-row md:justify-start items-start md:items-center mt-4 p-2"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center md:space-x-4 w-full">
              <input
                name="day"
                defaultValue={data[0]}
                onChange={changed}
                className="block w-full md:w-auto font-bold rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              />
              <input
                name="hour"
                defaultValue={typeof data[1] === "object" ? "" : data[1]}
                onChange={changed}
                className="block w-full md:w-auto mt-2 md:mt-0 rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center mt-2 md:mt-0 md:ml-4">
              {data[1].isNew ? (
                <FaCheckCircle
                  className="ml-2 p-1 hover:text-green-600 cursor-pointer"
                  onClick={setItem}
                  size={23}
                />
              ) : (
                <TiDelete
                  className="ml-2 p-1 hover:text-red-600 cursor-pointer"
                  onClick={() => deleteItem(data[0])}
                  size={30}
                />
              )}
            </div>
          </div>
        );
      })}

      {alert.day && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">{alert.day}</strong>
        </div>
      )}

      <div className="mt-2 p-1 flex justify-center hover:text-lime-700">
        <IoMdAddCircle
          onClick={addItem}
          className="cursor-pointer"
          size={Object.entries(openingHours).length === 0 ? "30" : "25"}
        />
      </div>
    </div>
  );
};
