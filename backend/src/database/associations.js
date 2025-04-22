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
import ProgressUserModel from '../models/UserProgress.js';
import ScheduleModel from '../models/Schedule.js';
import ScheduleDayModel from '../models/ScheduleDay.js';
import MachineModel from '../models/Machine.js';
import MachineModelModel from '../models/MachineModel.js';
import ContractModel from '../models/Contract.js';
import MembershipModel from '../models/Membership.js';
import MembershipFeatureModel from '../models/MembershipFeature.js';

const setupAssociations = () => {

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
    through: 'SignedUpIn',
    foreignKey: 'userId',
    otherKey: 'classId',
    as: 'registeredClasses'
  });

  ClassModel.belongsToMany(UserModel, {
    through: 'SignedUpIn',
    foreignKey: 'classId',
    otherKey: 'userId',
    as: 'registeredUsers'
  });


  UserModel.hasMany(ProgressUserModel, {
    foreignKey: 'userId',
    sourceKey: 'accountId',
    as: 'progress'
  });

  ProgressUserModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    targetKey: 'accountId',
    as: 'user'
  });

  UserModel.hasMany(AttendanceModel, {
    foreignKey: 'userId',
    sourceKey: 'accountId',
    as: 'attendances'
  });

  AttendanceModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    targetKey: 'accountId',
    as: 'user'
  });

  ClassModel.hasMany(AttendanceModel, {
    foreignKey: 'classId',
    sourceKey: 'id',
    as: 'attendances'
  });

  AttendanceModel.belongsTo(ClassModel, {
    foreignKey: 'classId',
    targetKey: 'id',
    as: 'class'
  });

  // Relación Schedule-Class (One-to-Many)
  ClassModel.hasOne(ScheduleModel, {
    foreignKey: 'classId',
    sourceKey: 'id',
    as: 'schedule'
  });

  ScheduleModel.belongsTo(ClassModel, {
    foreignKey: 'classId',
    targetKey: 'id',
    as: 'class'
  });

  // Relación Schedule-ScheduleDay 
  ScheduleModel.hasMany(ScheduleDayModel, {
    foreignKey: 'scheduleId',
    sourceKey: 'classId',
    as: 'scheduleDays'
  });

  ScheduleDayModel.belongsTo(ScheduleModel, {
    foreignKey: 'scheduleId',
    targetKey: 'classId',
    as: 'schedule'
  });

  TrainerModel.hasMany(ClassModel, {
    foreignKey: 'trainerId',
    sourceKey: 'accountId',
    as: 'classes'
  });
  ClassModel.belongsTo(TrainerModel, {
    foreignKey: 'trainerId',
    targetKey: 'accountId',
    as: 'trainer'
  });

  // Machine and MachineModel associations
  MachineModelModel.hasMany(MachineModel, {
    foreignKey: 'machineModelId',
    as: 'machines'
  });

  MachineModel.belongsTo(MachineModelModel, {
    foreignKey: 'machineModelId',
    as: 'model'
  });

  // Machine and Gym associations
  GymModel.hasMany(MachineModel, {
    foreignKey: 'gymId',
    as: 'machines'
  });

  MachineModel.belongsTo(GymModel, {
    foreignKey: 'gymId',
    as: 'gym'
  });

  // Contract and User associations
  UserModel.hasMany(ContractModel, {
    foreignKey: 'userId',
    as: 'contracts'
  });

  ContractModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'user'
  });

  // Contract and Membership associations
  MembershipModel.hasMany(ContractModel, {
    foreignKey: 'membershipId',
    as: 'contracts'
  });

  ContractModel.belongsTo(MembershipModel, {
    foreignKey: 'membershipId',
    as: 'membership'
  });

  // Membership and MembershipFeature associations
  MembershipModel.hasMany(MembershipFeatureModel, {
    foreignKey: 'membershipId',
    as: 'features'
  });

  MembershipFeatureModel.belongsTo(MembershipModel, {
    foreignKey: 'membershipId',
    as: 'membership'
  });

  console.log('Associations set up successfully');
};

export default setupAssociations;