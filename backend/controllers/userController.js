import { getUsers, getUserByUserHandle, addUser } from "../models/userModel.js";
import { encryptPassword } from "../services/userServiceRegister.js";


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
    })


    res.status(201).json({ message: "Usuario registrado", userId: result.insertId });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};
