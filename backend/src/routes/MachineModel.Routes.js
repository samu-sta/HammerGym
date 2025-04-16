import { Router } from 'express';
import MachineModelController from '../controllers/MachineModel.Controller.js';
import { authAdmin } from '../middleware/auth.js';

export const MachineModelRoutes = () => {

  const machineModelRouter = Router();
  const machineModelController = new MachineModelController();

  machineModelRouter.use(authAdmin);

  machineModelRouter.get('/', machineModelController.getAllMachineModels);
  machineModelRouter.get('/:id', machineModelController.getMachineModelById);
  machineModelRouter.post('/', machineModelController.createMachineModel);
  machineModelRouter.put('/:id', machineModelController.updateMachineModel);
  machineModelRouter.delete('/:id', machineModelController.deleteMachineModel);

  return machineModelRouter;
}