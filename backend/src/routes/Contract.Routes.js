import { Router } from 'express';
import {
  getUserContracts,
  createCheckoutSession,
  createRenewalCheckoutSession,
  renewContract
} from '../controllers/Contract.Controller.js';
import { authAccount } from '../middleware/auth.js';

const router = Router();

// Rutas autenticadas
router.get('/my-contracts', authAccount, getUserContracts);
router.post('/checkout-session', authAccount, createCheckoutSession);

// Rutas para renovación de contratos
router.post('/:contractId/renewal-checkout-session', authAccount, createRenewalCheckoutSession);
router.post('/:contractId/renew', authAccount, renewContract);

export default router;