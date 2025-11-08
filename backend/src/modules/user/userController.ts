import {
  getUsers,
  getUserByUserHandle,
  getUserProfile,
  addUser,
  getUserByEmail,
  getUserByPhone,
  uploadPhotoUser,
  deleteUser,
} from "../../models/userModel";
import { encryptPassword } from "../auth/authService";
import { Request, Response } from "express";
import connection from "../../db";

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

// Buscar usuarios por nombre de usuario
export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({ message: 'El nombre de usuario es requerido' });
    }

    console.log('Buscando usuarios con query:', username); // Debug log

    const query = `
      SELECT 
        u.user_handle AS username,
        u.first_name,
        u.last_name,
        u.email_address,
        i.src AS profile_photo
      FROM users u
      LEFT JOIN image i ON i.user_id = u.user_id AND i.src LIKE '%profile%'
      WHERE LOWER(u.first_name) LIKE LOWER(?) OR LOWER(u.last_name) LIKE LOWER(?)
      ORDER BY u.first_name, u.last_name
      LIMIT 10
    `;

    console.log('Ejecutando query:', query); // Debug log
    console.log('Con parámetros:', [`%${username}%`, `%${username}%`]); // Debug log

    const [rows] = await connection.query<any[]>(query, [`%${username}%`, `%${username}%`]);
    
    console.log('Resultados encontrados:', rows); // Debug log
    return res.json(rows);
  } catch (error) {
    // Log detallado del error
    console.error('Error detallado al buscar usuarios:', {
      error,
      message: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return res.status(500).json({ 
      message: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Proxy para obtener avatar de servicios externos (evita problemas de CORS / OpaqueResponseBlocking)
// avatar proxy removed — restored to previous behavior (use external avatar URLs directly)

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
