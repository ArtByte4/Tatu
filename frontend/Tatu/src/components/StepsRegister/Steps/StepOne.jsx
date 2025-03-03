import { useState, useEffect } from "react";

function StepOne({ formData, setFormData, nexStep }) {

  const [localData, setLocalData] = useState({
    firstName: formData.firstName || "",
    lastName: formData.lastName || "",
    emailAdress: formData.emailAdress || "",
  });

  useEffect(() => {
    const { firstName, lastName, emailAdress } = localData;
    const isFormValid =
    firstName.trim().length > 2 && // Mínimo 3 caracteres en el nombre
      lastName.trim().length > 5 && // Mínimo 3 caracteres en el usuario
      emailAdress.trim().length >= 10; // emial mínimo 6 caracteres

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
        name="firstName"
        placeholder="Nombres"
        onChange={handleChange}
        value={localData.firstName}
        required
      />
      <input
        type="text"
        name="lastName"
        placeholder="Apellidos"
        onChange={handleChange} 
        value={localData.lastName}
        required
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        name="emailAdress"
        onChange={handleChange}
        value={localData.emailAdress}
        required
      />
      <button className="next-step" disabled={!isValid} onClick={handleNext}>
        Siguiente
      </button>
    </>
  );
}

export default StepOne;
