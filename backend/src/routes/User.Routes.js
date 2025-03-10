import { Router } from 'express';
import UserController from '../controllers/User.Controller.js';
import { authUser } from '../middleware/auth.js';

export const UserRoutes = ({ userModel }) => {
  const userRouter = Router();
  const userController = new UserController({ userModel });

  userRouter.post('/register', userController.register);
  userRouter.post('/login', userController.login);
  userRouter.post('/logout', userController.logout);
  userRouter.get('/profile', authUser, userController.getUser);
  userRouter.put('/profile', authUser, userController.updateUser);

  

  return userRouter;
}