import { JobName } from "@repo/types";
import { generalQueue } from "../queues/priorityQueue";

export const sendPasswordChangeConfirmationEmail = (
  email: string,
  name: string
) => {
  return generalQueue.add(JobName.SendPasswordChangeConfirmationEmail, {
    email,
    name,
  });
};
