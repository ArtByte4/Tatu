
import { Link } from "react-router-dom";
import "./Autform.css";

function Autform() {
  return (
    <div className="bg-autform">
      <div className="container-autform">
        <form action="" className="form-autform">
          <img src="../../public/img/Logo _ ART BYTE_White.png" alt="" />
          <input type="text" placeholder="usuario o correo electrónico" />
          <input type="password" placeholder="contraseña" />
          <button type="submit">Entrar</button>
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
