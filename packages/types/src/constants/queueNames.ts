export const QueueNames = {
  GeneralQueue: "general-queue",
  PriorityQueue: "priority-queue",
} as const;

export type TQueueNames = (typeof QueueNames)[keyof typeof QueueNames];
