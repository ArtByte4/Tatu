import { z } from "zod";

export const LoginSchema = z.object({
  user_handle: z
    .string()
    .nonempty({message: "Nombre de usuario es requerido"})
    .trim(),
  password_hash: z
    .string()
    .nonempty({message: "Contraseña requerida"})
    .trim(),
});

export type LoginSchema = z.infer<typeof LoginSchema>;
