import React, { useState } from "react";

export const useValidation = () => {
  //Estado para manejar errores
  const [errors, setErrors] = useState({});

  //Validación para el formulario de registro
  const validateRegister = (form) => {
    let newErrors = {};

    //Comprobamos que existe username y que no supera los 30 caracteres
    if (!form.username) {
      newErrors.username = "Nombre de usuario obligatorio";
    } else if (
      form.username.trim().length > 30 ||
      form.username.trim().length < 3
    ) {
      newErrors.username =
        "Longitud de usuario superior a 30 caractéres o inferior a 3";
    }

    //Comprobamos que existe email y que tiene formato email
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "El correo electrónico no es válido";
    }

    //Comprobamos la password1
    if (
      !form.password ||
      !/^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*[\W_])).{8,}$/.test(form.password)
    ) {
      newErrors.password =
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un símbolo.";
    }

    //Comprobamos la password2
    if (
      !form.password2 ||
      !/^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*[\W_])).{8,}$/.test(form.password)
    ) {
      newErrors.password2 =
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un símbolo.";
    }

    //Comprobamos que password 1 y password 2 son la misma
    if (form.password !== form.password2) {
      newErrors.passwordDiferent = "Las contraseñas son diferentes";
    }

    //Comprobamos que se ha seleccionado un role
    if (!form.role) {
      newErrors.role = "Se debe seleccionar un roll";
    }

    //Seteamos el error
    setErrors(newErrors);
    //Devolvemos true si la validacion es exitosa y no hay errores
    return !Object.keys(newErrors).length > 0;
  };

  //Validacion para el formulario de login
  const validateLogin = (form) => {
    let newErrors = {};

    //Comprobamos que existe username y que no supera los 30 caracteres
    if (!form.username) {
      newErrors.username = "Nombre de usuario obligatorio";
    } else if (
      form.username.trim().length > 30 ||
      form.username.trim().length < 3
    ) {
      newErrors.username =
        "Longitud de usuario superior a 30 caractéres o inferior a 3";
    }

    //Comprobamos la password1
    if (
      !form.password ||
      !/^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*[\W_])).{8,}$/.test(form.password)
    ) {
      newErrors.password =
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un símbolo.";
    }

    //Seteamos el error
    setErrors(newErrors);
  };

  //Validación para el formulario de update, como el de registro pero sin que los campos sean obligatorios
  const validateUpdate = (form) => {
    let newErrors = {};

    //Comprobamos que existe username y que no supera los 30 caracteres
    if (
      (form.username && form.username.trim().length > 30) ||
      form.username.trim().length < 3
    ) {
      newErrors.username =
        "Longitud de usuario superior a 30 caractéres o inferior a 3";
    }

    //Comprobamos que existe email y que tiene formato email
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "El correo electrónico no es válido";
    }

    //Comprobamos la password1
    if (
      form.password &&
      !/^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*[\W_])).{8,}$/.test(form.password)
    ) {
      newErrors.password =
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un símbolo.";
    }

    //Comprobamos la password2
    if (
      form.password2 &&
      !/^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*[\W_])).{8,}$/.test(form.password)
    ) {
      newErrors.password2 =
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un símbolo.";
    }

    //Comprobamos que password 1 y password 2 son la misma
    if (form.password && form.password2) {
      if (form.password !== form.password2) {
        newErrors.passwordDiferent = "Las contraseñas son diferentes";
      }
    }
    //Seteamos el error
    setErrors(newErrors);

    //Devolvemos true si la validacion es exitosa y no hay errores
    return !Object.keys(newErrors).length > 0;
  };

  return {
    validateRegister,
    validateLogin,
    validateUpdate,
    errors,
  };
};
