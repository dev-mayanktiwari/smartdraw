import { JobName } from "@repo/types";
import { QueueService } from "../queues/QueueService";

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  token: string
) => {
  try {
    const priorityQueue = QueueService.getPriorityQueue();
    await priorityQueue.add(JobName.SendPasswordResetEmail, {
      email,
      name,
      token,
    });
  } catch (error) {
    console.error(error);
  }
};
