
import { FormState } from "../types/formTypes";
import { LoginSchema } from '../validation/loginValidation';
import { useAuth } from "../hooks/useAuth";



export const login = async (_state: FormState, formData: FormData) => {
    const { performLogin } = useAuth();
    const validatedFields = LoginSchema.safeParse({
        user: formData.get("user_handle"),
        password: formData.get("password_hash"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const response = await performLogin(validatedFields.data);
  
}