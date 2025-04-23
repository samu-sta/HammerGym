import { Router } from 'express';
import MembershipController from '../controllers/Membership.Controller.js';
import { authAdmin } from '../middleware/auth.js';

const router = Router();
const membershipController = new MembershipController();

// Get all memberships
router.get('/', membershipController.getAllMemberships);

// Get membership by ID 
router.get('/:id', membershipController.getMembershipById);

router.put('/:id', authAdmin, membershipController.updateMembership);

// Create a new membership (protected, likely for admin use)
router.post('/', authAdmin, membershipController.createMembership);

router.delete('/:id', authAdmin, membershipController.deleteMembership);

export default router;