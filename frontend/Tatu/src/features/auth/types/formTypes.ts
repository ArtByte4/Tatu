export type FormState =
  | {
      errors?: {
        user_handle?: string[];
        password_hash?: string[];
      };
      message?: string;
      userId?: number;
      userData?: {
        user_handle: string;
        password_hash: string;
      };
    }
  | undefined;
