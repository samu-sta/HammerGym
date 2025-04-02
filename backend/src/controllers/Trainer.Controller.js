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
}