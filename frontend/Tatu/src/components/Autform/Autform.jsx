import "./Autform.css";

function Autform() {
  return (
    <section className="bg-autform">
      <div className="container-autform">
        <form action="" className="form-autform">
          <img src="../../public/img/Logo _ ART BYTE_White.png" alt="" />
          <input type="text" placeholder="usuario o correo electrónico" />
          <input type="password" placeholder="contraseña" />
          <input type="submit" value="Entrar" />
          <a href="#">¿Olvidaste tu contraseña?</a>
        </form>
        <div className="btn-register-authform">
          <p>
            ¿No tienes una cuenta? <a href="#">Registrate</a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Autform;
