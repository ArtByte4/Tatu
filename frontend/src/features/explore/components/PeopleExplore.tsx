interface User {
  user_id: number;
  user_handle: string;
  first_name: string;
  last_name: string;
  bio: string;
  birth_day: string;
  follower_count: number;
  gender: string;
  image: string;
  role_id: number;
}
interface PeopleExploreProps {
  options: boolean;
}

import { useEffect } from "react";
import { useExplore } from "../hooks/useExplore";
import { deleteUser } from "../hooks/useDeleteUser";
import "../styles/PeopleExplore.css";

function PeopleExplore({ options }: PeopleExploreProps) {
  const { users, loading, handleUsers } = useExplore();

  useEffect(() => {
    handleUsers(); // Cargar datos al montar el componente
  }, [handleUsers]);


  const deleteUserHandler = async (user_id: number) => {
    try {
      await deleteUser(user_id);
      handleUsers()
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error al eliminar usuario");
    }
  };

  // Mensaje de carga
  if (loading) return <p>Cargando usuarios...</p>;

  // Limitar a 7 usuarios solo en modo sugerencias
  const displayedUsers = options ? users : users.slice(0, 7);

  return (
    <div className="container_suggested">
      <div className="content_suggested">
        <div className="title_seccion">
          <h4>{options ? "Administración" : "Sugerencias"}</h4>
        </div>

        <div className="main_content">
          {displayedUsers.map((user: User) => {
            return (
              <div className="card_item_suggested" key={user.user_handle}>
                <div className="card_user">
                  <div className="conten-img">
                    <img src={user.image} alt="" />
                  </div>
                  <div className="describe_item_suggested">
                    <a href={`/profile/${user.user_handle}`}>
                      <span className="user_handle">{user.user_handle}</span>
                    </a>
                    <span className="text">Sugerencia para ti</span>
                  </div>
                </div>
                <button
                  className={options ? 'delete_suggested' : 'seguir_suggested'}
                  onClick={() => {
                    if (options) {
                      deleteUserHandler(user.user_id);
                    } else {
                      console.log("Seguir usuario");
                    }
                  }}
                >
                  {options ? "Eliminar" : "Seguir"}
                </button>
                {options && (
                  <button className="gestionar_suggested">Gestionar</button>
                )}
                
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PeopleExplore;
