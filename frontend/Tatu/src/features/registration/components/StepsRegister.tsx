import { useActionState, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StepOne from "./Steps/StepOne";
import StepTwo from "./Steps/StepTwo";
import StepThree from "./Steps/StepThree";
import axios from "axios";
import { useAuth } from "../../auth/hooks/useAuth";
import { signup } from "../actions/signup";

interface FormData {
  user_handle: string;
  email_address: string;
  first_name: string;
  last_name: string;
  phonenumber: string;
  password_hash: string;
  birth_day: string;
}

interface FormState {
  errors: {
    [key: string]: string[]; // o string si solo hay un error por campo
  };
  formError?: string;
  message?: string;
  userData: {
    user_handle: string;
    password_hash: string;
    // rol?: string; // si lo necesitas después
  };
}

function StepsRegister() {
  const { performLogin } = useAuth();

  const steps = [StepOne, StepTwo, StepThree];
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState<FormData>({
    user_handle: "",
    email_address: "",
    first_name: "",
    last_name: "",
    phonenumber: "",
    password_hash: "",
    birth_day: "",
  });

  const initialFormState: FormState = {
    errors: {},
    formError: "",
    message: "",
    // userId: undefined,
    userData: {
      user_handle: "",
      password_hash: "",
      // rol: "",
    },
  };

  const [state, action, pending] = useActionState(signup, initialFormState);
  useEffect(() => {
    if (state?.message === "Registro exitoso" && state.userData) {
      performLogin({
        user_handle: state.userData.user_handle,
        password_hash: state.userData.password_hash,
      });
    }
  }, [state]);

  const nexStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="bg-autform">
      <div className="container-autform">
        <form action={action} className="form-autform">
          <img src="../../public/img/Logo _ ART BYTE_White.png" alt="" />
          <p>Crea una cuenta</p>
          {state?.formError && (
            <div className="form-global-error">{state.formError}</div>
          )}

          <StepOne
            formData={formData}
            setFormData={setFormData}
            nexStep={nexStep}
            isShow={step === 0 ? true : false}
          />
          <StepTwo
            formData={formData}
            setFormData={setFormData}
            nexStep={nexStep}
            prevStep={prevStep}
            isShow={step === 1 ? true : false}
          />
          <StepThree
            formData={formData}
            setFormData={setFormData}
            prevStep={prevStep}
            isShow={step === 2 ? true : false}
          />
        </form>
        <div className="btn-register-authform">
          <p>
            Ya tienes cuenta <Link to="/login">Inicia sesion</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default StepsRegister;
