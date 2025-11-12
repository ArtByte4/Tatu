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

// Obtener usuario por ID
export const getUserById = async (user_id: number): Promise<UserWithProfile | undefined> => {
  const query = `
    SELECT  
      u.user_id,
      u.user_handle, 
      u.first_name, 
      u.last_name, 
      u.role_id, 
      u.birth_day,
      u.email_address,
      u.phonenumber,
      u.created_at,
      p.gender, 
      p.image, 
      p.bio, 
      p.follower_count 
    FROM users u
    LEFT JOIN profile p ON p.user_id = u.user_id
    WHERE u.user_id = ?
  `;
  try {
    const [rows] = await connection.query(query, [user_id]);
    const users = rows as UserWithProfile[];
    return users[0];
  } catch (err) {
    console.error("Error en la consulta por ID", err);
    return undefined;
  }
};

// Actualizar usuario
interface UpdateUserInput {
  user_id: number;
  user_handle?: string;
  email_address?: string;
  first_name?: string;
  last_name?: string;
  phonenumber?: string;
  birth_day?: string;
  password_hash?: string;
}

export const updateUser = async (userData: UpdateUserInput): Promise<any> => {
  const { user_id, ...fields } = userData;
  
  // Construir query dinámicamente
  const updateFields: string[] = [];
  const values: any[] = [];
  
  if (fields.user_handle !== undefined) {
    updateFields.push("user_handle = ?");
    values.push(fields.user_handle);
  }
  if (fields.email_address !== undefined) {
    updateFields.push("email_address = ?");
    values.push(fields.email_address);
  }
  if (fields.first_name !== undefined) {
    updateFields.push("first_name = ?");
    values.push(fields.first_name);
  }
  if (fields.last_name !== undefined) {
    updateFields.push("last_name = ?");
    values.push(fields.last_name);
  }
  if (fields.phonenumber !== undefined) {
    updateFields.push("phonenumber = ?");
    values.push(fields.phonenumber);
  }
  if (fields.birth_day !== undefined) {
    updateFields.push("birth_day = ?");
    values.push(fields.birth_day);
  }
  if (fields.password_hash !== undefined) {
    updateFields.push("password_hash = ?");
    values.push(fields.password_hash);
  }
  
  if (updateFields.length === 0) {
    throw new Error("No hay campos para actualizar");
  }
  
  values.push(user_id);
  
  const query = `UPDATE users SET ${updateFields.join(", ")} WHERE user_id = ?`;
  
  try {
    const [result] = await connection.query(query, values);
    return result;
  } catch (err) {
    console.error("Error al actualizar usuario", err);
    throw err;
  }
};

// Actualizar rol de usuario
export const updateUserRole = async (user_id: number, role_id: number): Promise<any> => {
  const query = "UPDATE users SET role_id = ? WHERE user_id = ?";
  try {
    const [result] = await connection.query(query, [role_id, user_id]);
    return result;
  } catch (err) {
    console.error("Error al actualizar rol de usuario", err);
    throw err;
  }
};
