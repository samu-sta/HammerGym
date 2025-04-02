import { Router } from "express";
import UserProgressController from "../controllers/ProgressUser.Controller.js";
import { authUser } from "../middleware/auth.js";
import { authAccount } from "../middleware/auth.js";
import { authTrainer } from "../middleware/auth.js";

export const ProgressUserRoutes = () => {
  const progressUserRouter = Router();
  const progressUserController = new UserProgressController();

  progressUserRouter.post("/", authUser, progressUserController.createProgress);
  progressUserRouter.get("/", authAccount, progressUserController.getProgress);
  progressUserRouter.get("/:userId", authTrainer, progressUserController.getProgressByUserId);

  return progressUserRouter;
};