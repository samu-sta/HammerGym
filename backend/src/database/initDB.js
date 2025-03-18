import sequelize from './database.js';
import UserModel from '../models/User.js';
import AccountModel from '../models/Account.js';
import AdminModel from '../models/Admin.js';
import TrainerModel from '../models/Trainer.js';
import GymModel from '../models/Gym.js';
import UserActivityModel from '../models/UserActivity.js';
import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import setupAssociations from './associations.js';
import { set } from 'zod';

dotenv.config();

const initDatabase = async () => {
  try {

    const tempSequelize = new Sequelize({
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      dialect: 'mysql'
    });
    console.log("Creating database...");

    await tempSequelize.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
    await tempSequelize.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    await tempSequelize.close();

    await AccountModel.sync({ force: true });
    await UserModel.sync({ force: true });
    await AdminModel.sync({ force: true });
    await TrainerModel.sync({ force: true });
    await GymModel.sync({ force: true });
    await UserActivityModel.sync({ force: true });

    await sequelize.sync({ force: true });
    GymModel.create({
      telephone: '123456789',
      location: 'Budapest',
      maxCapacity: 100,
      currentOccupancy: 0
    });

    console.log('Database & tables created!');
  } catch (error) {
    console.error('Error creating database:', error);
  }
};

initDatabase();