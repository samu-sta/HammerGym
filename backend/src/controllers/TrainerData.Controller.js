import UserModel from '../models/User.js';
import AccountModel from '../models/Account.js';
import SerieModel from '../models/Serie.js';
import TrainingDayModel from '../models/TrainingDay.js';
import ExerciseModel from '../models/Exercise.js';
import BoneMeasuresUserModel from '../models/BoneMeasuresUser.js';
import BoneModel from '../models/Bone.js';
import { getExerciseKPI } from '../constants/KPIExercises.js';
import { transformarDatosDecision } from '../services/trainingDecisionService.js';

/**
 * Obtiene todos los datos de un usuario para el entrenador
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getUserCompleteData = async (req, res) => {
  try {
    const { email } = req.params;

    // 1. Buscar la cuenta por email
    const account = await AccountModel.findOne({
      where: { email: email }
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Cuenta no encontrada con ese email'
      });
    }

    // 2. Obtener datos del usuario
    const user = await UserModel.findOne({
      where: { accountId: account.id },
      include: [{
        model: AccountModel,
        as: 'account',
        attributes: ['id', 'email', 'username']
      }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const userId = account.id;

    // 3. Obtener medidas de huesos por ejercicio
    const boneMeasures = await BoneMeasuresUserModel.findAll({
      where: { userId: userId },
      include: [
        {
          model: BoneModel,
          as: 'bone',
          attributes: ['id', 'name']
        },
        {
          model: ExerciseModel,
          as: 'exercise',
          attributes: ['id', 'name']
        }
      ]
    });

    // 4. Obtener todas las series con ejercicios
    const series = await SerieModel.findAll({
      include: [
        {
          model: TrainingDayModel,
          required: true,
          where: { userId: userId },
          attributes: ['id', 'date', 'userId', 'trainerId']
        },
        {
          model: ExerciseModel,
          as: 'exercise',
          attributes: ['id', 'name', 'type', 'description']
        }
      ],
      order: [[TrainingDayModel, 'date', 'DESC']]
    });

    // 5. Agrupar series por ejercicio y calcular KPIs
    const exercisesData = {};
    
    // Extraer el user_id del CSV desde el email (formato: user1@hammergym.com)
    const csvUserId = user.account.email.match(/user(\d+)@/)?.[1] || userId;
    
    series.forEach(serie => {
      const exerciseName = serie.exercise.name;
      
      if (!exercisesData[exerciseName]) {
        // Obtener KPIs para este ejercicio usando el CSV userId
        const kpis = getExerciseKPI(csvUserId, exerciseName);
        
        // Obtener medidas de huesos específicas para este ejercicio
        const exerciseBoneMeasures = boneMeasures
          .filter(bm => bm.exerciseId === serie.exercise.id)
          .map(bm => ({
            boneId: bm.boneId,
            boneName: bm.bone.name,
            real: bm.real,
            ideal: bm.ideal,
            difference: Math.round((bm.real - bm.ideal) * 100) / 100
          }));
        
        exercisesData[exerciseName] = {
          exercise: {
            id: serie.exercise.id,
            name: serie.exercise.name,
            type: serie.exercise.type,
            description: serie.exercise.description
          },
          kpis: {
            affinityIndex: kpis.affinityIndex,
            biomechanicalEfficiency: kpis.biomechanicalEfficiency
          },
          boneMeasures: exerciseBoneMeasures,
          series: [],
          statistics: {
            totalSeries: 0,
            averageWeight: 0,
            averageReps: 0,
            maxWeight: 0,
            totalWeightLifted: 0
          }
        };
      }

      // Agregar serie al ejercicio
      exercisesData[exerciseName].series.push({
        id: serie.id,
        date: serie.TrainingDay.date,
        reps: serie.reps,
        weight: serie.weigth,
        sensations: serie.sensations,
        injured: serie.injured,
        trainingDayId: serie.TrainingDay.id
      });

      // Actualizar estadísticas
      const stats = exercisesData[exerciseName].statistics;
      stats.totalSeries++;
      stats.totalWeightLifted += serie.weigth * serie.reps;
      stats.averageWeight = ((stats.averageWeight * (stats.totalSeries - 1)) + serie.weigth) / stats.totalSeries;
      stats.averageReps = ((stats.averageReps * (stats.totalSeries - 1)) + serie.reps) / stats.totalSeries;
      stats.maxWeight = Math.max(stats.maxWeight, serie.weigth);
    });

    // Redondear promedios
    Object.values(exercisesData).forEach(exercise => {
      exercise.statistics.averageWeight = Math.round(exercise.statistics.averageWeight * 100) / 100;
      exercise.statistics.averageReps = Math.round(exercise.statistics.averageReps * 100) / 100;
    });

    // 6. Formatear medidas de huesos globales (para backward compatibility si es necesario)
    const boneMeasuresFormatted = boneMeasures.map(bm => ({
      boneId: bm.boneId,
      boneName: bm.bone.name,
      exerciseId: bm.exerciseId,
      exerciseName: bm.exercise.name,
      real: bm.real,
      ideal: bm.ideal,
      difference: Math.round((bm.real - bm.ideal) * 100) / 100
    }));

    // 7. Construir respuesta completa
    const response = {
      success: true,
      data: {
        user: {
          userId: user.accountId,
          accountId: user.accountId,
          email: user.account.email,
          username: user.account.username,
          fullName: `${user.account.username}`,
          age: user.age,
          gender: user.gender,
          weight: user.weight,
          height: user.height,
          restingBpm: user.restingBpm,
          sessionDurationHours: user.sessionDurationHours,
          fatPercentage: user.fatPercentage,
          waistCircumferenceCm: user.waistCircumferenceCm,
          maxWaistCircumferenceCm: user.maxWaistCircumferenceCm,
          trainingGoal: user.trainingGoal
        },
        boneMeasures: boneMeasuresFormatted, // Todas las medidas (por ejercicio)
        exercises: Object.values(exercisesData), // Cada ejercicio incluye sus medidas específicas
        summary: {
          totalExercises: Object.keys(exercisesData).length,
          totalSeries: series.length,
          totalBoneMeasures: boneMeasures.length,
          averageAffinityIndex: Object.values(exercisesData).reduce((acc, ex) => acc + ex.kpis.affinityIndex, 0) / Object.keys(exercisesData).length || 0,
          averageBiomechanicalEfficiency: Object.values(exercisesData).reduce((acc, ex) => acc + ex.kpis.biomechanicalEfficiency, 0) / Object.keys(exercisesData).length || 0
        }
      }
    };

    // Redondear promedios del resumen
    response.data.summary.averageAffinityIndex = Math.round(response.data.summary.averageAffinityIndex * 100) / 100;
    response.data.summary.averageBiomechanicalEfficiency = Math.round(response.data.summary.averageBiomechanicalEfficiency * 100) / 100;

    // Transformar los datos usando el servicio antes de enviar al frontend
    const datosFormateados = transformarDatosDecision(response.data);

    return res.status(200).json({
      success: true,
      data: datosFormateados
    });

  } catch (error) {
    console.error('Error obteniendo datos completos del usuario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener datos del usuario',
      error: error.message
    });
  }
};
