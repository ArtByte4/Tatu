import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import { AuthForm } from '@/features/auth'
import { StepsRegister } from "@/features/registration";
import { UserSuggested } from "@/features/explore";
import { Explore, Perfil } from "@/pages";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthForm />} />
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
