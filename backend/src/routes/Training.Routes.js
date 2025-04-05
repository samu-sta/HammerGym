import { Router } from 'express';
import TrainingController from '../controllers/Training.Controller.js';
import { authUser, authTrainer } from '../middleware/auth.js';

export const TrainingRoutes = () => {
  const trainingRouter = Router();
  const trainingController = new TrainingController();


  trainingRouter.get('/', authUser, trainingController.getUserAsignedTraining);
  trainingRouter.get('/:userEmail', authTrainer, trainingController.getTrainingByUserEmail);
  trainingRouter.post('/', authTrainer, trainingController.createUserTraining);

  return trainingRouter;
}