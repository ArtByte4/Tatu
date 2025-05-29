import { SECRET_JWT_KEY, REFRESH_JWT_KEY, ID_ROL_ADMIN } from "../config.js";
import {
  getUsers,
  getUserByUserHandle,
  addUser,
  getUserProfile,
  uploadPhotoUser,
  getUserByEmail,
  getUserByPhone,
  deleteUser,
} from "../models/userModel.js";
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
    res.status(500).json({ error: "Error al obtener usuarios", err });
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

export const getOneProfile = async (req, res) => {
  const userHandle = req.params.user_handle;
  try {
    const user = await getUserProfile(userHandle);
    res.json(user);
  } catch (err) {
    console.log("Error al obtener perfil de usuario", err);
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
    console.log(req.body);

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
    res
      .status(500)
      .json({ message: `Error al registrar usuario backend ${error}`, error });
  }
};

// ===================================
// Funcion para validar email_address
// ===================================
export const emailValidate = async (req, res) => {
  try {
    const { email_address } = req.body;

    const verifiEmail = await getUserByEmail(email_address);
    if (verifiEmail && verifiEmail.email_address === email_address) {
      return res.status(401).json({
        message: "Este correo electronico ya está en uso.",
        valid: false,
        field: "email_address",
      });
    }

    return res.status(200).json({
      message: "Correo electrónico disponible.",
      valid: true,
      field: "email_address",
    });
  } catch (error) {
    res.status(500).json({ message: "Error al validar correo electronico" });
  }
};

// =================================
// Funcion para validar user_handle
// =================================
export const userHandleValidate = async (req, res) => {
  try {
    const { user_handle } = req.body;

    const verifiUserHandle = await getUserByUserHandle(user_handle);
    if (verifiUserHandle && verifiUserHandle.user_handle === user_handle) {
      return res.status(401).json({
        message: "Este nombre de usuario ya está en uso.",
        valid: false,
        field: "user_handle",
      });
    }

    return res.status(200).json({
      message: "Username de usuario valido",
      valid: true,
      field: "user_handle",
    });
  } catch (error) {
    res.status(500).json({ message: "Error al validar username" });
  }
};

// =================================
// Funcion para validar phonenumber
// =================================
export const phoneNumberValidate = async (req, res) => {
  try {
    const { phonenumber } = req.body;

    const verifiPhoneNumber = await getUserByPhone(phonenumber);
    if (verifiPhoneNumber && verifiPhoneNumber.phonenumber === phonenumber) {
      return res.status(401).json({
        message: "Este número de celular ya esta en uso.",
        valid: false,
        field: "phonenumber",
      });
    }

    return res.status(200).json({
      message: "Phonenumber de usuario valido",
      valid: true,
      field: "phonenumber",
    });
  } catch (error) {
    res.status(500).json({ message: "Error al validar phonenumber" });
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
    console.log(user);
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
      { id: user.user_id, role: user.role_id, username: user.user_handle },
      SECRET_JWT_KEY,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      { id: user.user_id, role: user.role_id },
      REFRESH_JWT_KEY,
      {
        expiresIn: "7d",
      }
    );
    // Autenticación exitosa
    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // strict
        maxAge: 1000 * 60 * 60,
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
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

// ===========================================
// Funcion para refrescar token de un usuario
// ===========================================
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
      maxAge: 1000 * 60 * 60,
    });

    res.json({ message: "Access token renovado correctamente" });
  });
};

// =========================================
// Funcion para cerrar sesion de un usuario
// =========================================
export const logOutUser = (req, res) => {
  res
    .clearCookie("access_token")
    .clearCookie("refresh_token")
    .json({ message: "Logout successful" });
};

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

export const updatephotoPefil = async (req, res) => {
  const { url, id } = req.body;
  try {
    const change = await uploadPhotoUser(url, id);
    res.json({ message: "Actualizado con exito", change });
  } catch (error) {
    res.status(500).json({
      succes: true,
      message: "Error al actualizar url de la base de datos",
      error,
    });
  }
};

// =========================================
// Middleware para verificar el token JWT Admin
// =========================================

export const verificarAdmin = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res
      .status(401)
      .json({ mensaje: "Token no proporcionado", valid: false });
  }

  jwt.verify(token, SECRET_JWT_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ mensaje: "Token inválido o expirado", valid: false });
    }

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

export const deleteUserById = async (req, res) => {
  const { user_id } = req.params;

  try {
    const response = await deleteUser(user_id);

    console.log(response);
    return res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ mensaje: "Error al eliminar el usuario", error});
  }
};
