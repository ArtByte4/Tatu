import { useState, useEffect, ChangeEvent } from "react";
import { SignupStepTwoSchema } from "../../validation/registerValidation.ts";
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
interface StepTwoProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  nexStep: () => void;
  prevStep: () => void;
}

function StepTwo({
  formData,
  setFormData,
  nexStep,
  prevStep,
  isShow,
}: StepTwoProps) {
  const [errors, setErrors] = useState<
    | {
        phonenumber: string[];
        user_handle: string[];
        password_hash: string[];
      }
    | undefined
  >({
    phonenumber: [],
    user_handle: [],
    password_hash: [],
  });

  // const [localData, setLocalData] = useState<LocalData>({
  //   phonenumber: formData.phonenumber || "",
  //   user_handle: formData.user_handle || "",
  //   password_hash: formData.password_hash || "",
  // });
  //
  // useEffect(() => {
  //   const { phonenumber, user_handle, password_hash } = localData;
  //   const isFormValid =
  //     phonenumber.trim().length > 6 && // Mínimo 6 caracteres en el telefono
  //     user_handle.trim().length > 2 && // Mínimo 2 caracteres en el usuario
  //     password_hash.trim().length >= 6; // password mínimo 6 caracteres
  //
  //   setIsValid(isFormValid);
  // }, [localData]);
  //
  // const [isValid, setIsValid] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid =
    formData.phonenumber.trim() !== "" &&
    formData.user_handle.trim() !== "" &&
    formData.password_hash.trim() !== "";

  const handleNext = () => {
    // setFormData({ ...formData, ...localData });
    const validatedFields = SignupStepTwoSchema.safeParse({
      phonenumber: formData.phonenumber,
      user_handle: formData.user_handle,
      password_hash: formData.password_hash,
    });
    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      setErrors({
        phonenumber: fieldErrors.phonenumber ?? [],
        user_handle: fieldErrors.user_handle ?? [],
        password_hash: fieldErrors.password_hash ?? [],
      });
      return;
    }
    setErrors({ phonenumber: [], user_handle: [], password_hash: [] });
    nexStep();
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
          value={formData.phonenumber}
        />
        {errors.phonenumber?.[0] && (
          <span className="error-auth">{errors.phonenumber[0]}</span>
        )}
      </label>
      <label>
        <span>Nombre de usuario</span>
        <input
          type="text"
          name="user_handle"
          placeholder="Ingrese nombre de usuario"
          onChange={handleChange}
          value={formData.user_handle}
        />
        {errors.user_handle?.[0] && (
          <span className="error-auth">{errors.user_handle[0]}</span>
        )}
      </label>
      <label>
        <span>Contraseña</span>
        <input
          type="password"
          name="password_hash"
          placeholder="Ingrese la contraseña"
          onChange={handleChange}
          value={formData.password_hash}
        />
        {errors.password_hash?.[0] && (
          <span className="error-auth">{errors.password_hash[0]}</span>
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
      <button className="prev-step" onClick={prevStep} type="button">
        Atras
      </button>
    </div>
  );
}

export default StepTwo;
