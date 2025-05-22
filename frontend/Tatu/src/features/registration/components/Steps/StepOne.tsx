import { useState, ChangeEvent, FocusEvent } from "react";
import { SignupStepOnewSchema } from "../../validation/registerValidation";
import { StepOneValidation } from "../../api/StepOneValidation";

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

type ErrorsType = Partial<Record<keyof FormData, string[]>>;

function StepOne({ formData, setFormData, nexStep, isShow }: StepOneProps) {
  const [errors, setErrors] = useState<ErrorsType>({});

  const schemaShape = SignupStepOnewSchema.shape;

  // Validación individual de campo usando el schema shape
  const validateField = (
    name: keyof typeof schemaShape,
    value: string
  ): string[] => {
    const fieldSchema = schemaShape[name];
    const result = fieldSchema.safeParse(value);
    return result.success
      ? []
      : result.error.errors.map((e) => e.message || "Campo inválido");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar error en ese campo
    setErrors((prev) => {
      if (prev[name as keyof FormData]) {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      }
      return prev;
    });
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Solo validar campos existentes en el esquema
    if (
      name === "first_name" ||
      name === "last_name" ||
      name === "email_address"
    ) {
      const fieldErrors = validateField(name, value);

      if (fieldErrors.length > 0) {
        setErrors((prev) => ({
          ...prev,
          [name]: fieldErrors,
        }));
      } else {
        setErrors((prev) => {
          if (prev[name as keyof FormData]) {
            const newErrors = { ...prev };
            delete newErrors[name as keyof FormData];
            return newErrors;
          }
          return prev;
        });
      }
    }
  };

  const isFormValid =
    formData.first_name.trim() !== "" &&
    formData.last_name.trim() !== "" &&
    formData.email_address.trim() !== "" &&
    Object.keys(errors).length === 0;

  const handleNext = async () => {
    const validated = SignupStepOnewSchema.safeParse({
      first_name: formData.first_name,
      last_name: formData.last_name,
      email_address: formData.email_address,
    });

    if (!validated.success) {
      const fieldErrors = validated.error.flatten().fieldErrors;
      setErrors(
        Object.fromEntries(
          Object.entries(fieldErrors).map(([k, v]) => [
            k,
            v ?? ["Error inválido"],
          ])
        )
      );
      return;
    }

    const validationResponse = await StepOneValidation({
      email_address: formData.email_address,
    });

    if (!validationResponse.valid) {
      setErrors((prev) => ({
        ...prev,
        email_address: validationResponse.message
          ? [validationResponse.message]
          : ["Email inválido"],
      }));
      return;
    }

    setErrors({});
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
          onBlur={handleBlur}
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
          onBlur={handleBlur}
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
          name="email_address"
          placeholder="Ingrese correo electrónico"
          onChange={handleChange}
          onBlur={handleBlur}
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
