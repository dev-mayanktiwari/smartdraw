import { Worker } from "bullmq";
import { JobName, QueueNames } from "@repo/types";
import redisConfig from "../config/redisConfig";

export const priorityQueueWorker = new Worker(
  QueueNames.PriorityQueue,
  async (job) => {
    const { name } = job;
    console.log("Priority Queue Worker Processing job", job.data);
    try {
      if (name === JobName.SendVerificationEmail) {
        const { email, name, token, code } = job.data;

        // TODO: SEND VERIFICATION EMAIL
      } else if (name === JobName.SendPasswordResetEmail) {
        const { email, name, token } = job.data;

        // TODO: SEND PASSWORD RESET EMAIL
      }
    } catch (error) {
      //   console.error("Error in priority Queue Worker");
      console.error(
        "Error in priority queue worker while processing job",
        job.data
      );
    }
  },
  {
    connection: redisConfig,
  }
);

priorityQueueWorker.on("completed", (job) => {
  console.log("Priority Queue Worker Job Completed", job.data);
});

priorityQueueWorker.on("failed", (job, error) => {
  console.error("Priority Queue Worker Job Failed", job?.data, error);
});
