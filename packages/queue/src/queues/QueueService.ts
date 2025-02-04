import { QueueNames } from "@repo/types";
import { Queue } from "bullmq";
import { getRedisConfig } from "../config/redisConfig";

export class QueueService {
  private static generalQueue: Queue | null = null;
  private static priorityQueue: Queue | null = null;

  public static getGeneralQueue(): Queue {
    if (!this.generalQueue) {
      this.generalQueue = new Queue(QueueNames.GeneralQueue, {
        connection: getRedisConfig(),
      });
    }

    return this.generalQueue;
  }

  public static getPriorityQueue(): Queue {
    if (!this.priorityQueue) {
      this.priorityQueue = new Queue(QueueNames.PriorityQueue, {
        connection: getRedisConfig(),
      });
    }

    return this.priorityQueue;
  }
}
