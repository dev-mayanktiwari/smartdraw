import { z } from "zod";

export const UserLoginInput = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type TUserLoginInput = z.infer<typeof UserLoginInput>;
