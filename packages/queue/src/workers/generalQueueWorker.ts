import { JobName, QueueNames } from "@repo/types";
import { Worker } from "bullmq";
import redisConfig from "../config/redisConfig";

export const generalQueueWorker = new Worker(
  QueueNames.GeneralQueue,
  async (job) => {
    const { name } = job;
    console.log("General Queue Worker Processing job", job.data);
    try {
      if (name === JobName.SendWelcomeEmail) {
        const { email, name } = job.data;

        // TODO: SEND WELCOME EMAIL
      } else if (name === JobName.SendPasswordChangeConfirmationEmail) {
        const { email, name } = job.data;

        // TODO: SEND PASSWORD CHANGE CONFIRMATION EMAIL
      }
    } catch (error) {
      //   console.error("Error in general Queue Worker");
      console.error(
        "Error in general queue worker while processing job",
        job.data
      );
    }
  },
  {
    connection: redisConfig,
  }
);

generalQueueWorker.on("completed", (job) => {
  console.log("General Queue Worker Job Completed", job.data);
});

generalQueueWorker.on("failed", (job, error) => {
  console.error("General Queue Worker Job Failed", job?.data, error);
});
