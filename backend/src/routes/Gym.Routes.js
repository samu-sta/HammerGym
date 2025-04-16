import { Router } from 'express';
import GymController from '../controllers/Gym.Controller.js';
import { authAdmin } from '../middleware/auth.js';

export const GymRoutes = () => {
  const gymRouter = Router();
  const gymController = new GymController();

  gymRouter.get('/', gymController.getAllGyms);
  gymRouter.get('/:id', gymController.getGymById);
  gymRouter.post('/', authAdmin, gymController.createGym);
  gymRouter.put('/:id', authAdmin, gymController.updateGym);
  gymRouter.delete('/:id', authAdmin, gymController.deleteGym);

  return gymRouter;
}