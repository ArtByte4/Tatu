
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/AuthForm.css";


function Autform() {

  const { handleChange, handleSumbit } = useAuth();
  
  return (
    <div className="bg-autform">
      <div className="container-autform">
        <form
          className="form-autform"
          onSubmit={handleSumbit}
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
          
          <button type="submit">
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
