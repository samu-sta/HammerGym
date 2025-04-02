import { Router } from 'express';
import TrainerController from '../controllers/Trainer.Controller.js';
import { authTrainer } from '../middleware/auth.js';


export const TrainerRoutes = () => {
  const trainerRouter = Router();
  const trainerController = new TrainerController();

  trainerRouter.use(authTrainer);

  trainerRouter.get('/assigned-users', trainerController.getTrainerAssignedUsers);

  return trainerRouter;
}