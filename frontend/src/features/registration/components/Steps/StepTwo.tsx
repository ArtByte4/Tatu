import { useState, ChangeEvent, FocusEvent } from "react";
import { SignupStepTwoSchema } from "../../validation/registerValidation";
import { handleValidate, phoneValidate } from "../../api/StepTwoValidation";

interface FormData {
  user_handle: string;
  email_address: string;
  first_name: string;
  last_name: string;
  phonenumber: string;
  password_hash: string;
  birth_day: string;
}

interface StepTwoProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  nexStep: () => void;
  prevStep: () => void;
  isShow: boolean;
}

type ErrorsType = Partial<Record<"user_handle" | "phonenumber" | "password_hash", string[]>>;

function StepTwo({ formData, setFormData, nexStep, prevStep, isShow }: StepTwoProps) {
  const [errors, setErrors] = useState<ErrorsType>({});

  const schemaShape = SignupStepTwoSchema.shape;

  const validateField = (name: keyof typeof schemaShape, value: string): string[] => {
    const fieldSchema = schemaShape[name];
    const result = fieldSchema.safeParse(value);
    return result.success ? [] : result.error.errors.map((e) => e.message || "Campo inválido");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      if (prev[name as keyof ErrorsType]) {
        const newErrors = { ...prev };
        delete newErrors[name as keyof ErrorsType];
        return newErrors;
      }
      return prev;
    });
  };

  const handleBlur = async (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "user_handle" || name === "phonenumber") {
      const fieldErrors = validateField(name, value);
      if (fieldErrors.length > 0) {
        setErrors((prev) => ({
          ...prev,
          [name]: fieldErrors,
        }));
        return;
      } else {
        try {
          let validationResponse;
          if (name === "user_handle") {
            validationResponse = await handleValidate({ user_handle: value });
          } else {
            validationResponse = await phoneValidate({ phonenumber: value });
          }
          if (!validationResponse.valid) {
            setErrors((prev) => ({
              ...prev,
              [name]: validationResponse.message ? [validationResponse.message] : ["Campo inválido"],
            }));
          } else {
            setErrors((prev) => {
              if (prev[name as keyof ErrorsType]) {
                const newErrors = { ...prev };
                delete newErrors[name as keyof ErrorsType];
                return newErrors;
              }
              return prev;
            });
          }
        } catch (error) {
          console.error("Error en validación remota:", error);
        }
      }
    } else if (name === "password_hash") {
      const fieldErrors = validateField("password_hash", value);
      if (fieldErrors.length > 0) {
        setErrors((prev) => ({
          ...prev,
          password_hash: fieldErrors,
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.password_hash;
          return newErrors;
        });
      }
    }
  };

  const isFormValid =
    formData.user_handle.trim() !== "" &&
    formData.phonenumber.trim() !== "" &&
    formData.password_hash.trim() !== "" &&
    Object.keys(errors).length === 0;

  const handleNext = async () => {
    const validated = SignupStepTwoSchema.pick({
      user_handle: true,
      phonenumber: true,
      password_hash: true,
    }).safeParse({
      user_handle: formData.user_handle,
      phonenumber: formData.phonenumber,
      password_hash: formData.password_hash,
    });

    if (!validated.success) {
      const fieldErrors = validated.error.flatten().fieldErrors;
      setErrors(
        Object.fromEntries(
          Object.entries(fieldErrors).map(([k, v]) => [k, v ?? ["Error inválido"]])
        ) as ErrorsType
      );
      return;
    }

    try {
      const userHandleResponse = await handleValidate({ user_handle: formData.user_handle });
      if (!userHandleResponse.valid) {
        setErrors((prev) => ({
          ...prev,
          user_handle: userHandleResponse.message ? [userHandleResponse.message] : ["Campo inválido"],
        }));
        return;
      }

      const phoneResponse = await phoneValidate({ phonenumber: formData.phonenumber });
      if (!phoneResponse.valid) {
        setErrors((prev) => ({
          ...prev,
          phonenumber: phoneResponse.message ? [phoneResponse.message] : ["Campo inválido"],
        }));
        return;
      }

      setErrors({});
      nexStep();
    } catch (error) {
      console.error("Error en validación remota al avanzar:", error);
    }
  };

  return (
    <div className={isShow ? "step-visible" : "step-oculto"}>
      <label>
        <span>Número de teléfono</span>
        <input
          type="text"
          name="phonenumber"
          placeholder="Ingrese número de teléfono"
          onChange={handleChange}
          onBlur={handleBlur}
          value={formData.phonenumber}
        />
        {errors.phonenumber?.[0] && <span className="error-auth">{errors.phonenumber[0]}</span>}
      </label>

      <label>
        <span>Nombre de usuario</span>
        <input
          type="text"
          name="user_handle"
          placeholder="Ingrese nombre de usuario"
          onChange={handleChange}
          onBlur={handleBlur}
          value={formData.user_handle}
        />
        {errors.user_handle?.[0] && <span className="error-auth">{errors.user_handle[0]}</span>}
      </label>

      <label>
        <span>Contraseña</span>
        <input
          type="password"
          name="password_hash"
          placeholder="Ingrese su contraseña"
          onChange={handleChange}
          onBlur={handleBlur}
          value={formData.password_hash}
        />
        {errors.password_hash?.[0] && <span className="error-auth">{errors.password_hash[0]}</span>}
      </label>

      <button
        type="button"
        className={isFormValid ? "next-step" : "next-step-invalid"}
        disabled={!isFormValid}
        onClick={handleNext}
      >
        Siguiente
      </button>

      <button type="button" className="prev-step" onClick={prevStep}>
        Atrás
      </button>
    </div>
  );
}

export default StepTwo;
