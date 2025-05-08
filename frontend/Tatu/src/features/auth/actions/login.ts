import { FormState } from "../types/formTypes";
import { LoginSchema } from "../validation/loginValidation";
import { loginUser } from "../api/authApi";

export const login = async (_state: FormState, formData: FormData): Promise<FormState> => {
  const validatedFields = LoginSchema.safeParse({
    user_handle: formData.get("user_handle"),
    password_hash: formData.get("password_hash"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const response = await loginUser(validatedFields.data);


  return {
    message: "OK",
    userData: validatedFields.data,
    userId: response.id,
  };
};
