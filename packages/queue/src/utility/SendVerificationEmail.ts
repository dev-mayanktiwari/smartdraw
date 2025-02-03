import { JobName } from "@repo/types";
import { priorityQueue } from "../queues/generalQueue";

export const sendVerificationEmail = async (
  email: string,
  name: string,
  token: string,
  code: string
) => {
  return priorityQueue.add(JobName.SendVerificationEmail, {
    email,
    name,
    token,
    code,
  });
};
