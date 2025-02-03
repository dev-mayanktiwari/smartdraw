import { Router } from "express";
import passport from "passport";
import authController from "../controllers/authController";
import { httpMiddleware } from "@repo/auth";
import healthController from "../controllers/healthController";

const authRouter: Router = Router();

authRouter.post("/register", authController.register);
authRouter.post("/verify-email", authController.verifyEmail);
authRouter.post("/login", authController.login);
authRouter.post("/protectedRoute", httpMiddleware, healthController.self);

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  authController.handleGoogleCallback
);


export default authRouter;
