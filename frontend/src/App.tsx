import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthForm } from "@/features/auth";
import { StepsRegister } from "@/features/registration";
<<<<<<< HEAD
import { Explore, Perfil, AdminDashboard, Search } from "@/pages";
=======
import { Explore, Perfil, AdminDashboard, Messages } from "@/pages";
>>>>>>> 2de2b63d46b9eca10e9530e961891d93d550467d
import { PrivateRoute } from "@/components/PrivateRoute";
import { ProtectedRouteAdmin } from "./routes/ProtectedRouterAdmin";

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
              <Explore  />
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
        <Route
<<<<<<< HEAD
          path="/search"
          element={
            <PrivateRoute>
              <Search />
=======
          path="/messages"
          element={
            <PrivateRoute>
              <Messages />
>>>>>>> 2de2b63d46b9eca10e9530e961891d93d550467d
            </PrivateRoute>
          }
        />
         {/* Protegida para admin */}
        <Route element={<ProtectedRouteAdmin />}>
          <Route path="admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
      
    </Router>
  );
}

export default App;
