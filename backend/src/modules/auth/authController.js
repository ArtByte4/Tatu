import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY, REFRESH_JWT_KEY, ID_ROL_ADMIN } from "../config.js";
import { getUserByUserHandle } from "../models/userModel.js";
import { comparePassword } from "../services/authService.js";

// Login
export const loginUser = async (req, res) => {
  try {
    const { user_handle, password_hash } = req.body;
    if (!user_handle || !password_hash)
      return res
        .status(400)
        .json({ message: "Usuario y contraseña requeridos" });

    const user = await getUserByUserHandle(user_handle);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const isValidPassword = await comparePassword(
      password_hash,
      user.password_hash
    );
    if (!isValidPassword)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.user_id, role: user.role_id, username: user.user_handle },
      SECRET_JWT_KEY,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { id: user.user_id, role: user.role_id },
      REFRESH_JWT_KEY,
      { expiresIn: "7d" }
    );

    return res
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
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error });
  }
};

// Refresh token
export const refreshToken = (req, res) => {
  const token = req.cookies.refresh_token;
  if (!token)
    return res.status(401).json({ message: "Refresh token requerido" });

  jwt.verify(token, REFRESH_JWT_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Refresh token inválido" });

    const newAccessToken = jwt.sign({ id: decoded.id }, SECRET_JWT_KEY, {
      expiresIn: "1h",
    });

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.json({ message: "Access token renovado correctamente" });
  });
};

// Logout
export const logOutUser = (req, res) => {
  res
    .clearCookie("access_token")
    .clearCookie("refresh_token")
    .json({ message: "Logout successful" });
};


