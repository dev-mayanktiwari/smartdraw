import { Router } from "express";
import passport from "passport";
import authController from "../controllers/authController";
import { httpMiddleware } from "@repo/auth";

const authRouter: Router = Router();

// EMAIL LOGIN ROUTES
authRouter.post("/register", authController.register);
authRouter.put("/verify-email", authController.verifyEmail);
authRouter.post("/login", authController.login);
authRouter.put("/logout", httpMiddleware, authController.logout);
authRouter.put(
  "/change-password",
  httpMiddleware,
  authController.changePassword
);
authRouter.put("/forgot-password", authController.forgotPassword);
authRouter.put("/reset-password", authController.resetPassword);
authRouter.put("/refresh-token", authController.refreshToken);
authRouter.get("/self", httpMiddleware, authController.self);
authRouter.get("/auth-status", httpMiddleware, authController.authStatus);

// GOOGLE LOGIN ROUTES
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
