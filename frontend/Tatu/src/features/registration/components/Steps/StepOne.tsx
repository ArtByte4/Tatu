import { useState, useEffect, ChangeEvent } from "react";
import { SignupStepOnewSchema } from "../../validation/registerValidation.ts";
//
// interface FormData {
//   user_handle: string;
//   email_address: string;
//   first_name: string;
//   last_name: string;
//   phonenumber: string;
//   password_hash: string;
//   birth_day: string;
// }
//
interface LocalData {
  first_name: string;
  last_name: string;
  email_address: string;
}

interface StepOneProps {
  formData: LocalData;
  setFormData: React.Dispatch<React.SetStateAction<LocalData>>;
  nexStep: () => void;
}

function StepOne({ formData, setFormData, nexStep }: StepOneProps) {
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
  // const [localData, setLocalData] = useState<LocalData>({
  //   first_name: formData.first_name || "",
  //   last_name: formData.last_name || "",
  //   email_address: formData.email_address || "",
  // });
  //
  // useEffect(() => {
  //   const { first_name, last_name, email_address } = localData;
  //   const isFormValid =
  //     first_name.trim().length > 2 && // Mínimo 3 caracteres en el nombre
  //     last_name.trim().length > 2 && // Mínimo 3 caracteres en el usuario
  //     email_address.trim().length >= 8; // emial mínimo 6 caracteres
  //
  //   setIsValid(isFormValid);
  // }, [localData]);
  //
  // const [isValid, setIsValid] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid =
    formData.first_name &&
    formData.last_name.trim() !== "" &&
    formData.email_address.trim() !== "";

  const handleNext = () => {
    const validatedFields = SignupStepOnewSchema.safeParse({
      first_name: formData.first_name ?? [],
      last_name: formData.last_name ?? [],
      email_address: formData.email_address ?? [],
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
    <>
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
        className={isFormValid ? "next-step" : "next-step-invalid"}
        disabled={!isFormValid}
        onClick={handleNext}
      >
        Siguiente
      </button>
    </>
  );
}

export default StepOne;
