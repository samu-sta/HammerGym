import { Router } from 'express';
import UserActivityController from '../controllers/UserActivity.Controller.js';
import { authAccount } from '../middleware/auth.js';

export const UserActivityRoutes = () => {
  const activityRouter = Router();
  const userActivityController = new UserActivityController();

  activityRouter.use(authAccount);

  activityRouter.post('/', userActivityController.createActivity);
  activityRouter.get('/', userActivityController.getUserActivities);

  return activityRouter;
}