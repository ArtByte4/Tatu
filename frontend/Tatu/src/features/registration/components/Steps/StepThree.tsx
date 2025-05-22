import { useState, ChangeEvent, FocusEvent } from "react";
import { SignupStepThreeSchema } from "../../validation/registerValidation";

interface FormData {
  user_handle: string;
  email_address: string;
  first_name: string;
  last_name: string;
  phonenumber: string;
  password_hash: string;
  birth_day: string;
}

interface StepThreeProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  prevStep: () => void;
  isShow: boolean;
}

function StepThree({ formData, setFormData, prevStep, isShow }: StepThreeProps) {
  const [errors, setErrors] = useState<{ birth_day?: string[] }>({});
  const [isReady, setIsReady] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors.birth_day) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.birth_day;
        return newErrors;
      });
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const result = SignupStepThreeSchema.shape.birth_day.safeParse(value);

    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        birth_day: result.error.errors.map((err) => err.message),
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.birth_day;
        return newErrors;
      });
    }
  };

  const userRegist = () => {
    const validated = SignupStepThreeSchema.safeParse({
      birth_day: formData.birth_day,
    });

    if (!validated.success) {
      const fieldErrors = validated.error.flatten().fieldErrors;
      setErrors({
        birth_day: fieldErrors.birth_day ?? [],
      });
      return;
    }

    setErrors({});
    setIsReady(true);
    // Aquí puedes hacer la llamada a `registerUser(formData);`
  };

  const isFormValid = formData.birth_day !== "" && Object.keys(errors).length === 0;

  return (
    <div className={isShow ? "step-visible" : "step-oculto"}>
      <label>
        <span>Fecha de cumpleaños</span>
        <input
          type="date"
          name="birth_day"
          value={formData.birth_day}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Fecha de nacimiento"
          required
        />
        {errors.birth_day?.[0] && <span className="error-auth">{errors.birth_day[0]}</span>}
      </label>

      <button type="submit" disabled={!isFormValid} onClick={userRegist}>
        Registrarse
      </button>

      <button type="button" className="prev-step" onClick={prevStep}>
        Atrás
      </button>
    </div>
  );
}

export default StepThree;
