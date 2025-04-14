import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function StepTwo({ formData, setFormData, nexStep, prevStep }) {
  const [localData, setLocalData] = useState({
    phonenumber: formData.phonenumber || "",
    user_handle: formData.user_handle || "",
    password_hash: formData.password_hash || "",
  });

  useEffect(() => {
    const { phonenumber, user_handle, password_hash } = localData;
    const isFormValid =
      phonenumber.trim().length > 7 && // Mínimo 7 caracteres en el telefono
      user_handle.trim().length > 2 && // Mínimo 2 caracteres en el usuario
      password_hash.trim().length >= 6; // password mínimo 6 caracteres

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
      <label>
        <span>Número de teléfono</span>
        <input
          type="text"
          name="phonenumber"
          placeholder="Ingrese número de teléfono"
          onChange={handleChange}
          value={localData.phonenumber}
        />
      </label>
      <label>
        <span>Nombre de usuario</span>
        <input
          type="text"
          name="user_handle"
          placeholder="Ingrese nombre de usuario"
          onChange={handleChange}
          value={localData.user_handle}
        />
      </label>
      <label>
        <span>Contraseña</span>
        <input
          type="password"
          name="password_hash"
          placeholder="Ingrese la contraseña"
          onChange={handleChange}
          value={localData.password_hash}
        />
      </label>
      <button
        className={isValid ? "next-step" : "next-step-invalid"}
        disabled={!isValid}
        onClick={handleNext}
      >
        Siguiente
      </button>
      <button className="prev-step" onClick={prevStep}>
        Atras
      </button>
    </>
  );
}

StepTwo.propTypes = {
  formData: PropTypes.shape({
    phonenumber: PropTypes.string,
    user_handle: PropTypes.string,
    password_hash: PropTypes.string,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  nexStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
};

export default StepTwo;
