import UserModel from "../models/User.js";
import TrainerModel from "../models/Trainer.js";

const whichAccount = async (accountId) => {
  try {
    const user = await UserModel.findOne({
      where: { accountId }
    });

    if (user) {
      return 'user';
    }

    const trainer = await TrainerModel.findOne({
      where: { accountId }
    });
    if (trainer) {
      return 'trainer';
    }

    return 'admin';
  } catch (error) {
    console.error('Error determining account type:', error);
    throw error;
  }
};

export {
  whichAccount
};