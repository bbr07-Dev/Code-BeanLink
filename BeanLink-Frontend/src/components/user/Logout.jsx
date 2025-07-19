import React, { useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom';

export const Logout = () => {

    const {setAuth} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        //Vaciamos local storage
        localStorage.clear();
        //Seteamos estados globales a vacios
        setAuth({});
        //Hacemos una redirección al login o pagina principal publica
        navigate("/login")
    });

  return (
    
    <h1>Cerrando sesión...</h1>

  )
}
