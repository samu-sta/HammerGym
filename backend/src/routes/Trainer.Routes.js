import { Router } from "express";
import TrainerController from "../controllers/Trainer.Controller.js";
import { authAccount, isAdmin } from "../middleware/auth.js";

export const TrainerRoutes = () => {
  const router = Router();
  const trainerController = new TrainerController();

  router.use(authAccount, isAdmin);

  router.get("/", trainerController.getAllTrainers);
  router.get("/:id", trainerController.getTrainerById);
  router.post("/", trainerController.createTrainer);
  router.put("/:id", trainerController.updateTrainer);
  router.delete("/:id", trainerController.deleteTrainer);

  return router;
};