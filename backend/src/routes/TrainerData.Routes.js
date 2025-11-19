import { Router } from 'express';
import { getUserCompleteData } from '../controllers/TrainerData.Controller.js';
import { authTrainer } from '../middleware/auth.js';

const router = Router();

/**
 * @route GET /trainer-data/user/:email
 * @description Obtiene todos los datos de un usuario por email (series, medidas de huesos, datos personales, KPIs)
 * @access Trainer
 */
router.get(
  '/user/:email',
  authTrainer,
  getUserCompleteData
);

export default router;
