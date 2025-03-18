import Nav from '../../components/Nav/Nav';
import PerfilUser from '../../components/PerfilUser/PerfilUser';
import './Perfil.css'

function Perfil() {
  return (
    <div className="container_explore_page">
      <div className="sidebar">
        <Nav />
      </div>
      <div className="main-content">
          <PerfilUser />
      </div>
    </div>
  );
}

export default Perfil;
