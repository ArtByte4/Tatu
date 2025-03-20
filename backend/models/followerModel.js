import connection from "../db.js";

export const getFollowersQuery = async () => {
  const query = "SELECT * FROM  followers";
  try {
    const [followers] = await connection.query(query);
    return followers;
  } catch (err) {
    console.log("Error en la consulta", err);
  }
};


