import { JobName } from "@repo/types";
import { QueueService } from "../queues/QueueService";

export const sendPasswordChangeConfirmationEmail = async (
  email: string,
  name: string
) => {
  try {
    const generalQueue = QueueService.getGeneralQueue();
    await generalQueue.add(JobName.SendPasswordChangeConfirmationEmail, {
      email,
      name,
    });
  } catch (error) {
    console.error(error);
  }
};
