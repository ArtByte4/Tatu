import connection from "./db.js";

// Función para insertar un nuevo usuario
const addUser = (userData, callback) => {
    const { user_handle, email_address, first_name, last_name, phonenumber, role_id, password_hash, birth_day } = userData;
    const query = `
        INSERT INTO users (user_handle, email_address, first_name, last_name, phonenumber, role_id, password_hash, birth_day)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    connection.query(query, [user_handle, email_address, first_name, last_name, phonenumber, role_id, password_hash, birth_day], (err, results) => {
        if (err) {
            console.error("❌ Error en la consulta de inserción:", err, userData);
            return callback(err, null);
        }
        callback(null, results);
    });
};

export { addUser };
