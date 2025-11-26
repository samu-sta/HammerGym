import { Router } from 'express';
import MachineController from '../controllers/Machine.Controller.js';
import { authAdmin } from '../middleware/auth.js';

export const MachineRoutes = () => {
  const machineRouter = Router();
  const machineController = new MachineController();

  // Rutas públicas
  machineRouter.get('/', machineController.getAllMachines);

  // Rutas protegidas (sólo admin) - ANTES de las rutas con parámetros
  machineRouter.get('/admin/datasets', authAdmin, machineController.getEquipmentDatasets);

  // La ruta específica debe ir antes que la ruta genérica
  machineRouter.get('/gym/:gymId', machineController.getMachinesByGymId);
  machineRouter.get('/:id', machineController.getMachineById);

  // Más rutas protegidas (sólo admin)
  machineRouter.post('/', authAdmin, machineController.createMachine);
  machineRouter.put('/:id', authAdmin, machineController.updateMachine);
  machineRouter.delete('/:id', authAdmin, machineController.deleteMachine);

  return machineRouter;
}