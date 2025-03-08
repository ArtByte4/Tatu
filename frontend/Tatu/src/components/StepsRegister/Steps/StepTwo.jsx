import { useState, useEffect } from "react";

function StepTwo({formData, setFormData, nexStep, prevStep}) {
  const [localData, setLocalData] = useState({
    phoneNumber: formData.phoneNumber || "",
    userHandle: formData.userHandle || "",
    password: formData.password || "",
  });

  useEffect(() => {
    const { phoneNumber, userHandle, password } = localData;
    const isFormValid =
      phoneNumber.trim().length > 8 && // Mínimo 7 caracteres en el telefono
      userHandle.trim().length > 3 && // Mínimo 2 caracteres en el usuario
      password.trim().length >= 6; // password mínimo 6 caracteres

    setIsValid(isFormValid);
  }, [localData]);

  const [isValid, setIsValid] = useState(false);
  const handleChange = (e) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setFormData({ ...formData, ...localData });
    nexStep();
  };

  return (
    <>
      <input
        type="text"
        name="phoneNumber"
        placeholder="Número de teléfono"
        onChange={handleChange}
        value={localData.phoneNumber}
        
      />
      <input
        type="text"
        name="userHandle"
        placeholder="Nombre de usuario"
        onChange={handleChange}
        value={localData.userHandle}
        
      />
      <input
        type="password"
        name="password"
        placeholder="contraseña"
        onChange={handleChange}
        value={localData.password}
        
      />
       <button className={isValid ? "next-step" : "next-step-invalid"} disabled={!isValid} onClick={handleNext}>
        Siguiente
      </button>
      <button className="prev-step" onClick={prevStep}>
        Atras
      </button>
    </>
  );
}

export default StepTwo;
