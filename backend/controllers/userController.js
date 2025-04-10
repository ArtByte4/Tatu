import { SECRET_JWT_KEY, REFRESH_JWT_KEY } from "../config.js";
import { getUsers, getUserByUserHandle, addUser } from "../models/userModel.js";
import { encryptPassword, comparePassword } from "../services/authService.js";
import jwt from "jsonwebtoken";

// ==========================================
// Funcion para traer todos los usuarios
// ==========================================
export const getAllUsers = async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuarios", err});
  }
};


// ==================================================
// Funcion para traer un usuario segun el user_handle
// ==================================================
export const getOneUser = async (req, res) => {
  const userHandle = req.params.user_handle;
  try {
    const user = await getUserByUserHandle(userHandle);
    res.json(user);
  } catch (err) {
    console.log("Error al obtener usuario", err);
  }
};


// ==========================================
// Funcion para registrar un usuario nuevo
// ==========================================
export const createUser = async (req, res) => {
  try {
    const {
      user_handle,
      email_address,
      first_name,
      last_name,
      phonenumber,
      password_hash,
      birth_day,
    } = req.body;

    if (
      !user_handle ||
      !email_address ||
      !first_name ||
      !last_name ||
      !phonenumber ||
      !password_hash ||
      !birth_day
    ) {
      return res
        .status(400)
        .json({ message: "Todos los campos son necesarios" });
    }

    const role_id = 1;

    const hashedPassword = await encryptPassword(password_hash);

    const result = await addUser({
      user_handle,
      email_address,
      first_name,
      last_name,
      phonenumber,
      role_id,
      password_hash: hashedPassword,
      birth_day,
    });

    res
      .status(201)
      .json({ message: "Usuario registrado", userId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error });
  }
};


// =================================
// Funcion para logear un usuario 
// =================================
export const loginUser = async (req, res) => {
  try {
    const { user_handle, password_hash } = req.body;

    // Validación de datos de entrada
    if (!user_handle || !password_hash) {
      return res
        .status(400)
        .json({ message: "Usuario y contraseña requeridos" });
    }

    // Buscar usuario en la base de datos
    const user = await getUserByUserHandle(user_handle);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparar contraseñas
    const isValidPassword = await comparePassword(
      password_hash,
      user.password_hash
    );

    if (!isValidPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // JWT
    const token = jwt.sign(
      { id: user.user_id, username: user.user_handle },
      SECRET_JWT_KEY,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      { id: user.user_id },
      REFRESH_JWT_KEY,
      { expiresIn: '7d' }
    );

    // Autenticación exitosa
    return res
      .status(200)
      .cookie('access_token', token,{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // strict
        maxAge: 1000 * 60 * 60
      })
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7
      })
      .json({
      validation: true,
      message: "Usuario autenticado",
      });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor", error });
  }
};


// ===========================================
// Funcion para refrescar token de un usuario
// ===========================================
export const refreshToken = (req, res) => {
  const token = req.cookies.refresh_token;
  if (!token) return res.status(401).json({ message: "Refresh token requerido" });

  jwt.verify(token, REFRESH_JWT_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Refresh token inválido" });

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      SECRET_JWT_KEY,
      { expiresIn: '1h' }
    );

    res.cookie('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60
    });

    res.json({ message: "Access token renovado correctamente" });
  });
};


// =========================================
// Funcion para cerrar sesion de un usuario 
// =========================================
export const logOutUser = (req, res) => {
  res
    .clearCookie('access_token')
    .clearCookie('refresh_token')
    .json({message: 'Logout successful'})
}


// =========================================
// Middleware para verificar el token JWT
// =========================================
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_JWT_KEY, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded; // puedes acceder luego a req.user.id
    next();
  });
};

