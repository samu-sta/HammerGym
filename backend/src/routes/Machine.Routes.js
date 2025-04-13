import { Router } from 'express';
import MachineController from '../controllers/Machine.Controller.js';
import { authAccount, isAdmin } from '../middleware/auth.js';

export const MachineRoutes = () => {
  const machineRouter = Router();
  const machineController = new MachineController();

  machineRouter.use(authAccount, isAdmin);

  machineRouter.get('/', machineController.getAllMachines);
  machineRouter.get('/:id', machineController.getMachineById);
  machineRouter.post('/', machineController.createMachine);
  machineRouter.put('/:id', machineController.updateMachine);
  machineRouter.delete('/:id', machineController.deleteMachine);

  return machineRouter;
}