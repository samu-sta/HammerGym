import { Router } from 'express';
import TrainerController from '../controllers/Trainer.Controller.js';
import { authTrainer, authAdmin } from '../middleware/auth.js';


export const TrainerRoutes = () => {
  const trainerRouter = Router();
  const trainerController = new TrainerController();


  trainerRouter.get('/assigned-users', authTrainer, trainerController.getTrainerAssignedUsers);
  trainerRouter.get('/statistics', authAdmin, trainerController.getTrainersStatistics);
  trainerRouter.get("/", authAdmin, trainerController.getAllTrainers);
  trainerRouter.get("/:id", authAdmin, trainerController.getTrainerById);
  trainerRouter.post("/", authAdmin, trainerController.createTrainer);
  trainerRouter.put("/:id", authAdmin, trainerController.updateTrainer);
  trainerRouter.delete("/:id", authAdmin, trainerController.deleteTrainer);

  return trainerRouter;
}