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
import AttendanceModel from '../models/Attendance.js';
import ClassModel from '../models/Class.js';
import assitanceListModel from '../models/assistanceList.js';
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
  UserModel.hasOne(TrainingModel, {
    foreignKey: 'userId',
    sourceKey: 'accountId',
    as: 'assignedTraining'
  });

  TrainingModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    targetKey: 'accountId',
    as: 'user'
  });

  // Relación Training-TrainingDay (One-to-Many)
  TrainingModel.hasMany(TrainingDayModel, {
    foreignKey: 'userId',
    sourceKey: 'userId',
    as: 'trainingDays'
  });

  TrainingDayModel.belongsTo(TrainingModel, {
    foreignKey: 'userId',
    targetKey: 'userId',
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

  UserModel.belongsToMany(ClassModel, {
    through: AttendanceModel,
    foreignKey: 'userId',
    sourceKey: 'accountId',
    otherKey: 'classId'
  });

  ClassModel.belongsToMany(UserModel, {
    through: AttendanceModel,
    foreignKey: 'classId',
    otherKey: 'userId',
    targetKey: 'accountId'
  });

  assitanceListModel.belongsTo(ClassModel, {
    foreignKey: 'classId',
    as: 'class'
  });
  ClassModel.hasMany(assitanceListModel, {
    foreignKey: 'classId',
    as: 'assistanceList'
  });

  assitanceListModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'user'
  });

  UserModel.hasMany(assitanceListModel, {
    foreignKey: 'userId',
    as: 'assistanceList'
  });

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
  AttendanceModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    targetKey: 'accountId',
    as: 'user'
  });
  AttendanceModel.belongsTo(ClassModel, {
    foreignKey: 'classId',
    targetKey: 'id',
    as: 'class'
  });
  UserModel.hasMany(AttendanceModel, {
    foreignKey: 'userId',
    sourceKey: 'accountId',
    as: 'attendances'
  });
  ClassModel.hasMany(AttendanceModel, {
    foreignKey: 'classId',
    sourceKey: 'id',
    as: 'attendances'
  });

  console.log('Associations set up successfully');
};

export default setupAssociations;