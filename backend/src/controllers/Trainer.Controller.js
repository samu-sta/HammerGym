import TrainingModel from '../models/Training.js';
import UserModel from '../models/User.js';
import AccountModel from '../models/Account.js';
import MESSAGES from '../messages/messages.js';

export default class TrainerController {

  getTrainerAssignedUsers = async (req, res) => {
    const trainerId = req.account.id;

    try {
      const assignedUsers = await TrainingModel.findAll({
        where: { trainerId },
        attributes: [
          ['createdAt', 'assignedAt']
        ],
        include: [
          {
            model: UserModel,
            as: 'user',
            include: [
              {
                model: AccountModel,
                as: 'account',
                attributes: ['username', 'email']
              }
            ]
          }
        ],
        raw: true
      });

      if (assignedUsers.length === 0) {
        return res.status(404).json({ success: false, message: MESSAGES.NO_USERS_FOUND });
      }

      const results = assignedUsers.map(user => ({
        username: user['user.account.username'],
        email: user['user.account.email'],
        assignedAt: user.assignedAt
      }));

      return res.status(200).json({ success: true, users: results });
    }
    catch (error) {
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  }

  getAllTrainers = async (_req, res) => {
    try {
      const trainers = await TrainerModel.findAll({
        include: [{ model: AccountModel, as: "account" }]
      });
      return res.status(200).json({ success: true, trainers });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  getTrainerById = async (req, res) => {
    const { id } = req.params;
    try {
      const trainer = await TrainerModel.findByPk(id, {
        include: [{ model: AccountModel, as: "account" }]
      });
      if (!trainer) {
        return res.status(404).json({ success: false, message: "Entrenador no encontrado" });
      }
      return res.status(200).json({ success: true, trainer });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  createTrainer = async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const account = await AccountModel.create({ email, username, password });
      const trainer = await TrainerModel.create({ accountId: account.id });
      return res.status(201).json({ success: true, trainer });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  updateTrainer = async (req, res) => {
    const { id } = req.params;
    try {
      const trainer = await TrainerModel.findByPk(id);
      if (!trainer) {
        return res.status(404).json({ success: false, message: "Entrenador no encontrado" });
      }
      await trainer.update(req.body);
      return res.status(200).json({ success: true, trainer });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  deleteTrainer = async (req, res) => {
    const { id } = req.params;
    try {
      const trainer = await TrainerModel.findByPk(id);
      if (!trainer) {
        return res.status(404).json({ success: false, message: "Entrenador no encontrado" });
      }
      await trainer.destroy();
      return res.status(200).json({ success: true, message: "Entrenador eliminado correctamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

}