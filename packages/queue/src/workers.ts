import { generalQueueWorker } from "./workers/generalQueueWorker";
import { priorityQueueWorker } from "./workers/priorityQueueWorker";

function main() {
  try {
    const workers = [
      { worker: generalQueueWorker, name: "General Queue Worker" },
      { worker: priorityQueueWorker, name: "Priority Queue Worker" },
    ];

    workers.forEach(({ worker, name }) => {
      worker.on("error", (error: Error) => {
        console.error(`${name} encountered error`, error);
      });
      console.log(`${name} started`);
    });

    const shutdown = async () => {
      try {
        console.log("Shutting down workers");
        for (const { worker, name } of workers) {
          await worker.close();
          console.log(`${name} shutdown gracefully`);
        }
        process.exit(0);
      } catch (error) {
        console.error("Error while shutting down workers", error);
        process.exit(1);
      }
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.log("Error in starting workers", error);
    process.exit(1);
  }
}

main();
