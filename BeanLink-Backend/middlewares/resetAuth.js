// middlewares/resetAuth.js
const jwt = require("jwt-simple");
const moment = require("moment");
const { secretKey } = require("../services/jwt");

exports.validateResetToken = (req, res, next) => {
  const token = req.params.token || req.body.token;

  if (!token) {
    return res.status(400).json({
      status: "error",
      message: "Token no proporcionado",
    });
  }

  try {
    const payload = jwt.decode(token, secretKey);

    if (payload.exp <= moment().unix()) {
      return res.status(401).json({
        status: "error",
        message: "Token expirado",
      });
    }

    if (payload.type !== "password-reset") {
      return res.status(403).json({
        status: "error",
        message: "Tipo de token inválido",
      });
    }

    req.user = payload;
    next();

  } catch (e) {
    return res.status(401).json({
      status: "error",
      message: "Token inválido",
    });
  }
};
