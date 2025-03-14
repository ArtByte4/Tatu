import PeopleExplore from "../../components/PeopleExplore/PeopleExplore";
import Nav from "../../components/Nav/Nav";
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
