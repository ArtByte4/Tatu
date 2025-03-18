import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Autform from "./components/Autform/Autform";
import StepsRegister from "./components/StepsRegister/StepsRegister";
import UserSuggested from "./components/UserSuggested/UserSuggested";
import Explore from "./views/Explore/Explore/Explore";
import Perfil from "./views/Perfil/Perfil";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Autform />} />
      </Routes>
      <Routes>
        <Route path="/steps" element={<StepsRegister />} />
      </Routes>
      <Routes>
        <Route path="/" element={<Explore/>} />
      </Routes>
      <Routes>
        <Route path="/user" element={<UserSuggested />} />
      </Routes>
      <Routes>
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </Router>
  );
}

export default App;
