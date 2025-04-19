import { Router } from 'express';
import { getUserContracts, createCheckoutSession } from '../controllers/Contract.Controller.js';
import { authAccount } from '../middleware/auth.js';

const router = Router();

// Rutas autenticadas
router.get('/my-contracts', authAccount, getUserContracts);
router.post('/checkout-session', authAccount, createCheckoutSession);

export default router;