import sequelize from './database.js';
import UserModel from '../models/User.js';
import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const initDatabase = async () => {
  try {

    const tempSequelize = new Sequelize({
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: 'localhost',
      dialect: 'mysql'
    });

    await tempSequelize.query('CREATE DATABASE IF NOT EXISTS `hammergym`');
    await tempSequelize.close();

    await UserModel.sync();
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