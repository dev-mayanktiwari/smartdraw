import type { User } from "@repo/db";

export type UserWithoutSensitiveInfo = Pick<
  User,
  "id" | "email" | "name" | "username"
>;
