import { JobName, QueueNames } from "@repo/types";
import { Worker } from "bullmq";

import { sendWelcomeEmailNodemailer } from "@repo/email";
import { getRedisConfig } from "../config/redisConfig";
import { sendPasswordChangeConfirmationEmail } from "../utility";

// console.log(JSON.stringify(QueueNames));
export const generalQueueWorker = new Worker(
  String(QueueNames.GeneralQueue),
  async (job) => {
    const { name } = job;
    console.log("General Queue Worker Processing job", job.data);
    try {
      if (name === JobName.SendWelcomeEmail) {
        const { email, name } = job.data;
        
        await sendWelcomeEmailNodemailer(email, name);
      } else if (name === JobName.SendPasswordChangeConfirmationEmail) {
        const { email, name } = job.data;

        await sendPasswordChangeConfirmationEmail(email, name);
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
    connection: getRedisConfig(),
  }
);

generalQueueWorker.on("completed", (job) => {
  console.log("General Queue Worker Job Completed", job.data);
});

generalQueueWorker.on("failed", (job, error) => {
  console.error("General Queue Worker Job Failed", job?.data, error);
});
