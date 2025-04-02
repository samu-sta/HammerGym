import { Router } from 'express';
import AccountController from '../controllers/Account.Controller.js';
import { authAccount } from '../middleware/auth.js';
import { authTrainer } from '../middleware/auth.js';

export const AccountRoutes = () => {
  const accountRouter = Router();
  const accountController = new AccountController();

  accountRouter.post('/register', accountController.register);
  accountRouter.post('/login', accountController.login);
  accountRouter.post('/logout', accountController.logout);
  accountRouter.get('/profile', authAccount, accountController.getUser);
  accountRouter.put('/profile', authAccount, accountController.updateUser);

  return accountRouter;
}