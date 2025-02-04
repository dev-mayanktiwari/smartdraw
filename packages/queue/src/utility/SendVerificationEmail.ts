import { JobName } from "@repo/types";
import { QueueService } from "../queues/QueueService";

export const sendVerificationEmail = async (
  email: string,
  name: string,
  token: string,
  code: string
) => {
  try {
    const priorityQueue = QueueService.getPriorityQueue();
    await priorityQueue.add(JobName.SendVerificationEmail, {
      email,
      name,
      token,
      code,
    });
  } catch (error) {
    console.error(error);
  }
};
