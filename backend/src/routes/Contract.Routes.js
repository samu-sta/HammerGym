import { Router } from 'express';
import { getUserContracts, createContract, getContractById, createCheckoutSession, handleStripeWebhook } from '../controllers/Contract.Controller.js';
import { authAccount, authUser } from '../middleware/auth.js';
import express from 'express';

const router = Router();

// Get all contracts for the authenticated user
router.get('/my-contracts', authUser, getUserContracts);

// Get contract by ID
router.get('/:id', authAccount, getContractById);

// Create a new contract (incluyendo procesamiento de pago)
router.post('/', authUser, createContract);

// Crear una nueva sesión de checkout con Stripe
router.post('/checkout-session', authUser, createCheckoutSession);

// Webhook para manejar eventos de Stripe (sin auth para permitir peticiones de Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;