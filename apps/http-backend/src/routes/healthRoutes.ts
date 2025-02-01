import { Router } from "express";
import { httpAuthMiddleware } from "@repo/auth";
import healthController from "../controllers/healthController";

const healthRouter: Router = Router();

healthRouter.get("/self", healthController.self);
healthRouter.get("/health", healthController.health);
healthRouter.get("/generateToken", healthController.generateToken)
healthRouter.get(
  "/protectedRoute",
  httpAuthMiddleware(),
  healthController.self
);

export default healthRouter;
