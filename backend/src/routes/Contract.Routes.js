import { Router } from 'express';
import {
  getUserContracts,
  createCheckoutSession,
  createRenewalCheckoutSession,
  renewContract,
  // Admin CRUD functions
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract
} from '../controllers/Contract.Controller.js';
import { authAccount, authAdmin } from '../middleware/auth.js';

const router = Router();

// Rutas autenticadas para usuarios
router.get('/my-contracts', authAccount, getUserContracts);
router.post('/checkout-session', authAccount, createCheckoutSession);

// Rutas para renovación de contratos
router.post('/:contractId/renewal-checkout-session', authAccount, createRenewalCheckoutSession);
router.post('/:contractId/renew', authAccount, renewContract);

// Rutas administrativas (CRUD)
router.get('/admin', authAdmin, getAllContracts);
router.get('/admin/:id', authAdmin, getContractById);
router.post('/admin', authAdmin, createContract);
router.put('/admin/:id', authAdmin, updateContract);
router.delete('/admin/:id', authAdmin, deleteContract);

export default router;