import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Autform from "./components/Autform/Autform";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Autform />} />
      </Routes>
    </Router>
  );
}

export default App;
