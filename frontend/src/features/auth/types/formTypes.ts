export type FormState =
  | {
      errors?: {
        user_handle?: string[];
        password_hash?: string[];
        role_id?: number[];
      };
      message?: string;
      userId?: number;
      userData?: {
        user_handle: string;
        password_hash: string;
        role_id: number;
      };
      formError?: string;
    }
  | undefined;
