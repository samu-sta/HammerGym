import { Router } from 'express';
import ContractController from '../controllers/Contract.Controller.js';
import { authAccount, authAdmin } from '../middleware/auth.js';

const router = Router();
const contractController = new ContractController();

// Rutas autenticadas para usuarios
router.get('/my-contracts', authAccount, contractController.getUserContracts);
router.post('/checkout-session', authAccount, contractController.createCheckoutSession);

// Rutas para renovación de contratos
router.post('/:contractId/renewal-checkout-session', authAccount, contractController.createRenewalCheckoutSession);
router.post('/:contractId/renew', authAccount, contractController.renewContract);

// Rutas administrativas (CRUD)
router.get('/admin', authAdmin, contractController.getAllContracts);
router.get('/admin/:id', authAdmin, contractController.getContractById);
router.post('/admin', authAdmin, contractController.createContract);
router.put('/admin/:id', authAdmin, contractController.updateContract);
router.delete('/admin/:id', authAdmin, contractController.deleteContract);

export default router;