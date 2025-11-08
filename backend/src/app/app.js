import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import setupAssociations from '../database/associations.js';
setupAssociations();
import { AccountRoutes } from '../routes/Account.Routes.js';
import { UserActivityRoutes } from '../routes/UserActivity.Routes.js';
import { TrainingRoutes } from '../routes/Training.Routes.js';
import { ProgressUserRoutes } from '../routes/ProgressUser.Routes.js';
import { ClassRoutes } from "../routes/Class.Routes.js";
import { ExercisesRoutes } from '../routes/Exercises.Routes.js';
import { TrainerRoutes } from '../routes/Trainer.Routes.js';
import TrainerDataRoutes from '../routes/TrainerData.Routes.js';
import { GymRoutes } from '../routes/Gym.Routes.js';
import { MachineModelRoutes } from '../routes/MachineModel.Routes.js';
import { MachineRoutes } from '../routes/Machine.Routes.js';
import { UserRoutes } from '../routes/User.Routes.js';
import MembershipRoutes from '../routes/Membership.Routes.js';
import { MembershipFeatureRoutes } from '../routes/MembershipFeature.Routes.js';
import ContractRoutes from '../routes/Contract.Routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import WebhookController from '../controllers/Webhook.Controller.js';

const DEFAULT_PORT = 3000;

dotenv.config();
const PORT = process.env.PORT || DEFAULT_PORT;
const FRONTEND_URL = process.env.BASE_URL || 'http://localhost:5173';


export const createApp = () => {
  const app = express();
  app.use(morgan('dev'));

  const webhookController = new WebhookController();

  app.post('/contracts/webhook',
    express.raw({ type: 'application/json' }),
    webhookController.handleStripeWebhook
  );

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
  }));

  app.use('/user', UserRoutes());
  app.use('/trainer', TrainerRoutes());
  app.use('/trainer-data', TrainerDataRoutes);
  app.use('/gym', GymRoutes());
  app.use('/machine-model', MachineModelRoutes());
  app.use('/machines', MachineRoutes());
  app.use('/account', AccountRoutes());
  app.use('/user-activity', UserActivityRoutes());
  app.use('/training', TrainingRoutes());
  app.use("/classes", ClassRoutes());
  app.use('/progress', ProgressUserRoutes());
  app.use('/api/exercises', ExercisesRoutes());
  app.use('/memberships', MembershipRoutes);
  app.use('/membership-features', MembershipFeatureRoutes());
  app.use('/contracts', ContractRoutes);

  app.get('/', (req, res) => {
    res.send('Hello World');
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  return app;
}