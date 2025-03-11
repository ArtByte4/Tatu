import { useState, useEffect } from "react";

function StepOne({ formData, setFormData, nexStep }) {

  const [localData, setLocalData] = useState({
    first_name: formData.first_name || "",
    last_name: formData.last_name || "",
    email_address: formData.email_address || "",
  });

  useEffect(() => {
    const { first_name, last_name, email_address } = localData;
    const isFormValid =
    first_name.trim().length > 2 && // Mínimo 3 caracteres en el nombre
    last_name.trim().length > 5 && // Mínimo 3 caracteres en el usuario
    email_address.trim().length >= 10; // emial mínimo 6 caracteres

    setIsValid(isFormValid);
  }, [localData]);


  const [isValid, setIsValid] = useState(false);
  const handleChange = (e) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setFormData((prevData) => ({ ...prevData, ...localData }));
    nexStep();
  }
  
  return (
    <>
      <input
        type="text"
        name="first_name"
        placeholder="Nombres"
        onChange={handleChange}
        value={localData.first_name}
        required
      />
      <input
        type="text"
        name="last_name"
        placeholder="Apellidos"
        onChange={handleChange} 
        value={localData.last_name}
        required
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        name="email_address"
        onChange={handleChange}
        value={localData.email_address}
        required
      />
      <button className={isValid ? "next-step" : "next-step-invalid"} disabled={!isValid} onClick={handleNext}>
        Siguiente
      </button>
    </>
  );
}

export default StepOne;
