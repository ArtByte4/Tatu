import { sign, verify } from "jsonwebtoken";
import { SECRET_JWT_KEY, REFRESH_JWT_KEY } from "@/config";
import { getUserByUserHandle } from "../../models/userModel.js";
import { comparePassword } from "./authService.js";
import type { Request, Response, NextFunction } from "express";

interface User {
  user_id: number;
  user_handle: string;
  first_name: string;
  last_name: string;
  role_id: number;
  birth_day: string;
  email_address: string;
  phonenumber: string;
  password_hash: string;
}


export const loginUser = async (req: Request, res: Response, _next: NextFunction)=> {
  try {
    const { user_handle, password_hash } = req.body as { user_handle?: string; password_hash?: string };

    if (!user_handle || !password_hash) {
      res.status(400).json({ message: "Usuario y contraseña requeridos" });
    }

    const user: User | undefined = await getUserByUserHandle(user_handle as string);
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    const isValidPassword = await comparePassword(password_hash as string, user.password_hash);
    if (!isValidPassword) {
      res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = sign(
      { id: user.user_id, role: user.role_id, username: user.user_handle },
      SECRET_JWT_KEY,
      { expiresIn: "1h" }
    );

    const refreshToken = sign(
      { id: user.user_id, role: user.role_id, username: user.user_handle },
      REFRESH_JWT_KEY,
      { expiresIn: "7d" }
    );

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600000,
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 604800000,
      })
      .json({
        validation: true,
        message: "Usuario autenticado",
        user: user.user_handle,
        id: user.user_id,
        role: user.role_id,
      });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

export const refreshToken = (req: Request, res: Response, _next: NextFunction): void => {
  const token = req.cookies?.refresh_token;

  if (!token) {
    res.status(401).json({ message: "Refresh token requerido" });
    return;
  }

  verify(token, REFRESH_JWT_KEY, (err: Error | null, decoded: any) => {
    if (err || !decoded || typeof decoded !== "object" || !("id" in decoded)) {
      res.status(403).json({ message: "Refresh token inválido" });
      return;
    }

    const decodedPayload = decoded as { id: number; role?: number; username?: string };
    
    // Incluir role y username en el nuevo access token si están disponibles
    const newAccessToken = sign(
      { 
        id: decodedPayload.id, 
        role: decodedPayload.role || 1, // Default a usuario si no hay role
        username: decodedPayload.username || ""
      }, 
      SECRET_JWT_KEY, 
      {
        expiresIn: "1h",
      }
    );

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.json({ message: "Access token renovado correctamente" });
  });
};

export const logOutUser = (_req: Request, res: Response, _next: NextFunction) => {
  res
    .clearCookie("access_token")
    .clearCookie("refresh_token")
    .json({ message: "Logout successful" });
};
