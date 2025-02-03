import { JobName } from "@repo/types";
import { generalQueue } from "../queues/priorityQueue";

export const sendWelcomeEmail = (email: string, name: string) => {
  return generalQueue.add(JobName.SendWelcomeEmail, {
    email,
    name,
  });
};
