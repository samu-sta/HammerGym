import { Router } from 'express';
import {
  getMembershipFeatures,
  getMembershipFeatureById,
  createMembershipFeature,
  updateMembershipFeature,
  deleteMembershipFeature
} from '../controllers/MembershipFeature.Controller.js';
import { authAdmin } from '../middleware/auth.js';

export const MembershipFeatureRoutes = () => {
  const router = Router();

  // Rutas públicas
  router.get('/', getMembershipFeatures);
  router.get('/:id', getMembershipFeatureById);

  // Rutas protegidas (sólo para administradores)
  router.post('/', authAdmin, createMembershipFeature);
  router.put('/:id', authAdmin, updateMembershipFeature);
  router.delete('/:id', authAdmin, deleteMembershipFeature);

  return router;
};

export default MembershipFeatureRoutes;