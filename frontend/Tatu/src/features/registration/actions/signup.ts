import axios from "axios";
import { FormState } from "../types/formTypes";

export const signup = async (
  _state: FormState,
  formData: FormData,
  performLogin: (params: {
    user_handle: string;
    password_hash: string;
  }) => Promise<void>,
): Promise<FormState> => {
  const payload = {
    user_handle: formData.get("user_handle"),
    email_address: formData.get("email_address"),
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    phonenumber: formData.get("phonenumber"),
    password_hash: formData.get("password_hash"),
    birth_day: formData.get("birth_day"),
  };

  try {
    const response = await axios.post(
      "http://localhost:3000/api/users",
      payload,
    );
    console.log(payload);
    if (response.status === 201) {
      // Login automático tras registro exitoso
      const loginResult = await performLogin({
         user_handle: payload.user_handle as string,
         password_hash: payload.password_hash as string,
       });
      
      
      console.log("RESPONSE: ", response);

      if (loginResult.validation) {
        return {
          message: "Registro y login exitosos",
          userData: {
            user_handle: loginResult.user,
            password_hash: payload.password_hash as string,
            rol: loginResult.rol,
          },
          userId: loginResult.id,
        };
      } else {
        return {
          formError:
            "Registro exitoso, pero ocurrió un error al iniciar sesión.",
        };
      }
    }
  } catch (error: any) {
    const status = error.response?.status;
    const backendMsg = error.response?.data?.message;
    const field = error.response?.data?.field;

    if (field && backendMsg) {
      return {
        errors: {
          [field]: [backendMsg],
        },
        formError: backendMsg,
      };
    }

    return {
      formError: backendMsg || "Error inesperado al registrar usuario.",
    };
  }

  return {
    formError: "Error desconocido al registrar usuario.",
  };
};
