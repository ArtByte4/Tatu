import { useState, ChangeEvent } from "react";
import { SignupStepOnewSchema } from "../../validation/registerValidation";
//
interface FormData {
  user_handle: string;
  email_address: string;
  first_name: string;
  last_name: string;
  phonenumber: string;
  password_hash: string;
  birth_day: string;
}

interface StepOneProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  nexStep: () => void;
  isShow: boolean;
}

function StepOne({ formData, setFormData, nexStep, isShow }: StepOneProps) {
  const [errors, setErrors] = useState<
    | {
        first_name: string[];
        last_name: string[];
        email_address: string[];
      }
    | undefined
  >({
    first_name: [],
    last_name: [],
    email_address: [],
  });
  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid =
    formData.first_name &&
    formData.last_name.trim() !== "" &&
    formData.email_address.trim() !== "";

  const handleNext = () => {
    const validatedFields = SignupStepOnewSchema.safeParse({
      first_name: formData.first_name,
      last_name: formData.last_name,
      email_address: formData.email_address,
    });
    // setFormData((prevData) => ({ ...prevData, ...localData }));

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      setErrors({
        first_name: fieldErrors.first_name ?? [],
        last_name: fieldErrors.last_name ?? [],
        email_address: fieldErrors.email_address ?? [],
      });
      return;
    }
    setErrors({ first_name: [], last_name: [], email_address: [] });
    nexStep();
  };

  return (
    <div className={isShow ? "step-visible" : "step-oculto"}>
      <label>
        <span>Nombres</span>

        <input
          type="text"
          name="first_name"
          placeholder="Ingrese su nombre"
          onChange={handleChange}
          value={formData.first_name}
          required
        />
        {errors.first_name?.[0] && (
          <span className="error-auth">{errors.first_name[0]}</span>
        )}
      </label>
      <label>
        <span>Apellidos</span>
        <input
          type="text"
          name="last_name"
          placeholder="Ingrese sus apellidos"
          onChange={handleChange}
          value={formData.last_name}
          required
        />
        {errors.last_name?.[0] && (
          <span className="error-auth">{errors.last_name[0]}</span>
        )}
      </label>
      <label>
        <span>Correo electrónico</span>
        <input
          type="email"
          placeholder="Ingrese correo electrónico"
          name="email_address"
          onChange={handleChange}
          value={formData.email_address}
          required
        />
        {errors.email_address?.[0] && (
          <span className="error-auth">{errors.email_address[0]}</span>
        )}
      </label>
      <button
        type="button"
        className={isFormValid ? "next-step" : "next-step-invalid"}
        disabled={!isFormValid}
        onClick={handleNext}
      >
        Siguiente
      </button>
    </div>
  );
}

export default StepOne;
