import { JobName } from "@repo/types";
import { QueueService } from "../queues/QueueService";

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const generalQueue = QueueService.getGeneralQueue();
    await generalQueue.add(JobName.SendWelcomeEmail, {
      email,
      name,
    });
  } catch (error) {
    console.error(error);
  }
};
