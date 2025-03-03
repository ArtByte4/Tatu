import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Autform from "./components/Autform/Autform";
// import Regisform from "./components/Regisform/Regisform";
import StepsRegister from "./components/StepsRegister/StepsRegister";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Autform />} />
      </Routes>
      {/* <Routes>
        <Route path="/register" element={<Regisform />} />
      </Routes> */}
      <Routes>
        <Route path="/steps" element={<StepsRegister />} />
      </Routes>
    </Router>
  );
}

export default App;
