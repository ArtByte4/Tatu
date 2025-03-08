import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Autform from "./components/Autform/Autform";
import StepsRegister from "./components/StepsRegister/StepsRegister";
import Nav from "./components/Nav/Nav";
import UserSuggested from "./components/UserSuggested/UserSuggested";
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
        <Route path="/" element={<Nav />} />
      </Routes>
      <Routes>
        <Route path="/user" element={<UserSuggested />} />
      </Routes>
    </Router>
  );
}

export default App;
