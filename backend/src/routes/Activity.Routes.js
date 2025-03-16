import { Router } from 'express';
import ActivityController from '../controllers/Activity.Controller.js';
import { authUser } from '../middleware/auth.js';

export const ActivityRoutes = () => {
  const activityRouter = Router();
  const activityController = new ActivityController();

  activityRouter.use(authUser);

  activityRouter.post('/', activityController.createActivity);
  activityRouter.get('/', activityController.getUserActivities);

  return activityRouter;
}