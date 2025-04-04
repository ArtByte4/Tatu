import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

function StepThree({ formData, setFormData, prevStep, registerUser }) {
  const [localData, setLocalData] = useState({
    birth_day: formData.birth_day || "",
  });
  const [isValid, setIsValid] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const { birth_day } = localData;
    const isFormValid = birth_day !== "" // fecha seleccionada

    setIsValid(isFormValid);
  }, [localData]);

  const handleChange = (e) => {
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
      <input
        type="date"
        name="birth_day"
        value={localData.birth_day}
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

StepThree.propTypes = {
  formData: PropTypes.shape({
    birth_day: PropTypes.string,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
  registerUser: PropTypes.func.isRequired,
};

export default StepThree;
