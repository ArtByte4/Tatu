import { FormState } from "../types/formTypes";
import { LoginSchema } from "../validation/loginValidation";
import { loginUser } from "../api/authApi";

export const login = async (
  _state: FormState,
  formData: FormData,
): Promise<FormState> => {
  const validatedFields = LoginSchema.safeParse({
    user_handle: formData.get("user_handle"),
    password_hash: formData.get("password_hash"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await loginUser(validatedFields.data);
    if (response.validation) {
      return {
        message: "OK",
        userData: {
          user_handle: response.user,
          password_hash: validatedFields.data.password_hash,
          role_id: response.role,
        },
        userId: response.id,
      };
    } else {
      return {
        formError: response.message,
      };
    }
  } catch (error: any) {
    return {
      formError:
        error.response?.data?.message || "Error inesperado al iniciar sesión",
    };
  }
};
