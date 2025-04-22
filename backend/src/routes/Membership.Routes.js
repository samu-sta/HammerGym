import { Router } from 'express';
import { getAllMemberships, getMembershipById, createMembership, updateMembership, deleteMembership } from '../controllers/Membership.Controller.js';
import { authAdmin } from '../middleware/auth.js';

const router = Router();

// Get all memberships
router.get('/', getAllMemberships);

// Get membership by ID 
router.get('/:id', getMembershipById);

router.put('/:id', authAdmin, updateMembership);

// Create a new membership (protected, likely for admin use)
router.post('/', authAdmin, createMembership);

router.delete('/:id', authAdmin, deleteMembership);

export default router;