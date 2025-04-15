import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthForm } from "@/features/auth";
import { StepsRegister } from "@/features/registration";
import { UserSuggested } from "@/features/explore";
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
          path="/perfil"
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />

        <Route path="/user" element={<UserSuggested />} />
      </Routes>
    </Router>
  );
}

export default App;
