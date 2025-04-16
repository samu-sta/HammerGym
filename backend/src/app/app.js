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
import { GymRoutes } from '../routes/Gym.Routes.js';
import { MachineModelRoutes } from '../routes/MachineModel.Routes.js';
import { MachineRoutes } from '../routes/Machine.Routes.js';
import { UserRoutes } from '../routes/User.Routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const DEFAULT_PORT = 3000;

dotenv.config();
const PORT = process.env.PORT || DEFAULT_PORT;


export const createApp = () => {
  const app = express();
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));

  app.use('/user', UserRoutes());
  app.use('/trainer', TrainerRoutes());
  app.use('/gym', GymRoutes());
  app.use('/machine', MachineModelRoutes());
  app.use('/machines', MachineRoutes());
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