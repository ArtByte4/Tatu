import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PeopleExplore.css"
import axios from "axios";
function PeopleExplore() {


  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para indicar carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const navigate = useNavigate();


  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users", {withCredentials: true});
      setUsers(response.data);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("Hubo un problema al cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const response = await axios.post("http://localhost:3000/api/users/auth/logout", {}, {withCredentials: true});
    console.log(response)
    navigate("/login");

}

  useEffect(() => {
    fetchUsers(); // Cargar datos al montar el componente
  }, []);

  // Mensaje de carga
  if (loading) return <p>Cargando usuarios...</p>;

  // Mensaje de error
  if (error) return <p>{error}</p>;
  console.log(users);
  return (
    <div className="container_suggested">
      <div className="content_suggested">
        <div className="title_seccion">
          <h4>Sugerencias</h4>
        </div>

        <div className="main_content">
          <button onClick={logout}>Log out</button>
          {users.map((user) => {
            return (
              <div className="card_item_suggested" key={user.user_handle}>
                <div className="card_user">
                  <div className="conten-img">
                    <img src="../../../public/img/maluma.jpg" alt="" />
                  </div>
                  <div className="describe_item_suggested">
                    <span className="user_handle">{user.user_handle}</span>
                    <span className="text">Sugerencia para ti</span>
                  </div>
                </div>
                <button className="seguir_suggested">Seguir</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PeopleExplore;
