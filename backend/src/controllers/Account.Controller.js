import userSchema from "../schemas/UserSchema.js";
import argon2 from 'argon2';
import auth from '../utils/auth.js';
import MESSAGES from "../messages/messages.js";
import UserModel from "../models/User.js";
import AccountModel from "../models/Account.js";
import TrainerModel from "../models/Trainer.js";
import sequelize from '../database/database.js';
import { whichAccount } from "../utils/account.js";

export default class UserController {

  register = async (req, res) => {
    const result = userSchema.validateRegisterUser(req.body);

    if (!result.success) {
      return res.status(400).json({ success: false, message: MESSAGES.INVALID_DATA });
    }

    const existingAccount = await AccountModel.findOne({
      where: { email: result.data.email }
    });

    if (existingAccount) {
      return res.status(409).json({ success: false, message: MESSAGES.EMAIL_ALREADY_EXISTS });
    }

    const t = await sequelize.transaction();
    try {
      result.data.password = await argon2.hash(result.data.password);

      const account = await AccountModel.create(
        {
          email: result.data.email,
          password: result.data.password,
          username: result.data.username
        },
        { transaction: t }
      );

      console.log(result.data);

      if (result.data.role === 'trainer') {
        await TrainerModel.create({ accountId: account.id }, { transaction: t });
      }
      else if (result.data.role === 'user') {
        await UserModel.create({ accountId: account.id }, { transaction: t });
      }

      await t.commit();
      return res.status(201).send({ success: true });
    }
    catch (error) {
      await t.rollback();
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  }

  login = async (req, res) => {

    const result = userSchema.validateLoginUser(req.body);

    if (!result.success) {
      return res.status(400).json({ success: false, message: MESSAGES.INVALID_DATA });
    }

    try {
      const account = await AccountModel.findOne({
        where: { email: result.data.email }
      });

      if (!account) {
        return res.status(404).json({
          success: false,
          message: MESSAGES.INVALID_CREDENTIALS
        });
      }

      const isPasswordValid = await argon2.verify(account.password, result.data.password);

      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: MESSAGES.INVALID_CREDENTIALS });
      }

      const token = auth.createToken(account);
      const { password, id, ...userData } = account.dataValues;
      console.log(account.id);
      userData.role = await whichAccount(account.id);

      // Configuración de cookies para entorno de desarrollo
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Solo usar secure en producción
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
      };

      return res.status(200)
        .cookie('token', token, cookieOptions)
        .json({ success: true, account: userData });
    }
    catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  }

  logout = async (_req, res) => {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    };
    return res.status(200).clearCookie('token', cookieOptions).json({ success: true });
  }

  getUser = async (req, res) => {
    const { password, id, ...userData } = req.account.dataValues;
    userData.role = whichAccount(req.account.id);
    return res.status(200).json({ success: true, account: userData });
  }

  updateUser = async (req, res) => {
    const result = userSchema.validateUpdateUser(req.body);

    if (!result.success) {
      return res.status(400).json({ success: false, message: MESSAGES.INVALID_DATA });
    }

    try {
      if (result.data.password) {
        result.data.password = await argon2.hash(result.data.password);
      }

      const emailExists = await AccountModel.findOne({
        where: { email: result.data.email }
      });

      if (emailExists && emailExists.id !== req.account.id) {
        return res.status(409).json({ success: false, message: MESSAGES.EMAIL_ALREADY_EXISTS });
      }


      await AccountModel.update(
        {
          email: result.data.email,
          username: result.data.username,
          password: result.data.password
        },
        {
          where: { id: req.account.id }
        }
      );

      const resultUser = {
        ...req.account.dataValues,
        ...result.data,
      };
      const { password, id, ...userData } = resultUser
      userData.role = await whichAccount(req.account.id);
      console.log(userData);

      return res.status(200).json({ success: true, account: userData });
    }
    catch (error) {
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  }
}