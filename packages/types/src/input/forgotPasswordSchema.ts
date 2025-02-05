import { z } from "zod";

export const ForgotUserSchema = z.object({
  email: z.string().email(),
});

export type TForgotUserSchema = z.infer<typeof ForgotUserSchema>;
