import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { loginUser } from "../api/authApi";

export const useAuth = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [dataLogin, setDataLogin] = useState({
    user_handle: "",
    password_hash: "",
  });

  const handleChange = (e) => {
    setDataLogin({ ...dataLogin, [e.target.name]: e.target.value });
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(dataLogin);
      if (response.validation) {
        // console.log(response.user, response.id)
        login(response.user,  response.id); // Guardar el usuario en el store
        navigate("/");
      }
    } catch (error) {
      console.error("Error al iniciar sesion:", error);
    }
  };

  return {
    handleChange,
    handleSumbit,
  };
};
