import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthForm } from "@/features/auth";
import { StepsRegister } from "@/features/registration";
import { Explore, Perfil } from "@/pages";
import { PrivateRoute } from "@/components/PrivateRoute";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<AuthForm />} />
        <Route path="/register" element={<StepsRegister />} />

        {/* Private Route */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Explore />
            </PrivateRoute>
          }
        />
        <Route
          path={'profile/:username'}
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
