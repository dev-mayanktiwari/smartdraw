import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import passport from "passport";
import helmet from "helmet";
import { AppConfig } from "./config";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import healthRouter from "./routes/healthRoutes";
import { ResponseMessage } from "@repo/types";
import { httpError } from "@repo/shared-utils";
import PassportGoogleStrategy from "./utils/passportGoogleStrategy";
import authRouter from "./routes/authRoutes";

const app: Application = express();
const PORT = AppConfig.get("PORT");

// Passport
passport.use(PassportGoogleStrategy);

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

// Routes
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);

//404 Handler
app.use((req: Request, _: Response, next: NextFunction) => {
  try {
    throw new Error(ResponseMessage.NOT_FOUND);
  } catch (error) {
    httpError(next, error, req, 404);
  }
});

// Global Error Handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`The server is running on PORT ${PORT}`);
});
