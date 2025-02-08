import { httpMiddleware } from "@repo/auth";
import { Router } from "express";
import roomController from "../controllers/roomController";

const roomRouter: Router = Router();

roomRouter.get("/create-room", httpMiddleware, roomController.createRoom);