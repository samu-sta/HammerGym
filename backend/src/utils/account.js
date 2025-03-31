import UserModel from "../models/User.js";


const whichAccount = async (accountId) => {
  try {
    const user = await UserModel.findOne({
      where: { accountId }
    });

    if (user) {
      return 'user';
    } else {
      return 'trainer';
    }
  } catch (error) {
    console.error('Error determining account type:', error);
    throw error;
  }
};

export {
  whichAccount
};