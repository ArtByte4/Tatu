import { z } from "zod";

export const LoginSchema = z.object({
  user_handle: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(45, "El nombre de usuario no debe superar los 45 caracteres"),
  password_hash: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginSchema = z.infer<typeof LoginSchema>;
