import { z } from "zod";

export const UserLoginInput = z.object({
  identifier: z.string(),
  password: z.string(),
});

export type TUserLoginInput = z.infer<typeof UserLoginInput>;
