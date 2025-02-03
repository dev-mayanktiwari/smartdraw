import { JobName } from "@repo/types";
import { priorityQueue } from "../queues/generalQueue";

export const sendPasswordResetEmail = (
  email: string,
  name: string,
  token: string
) => {
  return priorityQueue.add(JobName.SendPasswordResetEmail, {
    email,
    name,
    token,
  });
};
