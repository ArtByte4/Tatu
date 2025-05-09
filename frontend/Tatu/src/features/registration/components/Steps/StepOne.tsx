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
  first_name: string;
  last_name: string;
  email_address: string;
}


interface StepOneProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  nexStep: () => void;
}


function StepOne({ formData, setFormData, nexStep }: StepOneProps) {
  const [localData, setLocalData] = useState<LocalData>({
    first_name: formData.first_name || "",
    last_name: formData.last_name || "",
    email_address: formData.email_address || "",
  });

  useEffect(() => {
    const { first_name, last_name, email_address } = localData;
    const isFormValid =
      first_name.trim().length > 2 && // Mínimo 3 caracteres en el nombre
      last_name.trim().length > 2 && // Mínimo 3 caracteres en el usuario
      email_address.trim().length >= 8; // emial mínimo 6 caracteres

    setIsValid(isFormValid);
  }, [localData]);

  const [isValid, setIsValid] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setFormData((prevData) => ({ ...prevData, ...localData }));
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
          value={localData.first_name}
          required
        />
      </label>
      <label>
        <span>Apellidos</span>
        <input
        type="text"
        name="last_name"
        placeholder="Ingrese sus apellidos"
        onChange={handleChange}
        value={localData.last_name}
        required
      />
      </label>
      <label >
        <span>Correo electrónico</span>
      <input
        type="email"
        placeholder="Ingrese correo electrónico"
        name="email_address"
        onChange={handleChange}
        value={localData.email_address}
        required
      />
      </label>
      <button
        className={isValid ? "next-step" : "next-step-invalid"}
        disabled={!isValid}
        onClick={handleNext}
      >
        Siguiente
      </button>
    </>
  );
}

export default StepOne;
