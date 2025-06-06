import { instance } from "@/lib/axiosConfig";

interface ResponseValidationStepOne {
    message: string;
    field: string;
    valid: boolean;
}

interface EmailValidationInput {
    email_address: string;
}


export const emailValidation = async (data: EmailValidationInput
): Promise<ResponseValidationStepOne> => {

    try {
        const response = await instance.post<ResponseValidationStepOne>(
            "/api/users/register/verification/emailAddress",
            data,
        );
        return response.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        throw new Error("Error inesperado al validar el correo");
    }
};
