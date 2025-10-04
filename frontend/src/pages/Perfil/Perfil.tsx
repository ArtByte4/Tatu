import { Nav } from '@/features/navigation'
import { PerfilUser } from '@/features/profile'
import './Perfil.css'
import { useAuthStore } from '@/stores/authStore'
function Perfil() {
  const { user } = useAuthStore();
  return (
    <div className="container_explore_page">
      <div className="sidebar">
        <Nav optionsAdmin={user?.rol == 3}/>
      </div>
      <div className="main-content">
          <PerfilUser />
      </div>
    </div>
  );
}

export default Perfil;
