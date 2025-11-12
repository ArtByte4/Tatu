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
  getUserById,
  updateUser,
  updateUserRole,
} from "../../models/userModel";
import { encryptPassword } from "../auth/authService";
import { Request, Response } from "express";

// Funciones de validación y sanitización
const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, "");
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
  return phoneRegex.test(phone);
};

const validateUserHandle = (handle: string): boolean => {
  const handleRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return handleRegex.test(handle);
};

const validateDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

const validateRoleId = (roleId: number): boolean => {
  return [1, 2, 3].includes(roleId);
};

// Obtener todos los usuarios
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
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
    let {
      user_handle,
      email_address,
      first_name,
      last_name,
      phonenumber,
      password_hash,
      birth_day,
      role_id,
    } = req.body;

    // Validar campos requeridos
    if (
      !user_handle ||
      !email_address ||
      !first_name ||
      !last_name ||
      !phonenumber ||
      !password_hash ||
      !birth_day
    ) {
      res.status(400).json({ message: "Todos los campos son necesarios" });
      return;
    }

    // Sanitizar inputs
    user_handle = sanitizeString(user_handle);
    email_address = sanitizeString(email_address.toLowerCase());
    first_name = sanitizeString(first_name);
    last_name = sanitizeString(last_name);
    phonenumber = sanitizeString(phonenumber);
    birth_day = sanitizeString(birth_day);

    // Validar formato de datos
    if (!validateUserHandle(user_handle)) {
      res.status(400).json({ message: "El username debe tener entre 3 y 20 caracteres alfanuméricos o guiones bajos" });
      return;
    }

    if (!validateEmail(email_address)) {
      res.status(400).json({ message: "El formato del email no es válido" });
      return;
    }

    if (!validatePhone(phonenumber)) {
      res.status(400).json({ message: "El formato del teléfono no es válido" });
      return;
    }

    if (!validateDate(birth_day)) {
      res.status(400).json({ message: "La fecha de nacimiento no es válida" });
      return;
    }

    if (password_hash.length < 6) {
      res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
      return;
    }

    // Validar role_id si se proporciona (solo para admins)
    const finalRoleId = role_id && validateRoleId(Number(role_id)) ? Number(role_id) : 1;

    // Verificar que no existan duplicados
    const existingHandle = await getUserByUserHandle(user_handle);
    if (existingHandle) {
      res.status(409).json({ message: "El username ya está en uso" });
      return;
    }

    const existingEmail = await getUserByEmail(email_address);
    if (existingEmail) {
      res.status(409).json({ message: "El email ya está en uso" });
      return;
    }

    const existingPhone = await getUserByPhone(phonenumber);
    if (existingPhone) {
      res.status(409).json({ message: "El teléfono ya está en uso" });
      return;
    }

    const hashedPassword = await encryptPassword(password_hash);

    const result = await addUser({
      user_handle,
      email_address,
      first_name,
      last_name,
      phonenumber,
      role_id: finalRoleId,
      password_hash: hashedPassword,
      birth_day,
    });

    res.status(201).json({ message: "Usuario registrado", userId: result.insertId });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
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

    if (isNaN(userId) || userId <= 0) {
      res.status(400).json({ mensaje: "ID de usuario inválido" });
      return;
    }

    // Obtener el ID del admin que hace la petición
    const adminId = (req as any).user?.id;
    if (adminId && Number(adminId) === userId) {
      res.status(403).json({ mensaje: "No puedes eliminar tu propia cuenta" });
      return;
    }

    await deleteUser(userId);
    res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ mensaje: "Error al eliminar el usuario" });
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

    // Sanitizar query
    const sanitizedQuery = sanitizeString(query);
    if (sanitizedQuery.length < 2) {
      res.status(400).json({ error: "La búsqueda debe tener al menos 2 caracteres" });
      return;
    }

    const users = await searchUsers(sanitizedQuery);
    
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

// Obtener usuario por ID (para admin)
export const getUserByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.user_id);

    if (isNaN(userId) || userId <= 0) {
      res.status(400).json({ error: "ID de usuario inválido" });
      return;
    }

    const user = await getUserById(userId);
    
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error("Error al obtener usuario:", err);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

// Actualizar usuario
export const updateUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.user_id);

    if (isNaN(userId) || userId <= 0) {
      res.status(400).json({ error: "ID de usuario inválido" });
      return;
    }

    const {
      user_handle,
      email_address,
      first_name,
      last_name,
      phonenumber,
      birth_day,
    } = req.body;

    // Validar que al menos un campo esté presente
    if (
      !user_handle &&
      !email_address &&
      !first_name &&
      !last_name &&
      !phonenumber &&
      !birth_day
    ) {
      res.status(400).json({ error: "Al menos un campo debe ser proporcionado para actualizar" });
      return;
    }

    const updateData: any = { user_id: userId };

    // Sanitizar y validar campos proporcionados
    if (user_handle !== undefined) {
      const sanitizedHandle = sanitizeString(user_handle);
      if (!validateUserHandle(sanitizedHandle)) {
        res.status(400).json({ error: "El username debe tener entre 3 y 20 caracteres alfanuméricos o guiones bajos" });
        return;
      }
      // Verificar que no exista otro usuario con ese handle
      const existingUser = await getUserByUserHandle(sanitizedHandle);
      if (existingUser && existingUser.user_id !== userId) {
        res.status(409).json({ error: "El username ya está en uso" });
        return;
      }
      updateData.user_handle = sanitizedHandle;
    }

    if (email_address !== undefined) {
      const sanitizedEmail = sanitizeString(email_address.toLowerCase());
      if (!validateEmail(sanitizedEmail)) {
        res.status(400).json({ error: "El formato del email no es válido" });
        return;
      }
      // Verificar que no exista otro usuario con ese email
      const existingUser = await getUserByEmail(sanitizedEmail);
      if (existingUser && existingUser.user_id !== userId) {
        res.status(409).json({ error: "El email ya está en uso" });
        return;
      }
      updateData.email_address = sanitizedEmail;
    }

    if (first_name !== undefined) {
      updateData.first_name = sanitizeString(first_name);
    }

    if (last_name !== undefined) {
      updateData.last_name = sanitizeString(last_name);
    }

    if (phonenumber !== undefined) {
      const sanitizedPhone = sanitizeString(phonenumber);
      if (!validatePhone(sanitizedPhone)) {
        res.status(400).json({ error: "El formato del teléfono no es válido" });
        return;
      }
      // Verificar que no exista otro usuario con ese teléfono
      const existingUser = await getUserByPhone(sanitizedPhone);
      if (existingUser && existingUser.user_id !== userId) {
        res.status(409).json({ error: "El teléfono ya está en uso" });
        return;
      }
      updateData.phonenumber = sanitizedPhone;
    }

    if (birth_day !== undefined) {
      const sanitizedDate = sanitizeString(birth_day);
      if (!validateDate(sanitizedDate)) {
        res.status(400).json({ error: "La fecha de nacimiento no es válida" });
        return;
      }
      updateData.birth_day = sanitizedDate;
    }

    if (req.body.password_hash !== undefined && req.body.password_hash !== "") {
      const password = String(req.body.password_hash);
      if (password.length < 6) {
        res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
        return;
      }
      const hashedPassword = await encryptPassword(password);
      updateData.password_hash = hashedPassword;
    }

    await updateUser(updateData);
    res.status(200).json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// Actualizar rol de usuario
export const updateUserRoleHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.user_id);
    const { role_id } = req.body;

    if (isNaN(userId) || userId <= 0) {
      res.status(400).json({ error: "ID de usuario inválido" });
      return;
    }

    if (!role_id || !validateRoleId(Number(role_id))) {
      res.status(400).json({ error: "Rol inválido. Los roles válidos son: 1 (usuario), 2 (tatuador), 3 (administrador)" });
      return;
    }

    // Obtener el ID del admin que hace la petición
    const adminId = (req as any).user?.id;
    if (adminId && Number(adminId) === userId && Number(role_id) !== 3) {
      res.status(403).json({ error: "No puedes cambiar tu propio rol de administrador" });
      return;
    }

    await updateUserRole(userId, Number(role_id));
    res.status(200).json({ message: "Rol de usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    res.status(500).json({ error: "Error al actualizar rol de usuario" });
  }
};
