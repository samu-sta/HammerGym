import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { AccountRoutes } from '../routes/Account.Routes.js';
import { UserActivityRoutes } from '../routes/UserActivity.Routes.js';
import { TrainingRoutes } from '../routes/Training.Routes.js';
import { ClassRoutes } from "../routes/Class.Routes.js";
import { GymRoutes } from '../routes/Gym.Routes.js';
import { MachineModelRoutes } from '../routes/MachineModel.Routes.js'; 
import { MachineRoutes } from '../routes/Machine.Routes.js'; 
import { ProgressUserRoutes } from '../routes/ProgressUser.Routes.js';
import { ExercisesRoutes } from '../routes/Exercises.Routes.js';
import setupAssociations from '../database/associations.js';
import { UserRoutes } from "../routes/User.Routes.js";
import { TrainerRoutes } from "../routes/Trainer.Routes.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authAccount, isAdmin } from '../middleware/auth.js';

const DEFAULT_PORT = 3000;

dotenv.config();
const PORT = process.env.PORT || DEFAULT_PORT;


export const createApp = () => {
  setupAssociations();
  const app = express();
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));

  app.use("/api/admin/users", authAccount, isAdmin, UserRoutes());
  app.use("/api/admin/trainers", authAccount, isAdmin, TrainerRoutes());
  app.use('/api/admin/gyms', authAccount, isAdmin, GymRoutes());
  app.use('/api/admin/machine-models', authAccount, isAdmin, MachineModelRoutes());
  app.use('/api/admin/machines', authAccount, isAdmin, MachineRoutes());
  app.use('/account', AccountRoutes());
  app.use('/user-activity', UserActivityRoutes());
  app.use('/training', TrainingRoutes());
  app.use("/classes", ClassRoutes());
  app.use('/progress', ProgressUserRoutes());
  app.use('/api/exercises', ExercisesRoutes());

  app.get('/', (req, res) => {
    res.send('Hello World');
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  return app;
}