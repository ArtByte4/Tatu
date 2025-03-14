import connection from "../db.js";

// Función para insertar un nuevo usuario
const addUser = async (userData) => {
  const {
    user_handle,
    email_address,
    first_name,
    last_name,
    phonenumber,
    role_id,
    password_hash,
    birth_day,
  } = userData;
  const query = `
        INSERT INTO users (user_handle, email_address, first_name, last_name, phonenumber, role_id, password_hash, birth_day)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

  try {
    const [result] = await connection.execute(query, [
      user_handle,
      email_address,
      first_name,
      last_name,
      phonenumber,
      role_id,
      password_hash,
      birth_day,
    ]);
    return result;
  } catch (err) {
    console.error("❌ Error en la consulta de inserción:", err, userData);
    console.error("Error al insertar el usuario en la base de datos.");
  }
};

export { addUser };
