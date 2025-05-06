
export type FormState =
  | {
      errors?: {
        user_handle?: string[];
        password_hash?: string[];
      };
      message?: string;
    }
  | undefined;
