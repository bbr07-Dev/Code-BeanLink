//Importamos dependencias
const jwt = require("jwt-simple");
const moment = require("moment");
//Importamos clave secreta
const libJwt = require("../services/jwt");
const key = libJwt.secretKey;
//Middleware de autenticación
exports.auth = (req, res, next) => {
    //Comprobamos si nos llega la cabecera (header) de autenticacion 
    if(!req.headers.authorization) {
        return res.status(403).send({
            status: "error",
            message: "La petición no tiene cabecera de autenticación"
        });
    }
    //Limpiamos el token
    let token = req.headers.authorization.replace(/['"]+/g, "");
    //Decodificamos el token
    let payload = null; //Definimos payload fuera para que tenga conte4xto general
    try{
        payload = jwt.decode(token, key); //Decoddificacmos y nos devuelve el objeto completo del usuario
        //Comprobamos la expiración del token
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                status: "error",
                message: "Token expirado"
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(404).send({
            status: "error",
            message: "Token inválido",
            e,
        });
    }
    //Agregamos datos de usuario a la request
    req.user = payload;
    //Pasamos la ejecucion a la accion (ruta)
    next();
}