export interface FormState {
  errors?: {
    [key: string]: string[];
  };
  formError?: string;
  message?: string;
  userId?: number;
  userData?: {
    user_handle: string;
    password_hash: string;
    rol: string;
  };
}
