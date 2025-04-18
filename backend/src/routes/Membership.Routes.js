import { Router } from 'express';
import { getAllMemberships, getMembershipById, createMembership } from '../controllers/Membership.Controller.js';
import { authAdmin } from '../middleware/auth.js';

const router = Router();

// Get all memberships
router.get('/', getAllMemberships);

// Get membership by ID 
router.get('/:id', getMembershipById);

// Create a new membership (protected, likely for admin use)
router.post('/', authAdmin, createMembership);

export default router;