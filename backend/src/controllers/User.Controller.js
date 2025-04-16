import UserModel from "../models/User.js";
import AccountModel from "../models/Account.js";
import MESSAGES from "../messages/messages.js";

export default class UserController {
  getAllUsers = async (_req, res) => {
    try {
      const users = await UserModel.findAll({
        include: [{ model: AccountModel, as: "account" }]
      });
      return res.status(200).json({ success: true, users });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  getUserById = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await UserModel.findByPk(id, {
        include: [{ model: AccountModel, as: "account" }]
      });
      if (!user) {
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }
      return res.status(200).json({ success: true, user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  createUser = async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const account = await AccountModel.create({ email, username, password });
      const user = await UserModel.create({ accountId: account.id });
      return res.status(201).json({ success: true, user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  updateUser = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await UserModel.findByPk(id);
      if (!user) {
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }
      await user.update(req.body);
      return res.status(200).json({ success: true, user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await UserModel.findByPk(id);
      if (!user) {
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }
      await user.destroy();
      return res.status(200).json({ success: true, message: "Usuario eliminado correctamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };
}