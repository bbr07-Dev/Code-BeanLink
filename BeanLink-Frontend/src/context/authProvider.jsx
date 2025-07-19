//Contexto para poder usar al usario identificado en todos los componentes
import React, { createContext, useEffect, useState } from "react";
import { Global } from "../helpers/Global";

//Creamos el contexto
const AuthContext = createContext();

//Ejecutamos el provider cada vez que le pasemos un hijo (le indicamos el componente que le estamos pasando)
export const AuthProvider = ({ children }) => {
  //Aqui queremos guardar la información del usuario identificado
  //Leemos los datos del localstorage si existen
  const [auth, setAuth] = useState(null);
  //Estado de cargando
  const [loading, setLoading] = useState(true); //Vamos a actualizar este estado cuando se haya cargado todo


  //Ejecutamos la primera vez que se renderiza el componente (cada vez que lo llamamos)
  useEffect(() => {
    authUser();
  }, [])

  //Petición para comprobar si el usuario existe el la bd
  const authUser = async () => {
    //Sacamos datos del local storage del user identificado
    const token = localStorage.getItem("token")
    const userLogged = localStorage.getItem("user")
    //Comprobamos que tenemos token y user
    if(!token || !userLogged) {
      setLoading(false);
      return false;
    }
    //Transformamos los datos a obj json
    const userObj = JSON.parse(userLogged);
    const userId = userObj.id; //Para cuando refijemos la api y pidamos id para ver el perfil
    //Peticion al backend que compruebe el token
    const request = await fetch(Global.url + "users/" + userId, {
      method: "GET",
      headers: {
        "Authorization": token
      }
    });    
    //Que nos devuelva los datos de perfil del usuario
    const data = await request.json();
    //Desde el endpoint users/me nos devuelve _id y no id, por lo que vamos a normalizarlo
    const normalizedUser = {
      ...data.user, //todo lo que tenemos en data.user 
      id: data.user._id //Pero al _id lo nombramos como id
    }
    //Setear el estado de auth con todos los datos que nos devuelve
    setAuth(normalizedUser);
    setLoading(false); //Ha terminado de cargar cuando seteamos todos los datos
  }

  //Pasamos el componente hijo que vamos a cargar, y le indicamos el valor que vamos a pasar (a compartir entre componentes)
  //El share va a estar dentro de cualquier componente hijo que tendamos dentro del provider
  return <AuthContext.Provider value={{auth, setAuth, loading}}>{children}</AuthContext.Provider>;
};

export default AuthContext;
