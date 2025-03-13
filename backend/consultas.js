import connection from "./db.js";

const getUsers = (callback) => {
    connection.query("SELECT * FROM users", (err, results) => {
        if (err) {
            console.error("❌ Error en la consulta:", err);
            return callback(err, null);
        }
        callback(null, results);
    }); 
};

export { getUsers };


const getComments = (callback) =>{
    connection.query("call getComments();",(err, results) => {
    if (err) {
        console.error("❌ Error al llamar la función:", err);
        return callback(err, null);
    }
    callback(null, results);
}   );
}
export {getComments};



const getUserByUserHandle = (user_handle, callback) => {
    const query = 'SELECT * FROM users where user_handle = ?'

    connection.query(query, [user_handle], (err, results) => {
        if (err) {
            console.error("❌ Error en la consulta:", err);
            return callback(err, null);
        }
        callback(null, results);
    })
}
export {getUserByUserHandle};