import { useState, ChangeEvent, FormEvent  } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { loginUser } from "../api/authApi";

interface LoginFormData {
  user_handle: string;
  password_hash: string;
}


export const useAuth = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [dataLogin, setDataLogin] = useState<LoginFormData>({
    user_handle: "",
    password_hash: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDataLogin({ ...dataLogin, [e.target.name]: e.target.value });
  };

  const handleSumbit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await loginUser(dataLogin);
      if (response.validation) {
        login(response.user,  response.id);
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
