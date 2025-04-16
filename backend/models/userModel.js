import connection from "../db.js";

export const getUsers = async () => {
  const query = "SELECT * FROM users";
  try {
    const [users] = await connection.query(query);
    return users;
  } catch (err) {
    console.log("Error en la consulta", err);
  }
};

export const getUserByUserHandle = async (user_handle) => {
  const query =
    "select * from users where user_handle = ?";

  try {
    const [user] = await connection.query(query, user_handle);
    return user[0];
  } catch (err) {
    console.log("Error en la consulta", err);
  }
};

export const getUserProfile = async (user_handle) => {
  const query =
    "select u.user_handle, p.image, p.bio, u.first_name from users u join profile p on p.user_id = u.user_id where user_handle = ?";

  try {
    const [user] = await connection.query(query, user_handle);
    return user[0];
  } catch (err) {
    console.log("Error en la consulta", err);
  }
};

export const addUser = async (userData) => {
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
    const [result] = await connection.query(query, [
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
