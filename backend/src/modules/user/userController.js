import {
  getUsers,
  getUserByUserHandle,
  getUserProfile,
  addUser,
  getUserByEmail,
  getUserByPhone,
  uploadPhotoUser,
  deleteUser,
} from "../../models/userModel.js";
import { encryptPassword } from "../auth/authService.js";

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuarios", err });
  }
};

// Obtener un usuario por handle
export const getOneUser = async (req, res) => {
  try {
    const user = await getUserByUserHandle(req.params.user_handle);
    res.json(user);
  } catch (err) {
    console.log("Error al obtener usuario", err);
  }
};

export const getOneProfile = async (req, res) => {
  try {
    const user = await getUserProfile(req.params.user_handle);
    res.json(user);
  } catch (err) {
    console.log("Error al obtener perfil", err);
  }
};

// Registrar usuario
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
    res
      .status(500)
      .json({ message: `Error al registrar usuario: ${error}`, error });
  }
};

// Validaciones únicas
export const emailValidate = async (req, res) => {
  try {
    const { email_address } = req.body;
    const exists = await getUserByEmail(email_address);
    if (exists) {
      return res
        .status(401)
        .json({
          message: "Correo ya en uso",
          valid: false,
          field: "email_address",
        });
    }
    res
      .status(200)
      .json({
        message: "Correo disponible",
        valid: true,
        field: "email_address",
      });
  } catch {
    res.status(500).json({ message: "Error al validar email" });
  }
};

export const userHandleValidate = async (req, res) => {
  try {
    const { user_handle } = req.body;
    const exists = await getUserByUserHandle(user_handle);
    if (exists) {
      return res
        .status(401)
        .json({
          message: "Username en uso",
          valid: false,
          field: "user_handle",
        });
    }
    res
      .status(200)
      .json({
        message: "Username disponible",
        valid: true,
        field: "user_handle",
      });
  } catch {
    res.status(500).json({ message: "Error al validar username" });
  }
};

export const phoneNumberValidate = async (req, res) => {
  try {
    const { phonenumber } = req.body;
    const exists = await getUserByPhone(phonenumber);
    if (exists) {
      return res
        .status(401)
        .json({ message: "Número en uso", valid: false, field: "phonenumber" });
    }
    res
      .status(200)
      .json({
        message: "Número disponible",
        valid: true,
        field: "phonenumber",
      });
  } catch {
    res.status(500).json({ message: "Error al validar número" });
  }
};

export const updatephotoPefil = async (req, res) => {
  try {
    const { url, id } = req.body;
    const change = await uploadPhotoUser(url, id);
    res.json({ message: "Actualizado con éxito", change });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar foto", error });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    await deleteUser(req.params.user_id);
    res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el usuario", error });
  }
};
