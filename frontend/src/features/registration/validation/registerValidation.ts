import { z } from "zod";

export const SignupStepOnewSchema = z.object({
  first_name: z
    .string({
      required_error: "Nombres son requeridos",
    })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(30, "Los nombres no debe superar los 30 caracteres")
    .trim(),
  last_name: z
    .string()
    .min(3, "El apellido debe tener al menos 3 caracteres")
    .max(30, "El apellido no debe superar los 30 caracteres")
    .trim(),
  email_address: z
    .string()
    .nonempty({ message: "Correo electrónico requerido" })
    .pipe(
      z
        .string()
        .email({
          message: "Correo electrónico no válido",
        })
        .trim(),
    ),
});

export type SignupStepOnewSchema = z.infer<typeof SignupStepOnewSchema>;

export const SignupStepTwoSchema = z.object({
  phonenumber: z
    .string()
    .trim()
    .nonempty({ message: "El número de celular es requerido" })
    .regex(/^[0-9]+$/, "El número de teléfono solo puede contener dígitos")
    .regex(/^3\d{9}$/, "Número celular inválido")
    .min(7, "El número de teléfono debe tener al menos 7 caracteres")
    .max(15, "El número de teléfono no debe superar los 15 caracteres"),
  user_handle: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(30, "El nombre de usuario no debe superar los 30 caracteres")
    .trim(),
  password_hash: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(30, "La contraseña no debe superar los 30 caracteres")
    .trim(),
});

export type SignupStepTwoSchema = z.infer<typeof SignupStepTwoSchema>;

export const SignupStepThreeSchema = z.object({
  birth_day: z.string().superRefine((value, ctx) => {
    const date = new Date(value);
    const now = new Date();

    if (isNaN(date.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La fecha ingresada no es válida.",
      });
      return;
    }

    // Quitar parte horaria para comparar fechas exactas
    const dateOnly = new Date(date.toDateString());
    const todayOnly = new Date(now.toDateString());

    if (dateOnly >= todayOnly) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La fecha de nacimiento no puede ser hoy ni en el futuro.",
      });
      return;
    }

    const age = now.getFullYear() - date.getFullYear();
    const monthDiff = now.getMonth() - date.getMonth();
    const dayDiff = now.getDate() - date.getDate();

    const isOldEnough =
      age > 13 ||
      (age === 13 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));

    if (!isOldEnough) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debes tener al menos 13 años.",
      });
    }
  }),
});

export type SignupStepThreeSchema = z.infer<typeof SignupStepThreeSchema>;
