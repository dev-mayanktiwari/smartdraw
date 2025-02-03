import { Queue } from "bullmq";
import { QueueNames } from "@repo/types";
import redisConfig from "../config/redisConfig";

export const priorityQueue = new Queue(QueueNames.PriorityQueue, {
  connection: redisConfig,
});
