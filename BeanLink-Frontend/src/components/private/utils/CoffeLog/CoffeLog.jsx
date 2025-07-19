import { useEffect, useState } from "react";
import { Global } from "../../../../helpers/Global";
import { Add } from "./Add";
import { Update } from "./Update";
import { ViewCoffe } from "./ViewCoffe";
import { useForm } from "../../../../hooks/useForm";

//Iconos react
import { IoListCircle } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import { TiTrash, TiEdit } from "react-icons/ti";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";

export const CoffeLog = ({ user, permited }) => {
  //Estado para manejar la lista de cafes
  const [listCoffe, setListCoffe] = useState([]);
  //Estado para abrir ventana de agregar cafe
  const [addCoffe, setAddcoffe] = useState(false);
  //Estado para abrir ventana de actualizar cafe
  const [updateCoffe, setUpdateCoffe] = useState(false);
  //Estado para abrir la ventana de visualizar cafe
  const [viewCoffe, setViewCoffe] = useState(false);
  //Estado donde guardamos el cafe que le pasamos al componente update
  const [coffeToUpdate, setCoffeToUpdate] = useState({});
  //Etado para guardar el cage que queremos ver en el componente view
  const [coffeToView, setCoffeToView] = useState({});
  //Estado para saber si estamos en modo lista o modo cuadricula
  const [listGrid, setListGrid] = useState("grid");
  //Estado para enviar la page a la peticion (1 por defecto)
  const [page, setPage] = useState(1);
  //Estado para manejar pagina siguiente
  const [nextPage, setNextPage] = useState(null);
  //Estado para manejar pagina anterior
  const [prevPage, setPrevPage] = useState(null);
  //Estado para manejar el numero total de paginas (por defecto 1)
  const [totalPages, setTotalPages] = useState(1);
  //Estado para los filtros
  const [filters, setFilters] = useState({
    coffeeName: "",
    origin: "",
    varietal: "",
    process: "",
    score: "",
  });
  // Estado para saber si se a abierto algun filtro
  const [activeFilter, setActiveFilter] = useState(null);
  //Para recoger los cambios del input
  const { changed, form, setForm } = useForm();

  useEffect(() => {
    showCoffeLog();
  }, [addCoffe, updateCoffe, page]);

  //función para hacer petición a la API y mostrar la lista de cafés
  const showCoffeLog = async () => {
    try {
      //Hacemos peticion para que nos devuelva la lista
      const request = await fetch(Global.url + `coffeelog/${user.id}/${page}`, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      //Pasamos a legible la respuesta
      const data = await request.json();
      //Seteamos el estado
      if (data.status === "success") {
        setListCoffe(data.coffeLogs);
        if (data.hasNextPage) setNextPage(data.hasNextPage);
        if (data.hasPrevPage) setPrevPage(data.hasPrevPage);
        if (data.pages) setTotalPages(data.pages);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  //Función para eliminar un cafe cuando pulsamos la X
  const deleteCoffe = async (idCoffe) => {
    //Recogemos el id del cafe que queremos eliminar
    let idCoffeToDelete = idCoffe;
    //Hacemos la peticion a la API para que elimine el registro
    try {
      const request = await fetch(Global.url + "coffeelog/" + idCoffeToDelete, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      //Pasamos a respuesta a legible
      const data = await request.json();
      if (data.status === "success") showCoffeLog();
    } catch (e) {
      console.log(e);
    }
  };

  //Función para buscar para dar funcionalidad a los filtros
  const search = async () => {
    try {
      //Pasamos el contenido del form a parametros query (que es lo que espera el servidor)
      const queryParams = new URLSearchParams(form).toString();
      const request = await fetch(
        Global.url + `coffeelog/search/${user._id}?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await request.json();
      if (data.status === "success") {
        setListCoffe(data.coffeeLog.docs);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="mt-20 relative max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-6 p-6">
      {/* Botón para cambiar vista */}
      <IoListCircle
        onClick={() => setListGrid(listGrid === "grid" ? "list" : "grid")}
        title="Cambiar vista"
        className="absolute top-1 right-4 text-gray-600 bg-white rounded-full p-1 cursor-pointer shadow-md hover:text-gray-800"
        size={30}
      />
      {/* //  Sección de filtros */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex flex-col gap-4">
          {/* Filtros  */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Filtros</span>
            {/* // Mostrar los filtros activos como "chips" */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(form).map(
                ([key, value]) =>
                  value && (
                    <div
                      key={key}
                      className="flex items-center bg-lime-400 text-white rounded-full px-3 py-1 shadow-sm"
                    >
                      <span className="text-sm capitalize mr-2">
                        {key.replace(/([A-Z])/g, " $1").trim()}:
                      </span>
                      <span className="text-sm font-medium">{value}</span>
                      <TiDelete
                        onClick={() => {
                          setForm((prev) => ({ ...prev, [key]: "" }));
                          showCoffeLog(); // Vuelve a cargar los cafés sin el filtro eliminado
                        }}
                        className="hover:text-red-600"
                      />
                    </div>
                  )
              )}
            </div>
            {/* Botones de filtros como bolitas */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(filters).map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => {
                    setActiveFilter(
                      activeFilter === filterKey ? null : filterKey
                    );
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
        ${
          filters[filterKey]
            ? "bg-lime-500 text-white"
            : "bg-white text-gray-500"
        }
        border ${
          activeFilter === filterKey
            ? "border-lime-600 shadow-lg"
            : "border-gray-300"
        }
        hover:shadow-md hover:border-lime-500`}
                  title={filterKey.replace(/([A-Z])/g, " $1").trim()}
                >
                  {filterKey === "coffeeName" && "☕"}
                  {filterKey === "origin" && "🌍"}
                  {filterKey === "varietal" && "🌱"}
                  {filterKey === "process" && "⚙️"}
                  {filterKey === "score" && "⭐"}
                </button>
              ))}
            </div>
          </div>
          {/* Input valor de filtro (oculto hasta que pulsamos) */}
          <div>
            {activeFilter && (
              <div className="max-w-full bg-white p-4 rounded-lg shadow-xl border border-gray-100">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      {activeFilter.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <TiDelete
                      onClick={() => setActiveFilter(null)}
                      className="hover:text-red-600"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      name={activeFilter}
                      type="text"
                      autoFocus
                      className="w-full rounded-md bg-gray-200 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      onChange={changed}
                    />
                    <FaCheckCircle
                      onClick={search}
                      className="mr-4 hover:text-green-600"
                      size={17}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lista de cafés */}
      <div
        className={`mt-6 ${
          listGrid === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 gap-6"
            : "flex flex-col gap-4"
        } cursor-pointer`}
      >
        {listCoffe.length > 0 ? (
          listCoffe.map((coffe, index) => (
            <div
              key={index}
              onClick={() => {
                setCoffeToView(coffe);
                setViewCoffe(true);
              }}
              className={`relative bg-gray-50 rounded-lg shadow p-4 flex transition-all duration-300 hover:shadow-xl ${
                listGrid === "grid"
                  ? "flex-col items-center text-center"
                  : "flex-row items-start"
              }`}
            >
              {/* Botones eliminar y editar */}
              <div className="absolute top-1 right-4 flex gap-2">
                {permited && (
                  <>
                    <TiTrash
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCoffe(coffe.id);
                      }}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      size={20}
                    />
                    <TiEdit
                      onClick={(e) => {
                        e.stopPropagation();
                        setUpdateCoffe(true);
                        setCoffeToUpdate(coffe);
                      }}
                      className="text-amber-500 hover:text-amber-700 cursor-pointer"
                      size={20}
                    />
                  </>
                )}
              </div>

              {/* Imagen */}
              <img
                className="w-20 h-20 sm:w-20 sm:h-20 md:w-32 md:h-32 rounded-xl mt-2 object-cover"
                src={coffe.media[0]}
                alt="Preview"
              />

              {/* Nombre y detalles */}
              <div className={`${listGrid === "grid" ? "mt-2" : "ml-4"}`}>
                <h3 className="text-lg font-semibold text-gray-800">
                  {coffe.coffeeName}
                </h3>
                {listGrid === "list" && (
                  <>
                    <p className="text-gray-600">{coffe.origin}</p>
                    <p className="text-gray-500">{coffe.varietal}</p>
                    <p className="text-gray-500">{coffe.process}</p>
                    <p className="text-gray-500">{coffe.high}</p>
                    <p className="text-gray-500 font-semibold">{coffe.score}</p>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No hay registros de café.</p>
        )}
      </div>
      {/* Botón agregar */}
      <div className="mt-4 p-1 flex justify-center hover:text-lime-700">
        {permited && (
          <IoMdAddCircle onClick={() => setAddcoffe(true)} size={30} />
        )}
      </div>

      {/* Paginación */}
      {totalPages && totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <MdNavigateBefore
            className="text-gray-600 bg-white rounded-full p-2 hover:text-gray-800 hover:rounded-full hover:shadow-md cursor-pointer transition-all duration-200 ease-in-out"
            onClick={() => {
              if (prevPage) setPage((prev) => Math.max(prev - 1, 1));
            }}
            size={40}
          />
          <span className="text-gray-700">
            Página {page} de {totalPages}
          </span>
          <MdNavigateNext
            className="text-gray-600 bg-white rounded-full p-2 hover:text-gray-800 hover:rounded-full hover:shadow-md cursor-pointer transition-all duration-200 ease-in-out"
            size={40}
            onClick={() => {
              if (nextPage) setPage((prev) => Math.min(prev + 1, totalPages));
            }}
          />
        </div>
      )}

      {/* Modales */}
      {addCoffe && <Add isOpen={addCoffe} onClose={() => setAddcoffe(false)} />}
      {updateCoffe && (
        <Update
          isOpen={updateCoffe}
          onClose={() => setUpdateCoffe(false)}
          coffeToUpdate={coffeToUpdate}
        />
      )}
      {viewCoffe && (
        <ViewCoffe
          isOpen={viewCoffe}
          onClose={() => setViewCoffe(false)}
          coffeToView={coffeToView}
        />
      )}
    </div>
  );
};
