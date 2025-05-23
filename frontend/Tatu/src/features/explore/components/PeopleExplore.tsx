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
import "../styles/PeopleExplore.css";

function PeopleExplore({ options }: PeopleExploreProps) {
  const { users, loading, handleUsers } = useExplore();

  useEffect(() => {
    handleUsers(); // Cargar datos al montar el componente
  }, [handleUsers]);

  // Mensaje de carga
  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div className="container_suggested">
      <div className="content_suggested">
        <div className="title_seccion">
          <h4>{options ? "Administración" : "Sugerencias"}</h4>
        </div>

        <div className="main_content">
          {users.map((user: User) => {
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
                <button className={options ? 'delete_suggested' : 'seguir_suggested'}>
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
