import { Worker } from "bullmq";
import { JobName } from "@repo/types";
import { getRedisConfig } from "../config/redisConfig";
import {
  sendEmailVerificationMailNodemailer,
  sendPasswordResetMailNodemailer,
} from "@repo/email";

export const priorityQueueWorker = new Worker(
  "priority-queue",
  async (job) => {
    const { name } = job;
    console.log("Priority Queue Worker Processing job", job.data);
    try {
      if (name === JobName.SendVerificationEmail) {
        const { email, name, token, code } = job.data;

        await sendEmailVerificationMailNodemailer(email, name, token, code);
      } else if (name === JobName.SendPasswordResetEmail) {
        const { email, name, token } = job.data;

        await sendPasswordResetMailNodemailer(email, name, token);
      }
    } catch (error) {
      //   console.error("Error in priority Queue Worker");
      console.error(
        "Error in priority queue worker while processing job",
        job.data
      );
      console.log("Priority queue worker error:", job.failedReason);
      console.log("Priority queue worker stack:", job.stacktrace);
      console.log("Error", error);
    }
  },
  {
    connection: getRedisConfig(),
  }
);

priorityQueueWorker.on("completed", (job) => {
  console.log("Priority Queue Worker Job Completed", job.data);
  
});

priorityQueueWorker.on("failed", (job, error) => {
  console.error("Priority Queue Worker Job Failed", job?.data, error);
  console.log("Priority queue worker error:", job?.failedReason);
  console.log("Priority queue worker stack:", job?.stacktrace);
  console.log("Error", error);
});
