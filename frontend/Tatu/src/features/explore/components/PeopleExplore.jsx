import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useExplore } from "../hooks/useExplore";
import "../styles/PeopleExplore.css";

function PeopleExplore() {
  const { logout } = useAuthStore();
  const { users, loading, handleUsers } = useExplore();

  const navigate = useNavigate();

  const logoutClearCookies = async () => {
    const response = await axios.post(
      "http://localhost:3000/api/users/auth/logout",
      {},
      { withCredentials: true }
    );
    console.log(response);
    logout();
    navigate("/login");
  };

  useEffect(() => {
    handleUsers(); // Cargar datos al montar el componente
    console.log("Yeahhh");
  }, [handleUsers]);

  // Mensaje de carga
  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div className="container_suggested">
      <div className="content_suggested">
        <div className="title_seccion">
          <h4>Sugerencias</h4>
        </div>

        <div className="main_content">
          <button onClick={logoutClearCookies}>Log out</button>
          {users.map((user) => {
            return (
              <div className="card_item_suggested" key={user.user_handle}>
                <div className="card_user">
                  <div className="conten-img">
                    <img src={user.image} alt="" />
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
