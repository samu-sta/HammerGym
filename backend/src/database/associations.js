import UserModel from '../models/User.js';
import GymModel from '../models/Gym.js';
import UserActivityModel from '../models/UserActivity.js';

const setupAssociations = () => {
  GymModel.hasMany(UserActivityModel, {
    foreignKey: 'gymId',
    as: 'activities'
  });

  UserActivityModel.belongsTo(GymModel, {
    foreignKey: 'gymId',
    as: 'gym'
  });

  UserModel.hasMany(UserActivityModel, {
    foreignKey: 'userId',
    sourceKey: 'accountId',
    as: 'activities'
  });

  UserActivityModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    targetKey: 'accountId',
    as: 'user'
  });

  console.log('Associations set up successfully');
};

export default setupAssociations;