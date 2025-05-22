import { instance } from "@/lib/axiosConfig";

interface ResponseValidationStepTwo {
    message: string;
    field: string;
    valid: boolean;
}

interface handleValidationInput {
    user_handle: string;
}

interface phoneValidationInput {
    phonenumber: string;
}



export const handleValidate = async (data: handleValidationInput
): Promise<ResponseValidationStepTwo> => {

    try {
        const response = await instance.post<ResponseValidationStepTwo>(
            "/api/users/register/verification/userHandle",
            data,
        );
        return response.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        throw new Error("Error inesperado al validar el userHandle");
    }
};




export const phoneValidate = async (data: phoneValidationInput
): Promise<ResponseValidationStepTwo> => {

    try {
        const response = await instance.post<ResponseValidationStepTwo>(
            "/api/users/register/verification/phonenumber",
            data,
        );
        return response.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        throw new Error("Error inesperado al validar el phonenumber");
    }
};
