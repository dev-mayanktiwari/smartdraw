import { z } from "zod";


export const ChangePasswordSchema = z.object({
  currentPassword: z.string().trim(),
  newPassword: z
    .string()
    .min(8, "Password must be 8 characters long")
    .max(30, "Password must be 30 characters long")
    .trim(),
});

export type TChangePasswordSchema = z.infer<typeof ChangePasswordSchema>;