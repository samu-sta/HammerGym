import sequelize from './database.js';
import UserModel from '../models/User.js';
import AccountModel from '../models/Account.js';
import AdminModel from '../models/Admin.js';
import TrainerModel from '../models/Trainer.js';
import GymModel from '../models/Gym.js';
import UserActivityModel from '../models/UserActivity.js';
import TrainingModel from '../models/Training.js';
import TrainingDayModel from '../models/TrainingDay.js';
import SerieModel from '../models/Serie.js';
import ExerciseModel from '../models/Exercise.js';
import ClassModel from '../models/Class.js';
import ScheduleModel from '../models/schedule.js';
import ProgressUserModel from '../models/UserProgress.js';
import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import argon2 from 'argon2';
import AttendanceModel from '../models/Attendance.js';
import setupAssociations from './associations.js';
import assitanceListModel from '../models/assistanceList.js';

dotenv.config();

const initDatabase = async () => {
  try {
    const tempSequelize = new Sequelize({
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      dialect: 'mysql'
    });
    console.log("Creating database...");

    await tempSequelize.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
    await tempSequelize.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    await tempSequelize.close();

    console.log("Database created successfully!");

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    setupAssociations();

    await sequelize.sync({ force: true });

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    await AccountModel.sync({ force: true });
    await GymModel.sync({ force: true });
    await ExerciseModel.sync({ force: true });

    await UserModel.sync({ force: true });
    await TrainerModel.sync({ force: true });
    await AdminModel.sync({ force: true });

    await TrainingModel.sync({ force: true });
    await UserActivityModel.sync({ force: true });

    await TrainingDayModel.sync({ force: true });

    await ProgressUserModel.sync({ force: true });

    await SerieModel.sync({ force: true });
    await ClassModel.sync({ force: true });
    await ScheduleModel.sync({ force: true });
    await AttendanceModel.sync({ force: true });
    await assitanceListModel.sync({ force: true });

    await sequelize.sync({ force: true });

    // Crear un gimnasio
    const gym = await GymModel.create({
      telephone: '123456789',
      location: 'Budapest',
      maxCapacity: 100,
      currentOccupancy: 0
    });

    // Crear ejercicios de ejemplo
    const exercises = await ExerciseModel.bulkCreate([
      {
        name: 'Bench Press',
        description: 'Lie on bench and press barbell upward',
        muscles: 'chest'
      },
      {
        name: 'Squat',
        description: 'Barbell on shoulders, bend knees and return to standing',
        muscles: 'legs'
      },
      {
        name: 'Deadlift',
        description: 'Lift barbell from floor using hip and leg strength',
        muscles: 'back'
      },
      {
        name: 'Pull-up',
        description: 'Hang from bar and pull yourself up',
        muscles: 'back'
      },
      {
        name: 'Bicep Curl',
        description: 'Curl dumbbell or barbell upward with elbows fixed',
        muscles: 'biceps'
      },
      {
        name: 'Shoulder Press',
        description: 'Press weights overhead from shoulder height',
        muscles: 'shoulders'
      },
      {
        name: 'Tricep Extension',
        description: 'Lower weight behind head and extend arms',
        muscles: 'triceps'
      },
      {
        name: 'Leg Press',
        description: 'Push platform away using leg strength',
        muscles: 'legs'
      }
    ]);

    // Crear cuentas de ejemplo
    const hashedPassword = await argon2.hash('password123');

    const trainerAccount = await AccountModel.create({
      email: 'trainer@example.com',
      username: 'TrainerPro',
      password: hashedPassword
    });

    const userAccount = await AccountModel.create({
      email: 'user@example.com',
      username: 'FitnessUser',
      password: hashedPassword
    });

    // Crear trainer y usuario
    const trainer = await TrainerModel.create({
      accountId: trainerAccount.id
    });

    const user = await UserModel.create({
      accountId: userAccount.id
    });

    // Crear un entrenamiento
    const training = await TrainingModel.create({
      trainerId: trainer.accountId,
      userId: user.accountId
    });

    // Días de entrenamiento que se van a crear
    const trainingDays = [
      { day: 'monday', focus: 'chest', exercises: [0, 5] },
      { day: 'wednesday', focus: 'back', exercises: [2, 3] },
      { day: 'friday', focus: 'legs', exercises: [1, 7] }
    ];

    // Crear días de entrenamiento y series
    for (const dayInfo of trainingDays) {
      const trainingDay = await TrainingDayModel.create({
        day: dayInfo.day,
        userId: user.accountId  // Reference userId instead of trainingId
      });

      for (const exerciseIndex of dayInfo.exercises) {
        const exercise = exercises[exerciseIndex];

        for (let i = 1; i <= 3; i++) {
          await SerieModel.create({
            idTrainingDay: trainingDay.id,
            idExercise: exercise.id,
            reps: 10 + (i * 2),
            weigth: 20 + (i * 5)
          });
        }
      }
    }

    const schedule = await ScheduleModel.create({
      startDate: '2023-10-01',
      endDate: '2023-12-31',
      start: '09:00:00', 
      end: '18:00:00'    
    });
    
    const classInstance = await ClassModel.create({
      name: 'Yoga Avanzado',
      description: 'Clase de yoga para niveles avanzados.',
      maxCapacity: 20,
      currentCapacity: 0,
      schedule: 'Lunes 10:00 AM - 12:00 PM',
      difficulty: 'medium',
      trainerId: trainer.id,
      scheduleid: schedule.id
    });
    
    await AttendanceModel.create({
      userId: account.id, // Usar account.id en lugar de user.id
      classId: classInstance.id,
      attendanceDate: new Date()
    });

    await assitanceListModel.create({
      userId: user.id,
      classId: classInstance.id,
      attendanceDate: new Date()
    });

    console.log('Database, tables, and sample data created successfully!');
    console.log('Created training plan ID:', training.id);
    console.log('Login credentials:');
    console.log('- User: user@example.com / password123');
    console.log('- Trainer: trainer@example.com / password123');

  } catch (error) {
    console.error('Error creating database:', error);
  }
};

initDatabase();