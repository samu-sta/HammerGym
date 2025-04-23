import { Router } from 'express';
import MachineController from '../controllers/Machine.Controller.js';
import { authAdmin } from '../middleware/auth.js';

export const MachineRoutes = () => {
  const machineRouter = Router();
  const machineController = new MachineController();

  // Rutas públicas
  machineRouter.get('/', machineController.getAllMachines);

  // La ruta específica debe ir antes que la ruta genérica
  machineRouter.get('/gym/:gymId', machineController.getMachinesByGymId);
  machineRouter.get('/:id', machineController.getMachineById);

  // Rutas protegidas (sólo admin)
  machineRouter.use(authAdmin);
  machineRouter.post('/', machineController.createMachine);
  machineRouter.put('/:id', machineController.updateMachine);
  machineRouter.delete('/:id', machineController.deleteMachine);

  return machineRouter;
}