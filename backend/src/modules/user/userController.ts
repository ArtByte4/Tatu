import {
  getUsers,
  getUserByUserHandle,
  getUserProfile,
  addUser,
  getUserByEmail,
  getUserByPhone,
  uploadPhotoUser,
  deleteUser,
  searchUsers,
} from "../../models/userModel";
import { encryptPassword } from "../auth/authService";
import { Request, Response } from "express";

// Obtener todos los usuarios
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuarios", err });
  }
};

// Obtener un usuario por handle
export const getOneUser = async (req: Request, res: Response) => {
  try {
    const user = await getUserByUserHandle(req.params.user_handle);
    res.json(user);
  } catch (err) {
    console.log("Error al obtener usuario", err);
  }
};

export const getOneProfile = async (req: Request, res: Response) => {
  try {
    const user = await getUserProfile(req.params.user_handle);
    res.json(user);
  } catch (err) {
    console.log("Error al obtener perfil", err);
  }
};

// Registrar usuario
export const createUser = async (req: Request, res: Response) => {
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
      res
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
export const emailValidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email_address } = req.body;
    const exists = await getUserByEmail(email_address);
    if (exists) {
      res.status(401).json({
        message: "Correo ya en uso",
        valid: false,
        field: "email_address",
      });
      return;
    }
    res.status(200).json({
      message: "Correo disponible",
      valid: true,
      field: "email_address",
    });
  } catch (error) {
    res.status(500).json({ message: "Error al validar email" });
  }
};

export const userHandleValidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_handle } = req.body;
    const exists = await getUserByUserHandle(user_handle);
    if (exists) {
      res.status(401).json({
        message: "Username en uso",
        valid: false,
        field: "user_handle",
      });
      return;
    }
    res.status(200).json({
      message: "Username disponible",
      valid: true,
      field: "user_handle",
    });
  } catch (error) {
    res.status(500).json({ message: "Error al validar username" });
  }
};

export const phoneNumberValidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phonenumber } = req.body;
    const exists = await getUserByPhone(phonenumber);
    if (exists) {
      res.status(401).json({ 
        message: "Número en uso", 
        valid: false, 
        field: "phonenumber" 
      });
      return;
    }
    res.status(200).json({
      message: "Número disponible",
      valid: true,
      field: "phonenumber",
    });
  } catch (error) {
    res.status(500).json({ message: "Error al validar número" });
  }
};

export const updatephotoPefil = async (req: Request, res: Response) => {
  try {
    const { url, id } = req.body;
    const change = await uploadPhotoUser(url, id);
    res.json({ message: "Actualizado con éxito", change });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar foto", error });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.user_id);

    if (isNaN(userId)) {
      res.status(400).json({ mensaje: "ID de usuario inválido" });
      return;
    }

    await deleteUser(userId);
    res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el usuario", error });
  }
};

// Buscar usuarios
export const searchUsersHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;

    if (!query || query.trim().length === 0) {
      res.status(400).json({ error: "El parámetro de búsqueda 'q' es requerido" });
      return;
    }

    const users = await searchUsers(query.trim());
    
    if (users === undefined) {
      res.status(500).json({ error: "Error al buscar usuarios" });
      return;
    }

    res.json(users);
  } catch (err) {
    console.error("Error al buscar usuarios:", err);
    res.status(500).json({ error: "Error al buscar usuarios" });
  }
};
