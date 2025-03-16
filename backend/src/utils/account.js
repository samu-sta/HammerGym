import UserModel from "../models/User.js";


const wichAccount = (accountId) => {
  if (UserModel.findOne({ where: { accountId } })) {
    return 'user';
  }
  return 'trainer';
}

export {
  wichAccount
}