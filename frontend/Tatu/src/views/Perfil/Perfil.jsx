import { Nav } from '@/features/navigation'
import { PerfilUser } from '@/features/profile'
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
