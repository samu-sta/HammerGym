import UserModel from "../models/User.js";
import AccountModel from "../models/Account.js";
import MESSAGES from "../messages/messages.js";
import updateUserSchema from "../schemas/UpdateUserSchema.js";

export default class UserController {
  getAllUsers = async (_req, res) => {
    try {
      const users = await UserModel.findAll({
        include: [{ model: AccountModel, as: "account" }]
      });

      const refactoredUsers = users.map(user => {
        const { account, accountId, ...userData } = user.dataValues;
        return {
          ...userData,
          id: account.id,
          email: account.email,
          username: account.username
        };
      });

      return res.status(200).json({ success: true, users: refactoredUsers });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  updateUser = async (req, res) => {
    const { id } = req.params;
    const result = updateUserSchema.validateUpdateUser(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_DATA,
        errors: result.error.format()
      });
    }

    try {
      const user = await UserModel.findByPk(id, {
        include: [{ model: AccountModel, as: "account" }]
      });

      if (!user) {
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }

      const accountData = {};
      accountData.email = result.data.email;
      accountData.username = result.data.username;

      await user.account.update(accountData);

      return res.status(200).json({ success: true });
    }
    catch (error) {
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