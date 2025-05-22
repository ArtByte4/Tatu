import { useState, useEffect, ChangeEvent } from "react";
import { SignupStepThreeSchema } from "../../validation/registerValidation.ts";
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

interface StepThreeProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  prevStep: () => void;
  isShow: boolean;}

function StepThree({
  formData,
  setFormData,
  prevStep,
  isShow,
}: StepThreeProps) {
  const [errors, setErrors] = useState<
    | {
        birth_day: string[];
      }
    | undefined
  >({
    birth_day: [],
  });

  // const [localData, setLocalData] = useState<LocalData>({
  //   birth_day: formData.birth_day || "",
  // });
  // // const [isValid, setIsValid] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  //
  // useEffect(() => {
  //   const { birth_day } = localData;
  //   const isFormValid = birth_day !== ""; // fecha seleccionada
  //
  //   setIsValid(isFormValid);
  // }, [localData]);
  //
  const isFormValid = formData.birth_day !== "";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const userRegist = () => {
    const validatedFields = SignupStepThreeSchema.safeParse({
      birth_day: formData.birth_day ?? [],
    });
    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      setErrors({
        birth_day: fieldErrors.birth_day ?? [],
      });
      return;
    }

    setErrors({ birth_day: [] });

    // setFormData((prevData) => {
    //   const updatedData = { ...prevData, ...localData };
    //   return updatedData;
    // });
    //
    setIsReady(true); // Marca que los datos están listos para enviarse
    // registerUser(formData);
  };
  // useEffect(() => {
  //   if (isReady) {
  //     registerUser(formData);
  //     setIsReady(false); // Resetea la bandera para evitar reenvíos
  //   }
  // }, [formData, isReady, registerUser]);
  //
  return (
    <div className={isShow ? "step-visible" : "step-oculto"}>
      <label>
        <span>Fecha de cumpleaños</span>
        <input
          type="date"
          name="birth_day"
          value={formData.birth_day}
          placeholder="Fecha de nacimiento"
          onChange={handleChange}
          required
        />
        {errors.birth_day?.[0] && (
          <span className="error-auth">{errors.birth_day[0]}</span>
        )}
      </label>
      <button type="submit" disabled={!isFormValid} onClick={userRegist}>
        Registrarse
      </button>
      <button className="prev-step" onClick={prevStep}>
        Atras
      </button>
    </div>
  );
}

export default StepThree;
