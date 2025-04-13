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
import ScheduleModel from '../models/schedule.js';
import assistanceListModel from '../models/assistanceList.js';

const setupAssociations = () => {

  AccountModel.hasOne(UserModel, {
    foreignKey: 'accountId',
    as: 'user'
  });

  UserModel.belongsTo(AccountModel, {
    foreignKey: 'accountId',
    as: 'account'
  });

  AccountModel.hasOne(TrainerModel, {
    foreignKey: 'accountId',
    as: 'trainer'
  });

  TrainerModel.belongsTo(AccountModel, {
    foreignKey: 'accountId',
    as: 'account'
  });

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

  TrainingModel.hasMany(TrainingDayModel, {
    foreignKey: 'trainingId',
    as: 'trainingDays'
  });

  TrainingDayModel.belongsTo(TrainingModel, {
    foreignKey: 'trainingId',
    as: 'training'
  });

  TrainingDayModel.hasMany(SerieModel, {
    foreignKey: 'idTrainingDay',
    as: 'series'
  });

  SerieModel.belongsTo(TrainingDayModel, {
    foreignKey: 'idTrainingDay',
  });

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

  assistanceListModel.belongsTo(ClassModel, {
    foreignKey: 'classId',
    as: 'class'
  });
  ClassModel.hasMany(assistanceListModel, {
    foreignKey: 'classId',
    as: 'assistanceList'
  });
  
  assistanceListModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'user'
  });
  
  UserModel.hasMany(assistanceListModel, {
    foreignKey: 'userId',
    as: 'assistanceList'
  });

 

  console.log('Associations set up successfully');
};

export default setupAssociations;