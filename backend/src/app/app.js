import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { AccountRoutes } from '../routes/Account.Routes.js';
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

  app.use('/account', AccountRoutes());

  app.get('/', (req, res) => {
    res.send('Hello World');
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  return app;
}