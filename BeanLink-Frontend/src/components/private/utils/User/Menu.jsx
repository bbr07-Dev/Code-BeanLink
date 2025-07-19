import React, { useEffect, useState } from "react";
import useAuth from "../../../../hooks/useAuth";
//React icons
import { TiDelete } from "react-icons/ti";
import { IoMdAddCircle } from "react-icons/io";

export const Menu = () => {
  //Recogemos los datos globales de autenticacion
  const { auth } = useAuth();

  //Estado con el menu recibido por la api
  const [menu, setMenu] = useState([]);

  //Cargamos el useEffect para que cuando se carga el componente recoja el menu
  useEffect(() => {
    if (auth.menu) {
      setMenu(auth.menu);
    }
  }, []);

  //Función para agregar un nuevo item al menu
  const addItem = () => {
    //Agregamos un elemento vaciío al array con el flag isnew
    setMenu((prev) => [...prev, { name: "", isNew: true }]);
  };

  //Función para eliminar un registro
  const deleteItem = (index) => {
    console.log(index);
    setMenu((prev) => {
      //Obtenemos una copia del objeto anterior
      let menuCopied = [...prev];
      //Elimimaoms el registro correspondiente al indice que nos llega
      let menuDeleted = menuCopied.filter((_, i) => i !== index);
      //Devolvemos para setear el estado
      return menuDeleted;
    });
  };

  return (
    <div>
      <label className="block mt-2 text-sm font-medium text-gray-900">
        Menú
      </label>
      {menu.map((plate, index) => {
        return (
          <div key={index} className="flex mt-2 justify-start">
            <input
              name="menu"
              defaultValue={plate.isNew ? plate.name : plate}
              className="block w-auto rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
            <div className="ml-2 p-1 border-hidden flex justify-center items-center hover:text-red-600">
              <TiDelete onClick={() => deleteItem(index)} size={20} />
            </div>
          </div>
        );
      })}
      <div className="mt-2 p-1 flex justify-center hover:text-lime-700">
        <IoMdAddCircle onClick={addItem} size={25} />
      </div>
    </div>
  );
};
