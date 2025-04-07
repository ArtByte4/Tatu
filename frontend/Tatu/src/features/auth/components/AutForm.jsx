import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Autform.css";
import { useState } from "react";

function Autform() {
  const navigate = useNavigate();

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
          <input
            type="text"
            placeholder="Usuario o correo electrónico"
            name="user_handle"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Contraseña"
            name="password_hash"
            onChange={handleChange}
          />
          <button type="submit" onClick={loginUser}>
            Entrar
          </button>
          <a href="#">¿Olvidaste tu contraseña?</a>
        </form>

        <div className="btn-register-authform">
          <p>
            ¿No tienes una cuenta? <Link to="/steps">Registrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Autform;
