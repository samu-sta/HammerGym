import { Router } from 'express';
import TrainingController from '../controllers/Training.Controller.js';
import { authAccount } from '../middleware/auth.js';

export const TrainingRoutes = () => {
  const activityRouter = Router();
  const trainingController = new TrainingController();

  activityRouter.use(authAccount);

  activityRouter.get('/', trainingController.getUserAsignedTraining);
  return activityRouter;
}