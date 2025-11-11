import { SECRET_JWT_KEY } from "../../../config.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";


export interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  // Logging para diagnóstico
  console.log("🔐 Verificando token de autenticación:", {
    path: req.path,
    method: req.method,
    hasCookies: !!req.cookies,
    cookiesKeys: req.cookies ? Object.keys(req.cookies) : [],
    hasAccessToken: !!req.cookies?.access_token,
    origin: req.headers.origin,
    referer: req.headers.referer,
  });

  const token = req.cookies?.access_token;

  if (!token) {
    console.warn("⚠️ Token no encontrado en cookies. Cookies recibidas:", req.cookies);
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, SECRET_JWT_KEY, (err: any, decoded: any) => {
    if (err) {
      console.error("❌ Error al verificar token:", err.message);
      res.sendStatus(403);
      return;
    }

    console.log("✅ Token verificado correctamente para usuario:", decoded.id);
    req.user = decoded;
    next();
  });
};