import UserModel from '../models/User.js';
import AccountModel from '../models/Account.js';
import TrainerModel from '../models/Trainer.js';
import AdminModel from '../models/Admin.js';
import GymModel from '../models/Gym.js';
import UserActivityModel from '../models/UserActivity.js';
import TrainingModel from '../models/Training.js';
import TrainingDayModel from '../models/TrainingDay.js';
import SerieModel from '../models/Serie.js';
import ExerciseModel from '../models/Exercise.js';
import ProgressUserModel from '../models/UserProgress.js';

const setupAssociations = () => {

  /* Account Associations */

  // Account - User (One-to-One)
  AccountModel.hasOne(UserModel, {
    foreignKey: 'accountId',
    as: 'user'
  });

  UserModel.belongsTo(AccountModel, {
    foreignKey: 'accountId',
    as: 'account'
  });

  // Account - Trainer (One-to-One)
  AccountModel.hasOne(TrainerModel, {
    foreignKey: 'accountId',
    as: 'trainer'
  });

  TrainerModel.belongsTo(AccountModel, {
    foreignKey: 'accountId',
    as: 'account'
  });

  // Account - Admin (One-to-One)
  AccountModel.hasOne(AdminModel, {
    foreignKey: 'accountId',
    as: 'admin'
  });

  /* Training associations */
  TrainerModel.hasMany(TrainingModel, {
    foreignKey: 'trainerId',
    as: 'createdTrainings'
  });

  TrainingModel.belongsTo(TrainerModel, {
    foreignKey: 'trainerId',
    as: 'trainer'
  });

  // Relación User-Training (User recibe entrenamientos)
  UserModel.hasMany(TrainingModel, {
    foreignKey: 'userId',
    sourceKey: 'accountId',
    as: 'assignedTrainings'
  });

  TrainingModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    targetKey: 'accountId',
    as: 'user'
  });

  // Relación Training-TrainingDay (One-to-Many)
  TrainingModel.hasMany(TrainingDayModel, {
    foreignKey: 'trainingId',
    as: 'trainingDays'
  });

  TrainingDayModel.belongsTo(TrainingModel, {
    foreignKey: 'trainingId',
    as: 'training'
  });

  // ======= SERIES Y EJERCICIOS =======

  // Relación TrainingDay-Serie (One-to-Many)
  TrainingDayModel.hasMany(SerieModel, {
    foreignKey: 'idTrainingDay',
    as: 'series'
  });

  SerieModel.belongsTo(TrainingDayModel, {
    foreignKey: 'idTrainingDay',
  });

  // Exercise - Serie (One-to-Many)
  ExerciseModel.hasMany(SerieModel, {
    foreignKey: 'idExercise',
    as: 'series'
  });

  SerieModel.belongsTo(ExerciseModel, {
    foreignKey: 'idExercise',
    as: 'exercise'
  });

  AdminModel.belongsTo(AccountModel, {
    foreignKey: 'accountId',
    as: 'account'
  });

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

  // Relación User-ProgressUser (One-to-Many)
  UserModel.hasMany(ProgressUserModel, {
    foreignKey: 'userId',
    sourceKey: 'accountId',
    as: 'progress'
  }
  );
  ProgressUserModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    targetKey: 'accountId',
    as: 'user'
  });
  // Relación Training-ProgressUser (One-to-Many)
  TrainingModel.hasMany(ProgressUserModel, {
    foreignKey: 'trainingId',
    as: 'progress'
  }
  );
  ProgressUserModel.belongsTo(TrainingModel, {
    foreignKey: 'trainingId',
    as: 'training'
  });
  

  console.log('Associations set up successfully');
};

export default setupAssociations;