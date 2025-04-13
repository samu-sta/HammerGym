import { Router } from 'express';
import GymController from '../controllers/Gym.Controller.js';
import AdminModel from '../models/Admin.js'; 
import { authAccount, isAdmin } from '../middleware/auth.js';

export const GymRoutes = () => {
  const gymRouter = Router();
  const gymController = new GymController();

  gymRouter.use(authAccount, isAdmin);

  gymRouter.get('/', gymController.getAllGyms);
  gymRouter.get('/:id', gymController.getGymById);
  gymRouter.post('/', gymController.createGym);
  gymRouter.put('/:id', gymController.updateGym);
  gymRouter.delete('/:id', gymController.deleteGym);

  return gymRouter;
}