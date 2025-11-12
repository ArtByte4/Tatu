import { SECRET_JWT_KEY, ID_ROL_ADMIN } from "../../../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Extiende la Request para incluir el user
interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

// Middleware para verificar si es admin
export const verificarAdmin = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies?.access_token;

  if (!token) {
    res.status(401).json({ mensaje: "Token no proporcionado", valid: false });
    return;
  }

  jwt.verify(token, SECRET_JWT_KEY, (err: any, decoded: any) => {
    if (err || !decoded) {
      res.status(403).json({ mensaje: "Token inválido o expirado", valid: false });
      return;
    }

    req.user = decoded;

    // Asegura que decoded sea JwtPayload antes de acceder a decoded.role
    const payload = decoded as JwtPayload;

    // Comparar role como número
    const userRole = Number(payload.role);
    const adminRole = Number(ID_ROL_ADMIN);

    if (userRole === adminRole) {
      // Logging de acción de admin (sin información sensible)
      console.log(`[ADMIN ACTION] User ID: ${payload.id} - Path: ${req.path} - Method: ${req.method}`);
      next();
    } else {
      res.status(403).json({ mensaje: "No autorizado: no es admin", valid: false });
    }
  });
};
