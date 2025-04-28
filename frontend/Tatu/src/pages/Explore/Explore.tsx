import { PeopleExplore } from '@/features/explore'
import { Nav } from "@/features/navigation"
import "./Explore.css";
function Explore() {
  return (
    <div className="container_explore_page">
      <div className="sidebar">
        <Nav />
      </div>
      <div className="main-content">
        <PeopleExplore />
      </div>
    </div>
  );
}

export default Explore;
