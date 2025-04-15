import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AuthForm.css";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";

function Autform() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [dataLogin, setDataLogin] = useState({
    user_handle: "",
    password_hash: "",
  });

  const loginUser = () => {
    axios
      .post("http://localhost:3000/api/users/auth/login", dataLogin, {
        withCredentials: true, // Permite que el navegador almacene la cookie
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 5000, // Evita bloqueos por peticiones colgadas
      })
      .then((response) => {
        if (response.data.validation) {
          login(response.data.user); // Guardar el usuario en el store
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error al iniciar sesion:", error);
      });
  };

  const handleChange = (e) => {
    setDataLogin({ ...dataLogin, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-autform">
      <div className="container-autform">
        <form
          action=""
          className="form-autform"
          onSubmit={(e) => e.preventDefault()}
        >

          <img src="../../public/img/Logo _ ART BYTE_White.png" alt="" />
          <p>Iniciar sesión</p>
          <label >
            <span>Nombre de usuario</span>
            <input
              type="text"
              placeholder="Usuario o correo electrónico"
              name="user_handle"
              onChange={handleChange}
            />
          </label>

          <label >
            <span>Contraseña</span>
          <input
            type="password"
            placeholder="Contraseña"
            name="password_hash"
            onChange={handleChange}
          />
          </label>
          
          <button type="submit" onClick={loginUser}>
            Entrar
          </button>
          <a href="#">¿Olvidaste tu contraseña?</a>
        </form>

        <div className="btn-register-authform">
          <p>
            ¿No tienes una cuenta? <Link to="/register">Registrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Autform;
