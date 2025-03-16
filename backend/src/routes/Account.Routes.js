import { Router } from 'express';
import AccountController from '../controllers/Account.Controller.js';
import { authAccount } from '../middleware/auth.js';

export const AccountRoutes = () => {
  const userRouter = Router();
  const accountController = new AccountController();

  userRouter.post('/register', accountController.register);
  userRouter.post('/login', accountController.login);
  userRouter.post('/logout', accountController.logout);
  userRouter.get('/profile', authAccount, accountController.getUser);
  userRouter.put('/profile', authAccount, accountController.updateUser);



  return userRouter;
}