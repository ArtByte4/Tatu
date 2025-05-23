import connection from "../db.js";

export const getUsers = async () => {
  const query = `
     select  
      u.user_id,
      u.user_handle, 
      u.first_name, 
      u.last_name, 
      u.role_id, 
      u.birth_day, 
      p.gender, 
      p.image, 
      p.bio, 
      p.follower_count 
      from users u
      join profile p on p.user_id = u.user_id;
  `;
  try {
    const [users] = await connection.query(query);
    return users;
  } catch (err) {
    console.log("Error en la consulta", err);
  }
};

export const getUserByUserHandle = async (user_handle) => {
  const query = "select * from users where user_handle = ?";
  try {
    const [user] = await connection.query(query, user_handle);
    return user[0];
  } catch (err) {
    console.log("Error en la consulta", err);
  }
};

export const getUserByEmail = async (email_address) => {
  const query = "SELECT * FROM users WHERE email_address = ?";
  try {
    const [user] = await connection.query(query, email_address);
    return user[0];
  } catch (err) {
    console.log("Error en la consulta por email", err);
  }
};

export const getUserByPhone = async (phonenumber) => {
  const query = "SELECT * FROM users WHERE phonenumber = ?";
  try {
    const [user] = await connection.query(query, phonenumber);
    return user[0];
  } catch (err) {
    console.log("Error en la consulta por teléfono", err);
  }
};

export const getUserProfile = async (user_handle) => {
  const query =
    "select u.user_id, u.user_handle, p.image, p.bio, u.first_name from users u join profile p on p.user_id = u.user_id where user_handle = ?";

  try {
    const [user] = await connection.query(query, user_handle);
    return user[0];
  } catch (err) {
    console.log("Error en la consulta", err);
  }
};



export const deleteUser = async (user_id) => {
  const query = `DELETE FROM users WHERE user_id = ?`
  try{
    const [user] = await connection.query(query, [user_id]);
    console.log(user)
    return user;
  }catch (error){
    console.log('Error al eliminar usuario', error)
  }
}

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

export const uploadPhotoUser = async (url, id) => {
  const query = `
        update profile set image = ? where user_id = ?
    `;
  try {
    const [result] = await connection.query(query, [url, id]);
    console.log(url, id);
    return result;
  } catch (error) {
    console.log("No fue posible subir la imagen", error);
  }
};
