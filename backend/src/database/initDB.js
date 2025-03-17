import sequelize from './database.js';
import UserModel from '../models/User.js';
import AccountModel from '../models/Account.js';
import AdminModel from '../models/Admin.js';
import TrainerModel from '../models/Trainer.js';
import Sequelize from 'sequelize';
import dotenv from 'dotenv';

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
    await AccountModel.sync();
    await UserModel.sync();
    await AdminModel.sync();
    await TrainerModel.sync();

    await sequelize.sync({ force: false });

    console.log('Database & tables created!');
  } catch (error) {
    console.error('Error creating database:', error);
  }
  finally {
    await sequelize.close();
  }
};

initDatabase();