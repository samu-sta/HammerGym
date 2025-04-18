import { Router } from 'express';
import { getUserContracts, createContract, getContractById } from '../controllers/Contract.Controller.js';
import { authAccount } from '../middleware/auth.js';

const router = Router();

// Get contract by ID
router.get('/:id', authAccount, getContractById);

// Get all contracts for a specific user
router.get('/user/:userId', authAccount, getUserContracts);

// Create a new contract
router.post('/', authAccount, createContract);

export default router;