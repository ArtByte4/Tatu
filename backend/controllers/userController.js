import { getUsers, getUserByUserHandle, addUser } from "../models/userModel.js";
import { encryptPassword, comparePassword } from "../services/authService.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

// Funcion para traer todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Funcion para traer un usuario espesifico segun el user_handle
export const getOneUser = async (req, res) => {
  const userHandle = req.params.user_handle;
  try {
    const user = await getUserByUserHandle(userHandle);
    res.json(user);
  } catch (err) {
    console.log("Error al obtener usuario", err);
  }
};

// Funcion para registrar un usuario nuevo
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
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

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
      process.env.SECRET_JWT_KEY,
      {
        expiresIn: "1h",
      }
    );

    // Autenticación exitosa
    return res
      .status(200)
      .cookie('access_token', token,{
        httpOnly: true,
        secure: false, //process.env.NODE_ENV == 'production',
        sameSite: 'strict', // strict
        maxAge: 1000 * 60 * 60
      })
      .json({
      validation: true,
      message: "Usuario autenticado",
      token: token,
      });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
