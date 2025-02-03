import { Queue } from "bullmq";
import { QueueNames } from "@repo/types";
import redisConfig from "../config/redisConfig";

export const generalQueue = new Queue(QueueNames.GeneralQueue, {
  connection: redisConfig,
});
