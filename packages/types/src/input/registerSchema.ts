import { z } from "zod";

export const UserRegisterInput = z.object({
  name: z
    .string()
    .min(5, "Name must be atleast 5 characters long")
    .max(50, "Name must be atmax 50 characters long")
    .trim(),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be 8 characters long")
    .max(30, "Password must be 30 characters long")
    .trim(),
  username: z.string().min(5, "Username must be atleast 5 characters long"),
});

export type TUserRegistrationInput = z.infer<typeof UserRegisterInput>;
