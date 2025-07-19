import React, { useState } from 'react'

//Recibimos un objeto al inicio vaciío que va cambiando segun nos va llegando la info del formulario
export const useForm = (initialObj = {}) => {

    //Estado que vamos a rellenar cuando vaya cambiando info del formulario
    const [ form, setForm ] = useState(initialObj);

    //Desestrcturamos e (e.target) y sacamos target
    const changed = ({target}) => {
        //Obtenemos el nombre y el valor
        const { name, value } = target;
        //Seteamos el valor de formulario
        setForm({
            ...form, //Todo lo que ya hay en el form
            [name]: value //Clave del target name y sacamos el valor como valor
        });
    }

  return {
    form,
    changed,
    setForm
  };
}
