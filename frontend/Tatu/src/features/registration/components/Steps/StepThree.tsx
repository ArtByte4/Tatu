import { useState, useEffect, ChangeEvent } from "react";

interface FormData {
  user_handle: string;
  email_address: string;
  first_name: string;
  last_name: string;
  phonenumber: string;
  password_hash: string;
  birth_day: string;
}

interface LocalData {
  birth_day: string;
}

interface StepThreeProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  prevStep: () => void;
  registerUser: (data: FormData) => void; // Cambiado a FormData
}


function StepThree({ formData, setFormData, prevStep, registerUser }: StepThreeProps) {
  const [localData, setLocalData] = useState<LocalData>({
    birth_day: formData.birth_day || "",
  });
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const { birth_day } = localData;
    const isFormValid = birth_day !== ""; // fecha seleccionada

    setIsValid(isFormValid);
  }, [localData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
  };

  const userRegist = () => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, ...localData };
      return updatedData;
    });

    setIsReady(true); // Marca que los datos están listos para enviarse
  };
  useEffect(() => {
    if (isReady) {
      registerUser(formData);
      setIsReady(false); // Resetea la bandera para evitar reenvíos
    }
  }, [formData, isReady, registerUser]);

  return (
    <>
      <label>
        <span>Fecha de cumpleaños</span>
        <input
          type="date"
          name="birth_day"
          value={localData.birth_day}
          placeholder="Fecha de nacimiento"
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit" disabled={!isValid} onClick={userRegist}>
        Registrarse
      </button>
      <button className="prev-step" onClick={prevStep}>
        Atras
      </button>
    </>
  );
}


export default StepThree;
