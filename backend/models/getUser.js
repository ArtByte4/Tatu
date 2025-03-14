
import connection from "../db.js";

const getUsers = async () => {
    const query = "SELECT * FROM users";
    try{
        const [users] = await connection.query(query); 
        return users;
    }
    catch (err) {
        console.log('Error en la consulta', err)
    }
    
};

export { getUsers };