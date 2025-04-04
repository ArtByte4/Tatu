import { useState } from 'react';
import './CardUser.css';

function CardUser() {
  const [user] = useState([
    { nombre: 'juan' },
    { nombre: 'mike' },
    { nombre: 'gerald' },
    { nombre: 'cristian' }  
  ]);

  return (
    <div>
      {user.map((usuario, index) => (
        <div className="container-card" key={index}>
          <div className="info-user-card">
            <img src="/img/maluma.jpg" alt="Perfil" />
            <span>{usuario.nombre}</span>
            <span>Recomendación de tatuajes de chico pretty boy</span>
          </div>
          <div className="btn-seguir"> 
            <div>Seguir</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CardUser;
