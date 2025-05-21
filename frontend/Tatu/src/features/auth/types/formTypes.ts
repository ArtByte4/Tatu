export type FormState =
  | {
      errors?: {
        user_handle?: string[];
        password_hash?: string[];
        rol?: number[];
      };
      message?: string;
      userId?: number;
      userData?: {
        user_handle: string;
        password_hash: string;
        rol: number;
      };
      formError?: string;
    }
  | undefined;
