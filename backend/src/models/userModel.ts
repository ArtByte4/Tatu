import connection from "../db";

interface User {
  user_id: number;
  user_handle: string;
  first_name: string;
  last_name: string;
  role_id: number;
  birth_day: string;
  email_address: string;
  phonenumber: string;
  password_hash: string;
}

interface Profile {
  gender: string;
  image: string;
  bio: string;
  follower_count: number;
}

interface UserWithProfile extends User, Profile {}

interface NewUserInput {
  user_handle: string;
  email_address: string;
  first_name: string;
  last_name: string;
  phonenumber: string;
  role_id: number;
  password_hash: string;
  birth_day: string;
}

export const getUsers = async (): Promise<UserWithProfile[] | undefined> => {
  const query = `
    SELECT  
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
    FROM users u
    JOIN profile p ON p.user_id = u.user_id;
  `;
  try {
    const [users] = await connection.query(query);
    return users as UserWithProfile[];
  } catch (err) {
    console.error("Error en la consulta", err);   
    return undefined;

  }
};

export const getUserByUserHandle = async (user_handle: string): Promise<User | undefined> => {
  const query = "SELECT * FROM users WHERE user_handle = ?";
  try {
    const [rows] = await connection.query(query, [user_handle]);
    return (rows as User[])[0];
  } catch (err) {
    console.error("Error en la consulta", err);
    return undefined;
  }
};

export const getUserByEmail = async (email_address: string): Promise<User | undefined> => {
  const query = "SELECT * FROM users WHERE email_address = ?";
  try {
    const [rows] = await connection.query(query, [email_address]);
    return (rows as User[])[0];
  } catch (err) {
    console.error("Error en la consulta por email", err);
    return undefined;
  }
};

export const getUserByPhone = async (phonenumber: string): Promise<User | undefined> => {
  const query = "SELECT * FROM users WHERE phonenumber = ?";
  try {
    const [rows] = await connection.query(query, [phonenumber]);
    return (rows as User[])[0];
  } catch (err) {
    console.error("Error en la consulta por teléfono", err);
    return undefined;
  }
};

export const getUserProfile = async (user_handle: string): Promise<Partial<UserWithProfile> | undefined> => {
  const query = `
    SELECT u.user_id, u.user_handle, p.image, p.bio, u.first_name 
    FROM users u 
    JOIN profile p ON p.user_id = u.user_id 
    WHERE user_handle = ?
  `;
  try {
    const [rows] = await connection.query(query, [user_handle]);
    return (rows as Partial<UserWithProfile>[])[0];
  } catch (err) {
    console.error("Error en la consulta", err);
    return undefined;
  }
};

export const deleteUser = async (user_id: number): Promise<any> => {
  const query = "DELETE FROM users WHERE user_id = ?";
  try {
    const [result] = await connection.query(query, [user_id]);
    return result;
  } catch (error) {
    console.error("Error al eliminar usuario", error);
  }
};

export const addUser = async (userData: NewUserInput): Promise<any> => {
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
    INSERT INTO users (
      user_handle, 
      email_address, 
      first_name, 
      last_name, 
      phonenumber, 
      role_id, 
      password_hash, 
      birth_day
    )
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
  }
};

export const uploadPhotoUser = async (url: string, id: number): Promise<any> => {
  const query = "UPDATE profile SET image = ? WHERE user_id = ?";
  try {
    const [result] = await connection.query(query, [url, id]);
    return result;
  } catch (error) {
    console.error("No fue posible subir la imagen", error);
  }
};

// Buscar usuarios por query (handle, nombre, apellido, bio)
export const searchUsers = async (query: string): Promise<UserWithProfile[] | undefined> => {
  const searchTerm = `%${query}%`;
  const searchQuery = `
    SELECT  
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
    FROM users u
    JOIN profile p ON p.user_id = u.user_id
    WHERE 
      u.user_handle LIKE ? OR
      u.first_name LIKE ? OR
      u.last_name LIKE ? OR
      p.bio LIKE ?
    ORDER BY u.user_handle ASC
  `;
  try {
    const [users] = await connection.query(searchQuery, [
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm,
    ]);
    return users as UserWithProfile[];
  } catch (err) {
    console.error("Error en la búsqueda de usuarios", err);
    return undefined;
  }
};
