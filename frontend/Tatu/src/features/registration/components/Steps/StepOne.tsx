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

  // Actualizar campo y limpiar error de ese campo (optimista)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Limpiar error en ese campo al cambiar para evitar mostrar errores antiguos
    setErrors(prev => {
      if (prev[name as keyof FormData]) {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      }
      return prev;
    });
  };

  // Validar campo localmente al perder foco (onBlur)
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Extraer validación para ese campo usando el esquema Zod
    // Esto es un truco para validar solo un campo del objeto
    const partialObj = { [name]: value };

    // Construir esquema parcial de Zod con solo ese campo
    // Para no repetir schema, usamos shape y pick
    const fieldSchema = SignupStepOnewSchema.pick({ [name as keyof FormData]: true });

    const result = fieldSchema.safeParse(partialObj);

    if (!result.success) {
      // Asignar error en ese campo
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors[name as keyof typeof fieldErrors] ?? ["Error inválido"],
      }));
    } else {
      // Quitar error si validó bien
      setErrors(prev => {
        if (prev[name as keyof FormData]) {
          const newErrors = { ...prev };
          delete newErrors[name as keyof FormData];
          return newErrors;
        }
        return prev;
      });
    }
  };

  const isFormValid =
    formData.first_name.trim() !== "" &&
    formData.last_name.trim() !== "" &&
    formData.email_address.trim() !== "" &&
    Object.keys(errors).length === 0;

  // Validación completa y remota al hacer clic en siguiente
  const handleNext = async () => {
    // Validación local completa
    const validated = SignupStepOnewSchema.safeParse({
      first_name: formData.first_name,
      last_name: formData.last_name,
      email_address: formData.email_address,
    });

    if (!validated.success) {
      const fieldErrors = validated.error.flatten().fieldErrors;
      setErrors(
        Object.fromEntries(
          Object.entries(fieldErrors).map(([k, v]) => [k, v ?? ["Error inválido"]])
        )
      );
      return;
    }

    // Validación remota de email
    const validationResponse = await StepOneValidation({
      email_address: formData.email_address,
    });

    if (!validationResponse.valid) {
      setErrors(prev => ({
        ...prev,
        email_address: validationResponse.message ? [validationResponse.message] : ["Email inválido"],
      }));
      return;
    }

    // Todo ok, limpiar errores y avanzar
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
