import { Link } from "react-router-dom";
import "../styles/AuthForm.css";
import { useActionState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { login } from "../actions/login";
import { useNavigate } from "react-router-dom";

function Autform() {
  const navigate = useNavigate();
  const { login: loginToStore } = useAuthStore();
  const [state, action, pending] = useActionState(login, undefined);

  useEffect(() => {
    if (state?.message === "OK" && state?.userData && state?.userId) {
      loginToStore(
        state.userData.user_handle,
        state.userId,
        state.userData.role_id
      );

      navigate("/");
    }
  }, [state]);

  return (
    <div className="bg-autform">
      <div className="container-autform">
        <form className="form-autform" action={action}>
          <img src="/img/Logo _ ART BYTE_White.png" alt="" />
          <p>Iniciar sesión</p>
          {state?.formError && (
            <div className="form-global-error">{state.formError}</div>
          )}
          <label>
            <span>Nombre de usuario</span>
            <input
              type="text"
              placeholder="Usuario o correo electrónico"
              name="user_handle"
              className={state?.errors?.user_handle?.[0] && "input-error"}
            />
            {state?.errors?.user_handle?.[0] && (
              <span className="error-auth">{state.errors.user_handle[0]}</span>
            )}
          </label>

          <label>
            <span>Contraseña</span>
            <input
              type="password"
              placeholder="Contraseña"
              name="password_hash"
              className={state?.errors?.password_hash?.[0] && "input-error"}
            />
            {state?.errors?.password_hash?.[0] && (
              <span className="error-auth">
                {state.errors.password_hash[0]}
              </span>
            )}
          </label>

          <button type="submit" disabled={pending}>
            {pending ? "Entrando..." : "Entrar"}
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
