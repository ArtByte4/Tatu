import { PeopleExplore } from '@/features/explore'
import { Nav } from "@/features/navigation"
import "./Explore.css";
import { useAuthStore } from "@/stores/authStore";
function Explore() {
  const { user } = useAuthStore();
  return (
    <div className="container_explore_page">
      <div className="sidebar">
       <Nav optionsAdmin={user?.rol == 3}/>
      </div>
      <div className="main-content">
        <PeopleExplore options={user?.rol == 3}/>
      </div>
    </div>
  );
}

export default Explore;
