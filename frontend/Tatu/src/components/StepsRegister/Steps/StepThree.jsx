import { useState, useEffect } from "react";

function StepThree({ formData, setFormData, prevStep, registerUser }) {
  const [localData, setLocalData] = useState({
    dateBirth: formData.dateBirth || "",
  });
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const { dateBirth } = localData;
    const isFormValid = dateBirth !== "" // fecha seleccionada

    setIsValid(isFormValid);
  }, [localData]);

  const handleChange = (e) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
  };

  const userRegist = () => {
    setFormData({ ...formData, ...localData });
    registerUser();

  };
  return (
    <>
      <input
        type="date"
        name="dateBirth"
        placeholder="Fecha de nacimiento"
        onChange={handleChange}
        required
      />
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
