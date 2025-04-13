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
<<<<<<< HEAD
import ScheduleModel from '../models/schedule.js';
import assistanceListModel from '../models/assistanceList.js';
=======
import assitanceListModel from '../models/assistanceList.js';
import ProgressUserModel from '../models/UserProgress.js';
>>>>>>> 2f6f5fcb02fca6680508b9b5153fb0aae9a9841a

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

<<<<<<< HEAD
  UserModel.hasMany(TrainingModel, {
=======
  // Relación User-Training (User recibe entrenamientos)
  UserModel.hasOne(TrainingModel, {
>>>>>>> 2f6f5fcb02fca6680508b9b5153fb0aae9a9841a
    foreignKey: 'userId',
    sourceKey: 'accountId',
    as: 'assignedTraining'
  });

  TrainingModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    targetKey: 'accountId',
    as: 'user'
  });

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
    foreignKey: 'userid',
    targetKey: 'accountId',
    as: 'user'
  });
  AttendanceModel.belongsTo(ClassModel, {
    foreignKey: 'classId',
    targetKey: 'id',
    as: 'class'
  });
  UserModel.hasMany(AttendanceModel, {
    foreignKey: 'userid',
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