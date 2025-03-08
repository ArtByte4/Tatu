
import React, { useState } from "react";
import "./UserSuggested.css";

function UserSuggested() {

const [listUSerSuggested, setListUserSuggested] = useState([
    {name: "mike"},
    {name: "cristian"},
    {name: "placo"},
    {name: "camilo"}
]);


return (
    <>
      {listUSerSuggested.map((usuario, index) => (
        <div className="container-user-suggested" key={index}>
          <div className="img-user-suggested">
            <img src={`https://unavatar.io/${usuario.name}`} alt={usuario.name} />
            <div className="user-name-suggested">
              <span className="username">
                {usuario.name}
                <img src="../../public/img/verificado.png" alt="Verificado" />
              </span>
              <span className="suggested-text">Recomendación de Tatu</span>
            </div>
          </div>
  
          <div className="btn-seguir">
            <div className="btn">Seguir</div>
          </div>
        </div>
      ))}
    </>
  );
}

export default UserSuggested;
