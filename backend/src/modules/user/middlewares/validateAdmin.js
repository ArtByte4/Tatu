import { SECRET_JWT_KEY, ID_ROL_ADMIN } from "../../../config.js";

import jwt from "jsonwebtoken";

export const verificarAdmin = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token)
    return res
      .status(401)
      .json({ mensaje: "Token no proporcionado", valid: false });

  jwt.verify(token, SECRET_JWT_KEY, (err, decoded) => {
    if (err)
      return res
        .status(403)
        .json({ mensaje: "Token inválido o expirado", valid: false });

    req.user = decoded;
    if (decoded.role == ID_ROL_ADMIN) {
      next();
    } else {
      return res
        .status(401)
        .json({ mensaje: "No autorizado: no es admin", valid: false });
    }
  });
};
