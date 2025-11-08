import BoneMeasuresUser from '../models/BoneMeasuresUser.js';
import SerieModel from '../models/Serie.js';
import ExerciseModel from '../models/Exercise.js';
import BoneModel from '../models/Bone.js';
import TrainingDayModel from '../models/TrainingDay.js';

/**
 * Calcula el Affinity Index basado en:
 * - 25% progreso en peso levantado
 * - 75% promedio de sensaciones post-ejercicio
 * 
 * @param {number} userId - ID del usuario
 * @param {string} exerciseName - Nombre del ejercicio
 * @returns {Promise<number>} - Puntuación de afinidad (1-10)
 */
const calculateAffinityIndex = async (userId, exerciseName) => {
  try {
    console.log(`🔍 Calculando AffinityIndex - userId: ${userId}, ejercicio: ${exerciseName}`);
    
    // Obtener el ejercicio por nombre
    const exercise = await ExerciseModel.findOne({
      where: { name: exerciseName }
    });

    if (!exercise) {
      console.log(`❌ Ejercicio no encontrado: ${exerciseName}`);
      return 0;
    }

    console.log(`✅ Ejercicio encontrado - ID: ${exercise.id}`);

    // Obtener todas las series del usuario para este ejercicio, ordenadas por fecha
    const series = await SerieModel.findAll({
      where: {
        idExercise: exercise.id
      },
      include: [{
        model: TrainingDayModel,
        where: { userId: parseInt(userId) }, // Asegurar que sea número
        attributes: ['userId', 'date']
      }],
      order: [[TrainingDayModel, 'date', 'ASC']]
    });

    console.log(`� Series encontradas: ${series.length}`);
    if (series.length > 0) {
      console.log(`   Primera serie - Peso: ${series[0].weigth}, Última serie - Peso: ${series[series.length - 1].weigth}`);
    }

    if (!series || series.length === 0) {
      console.log(`⚠️  No hay series para userId: ${userId}, exerciseId: ${exercise.id}`);
      return 0;
    }

    // ===== CALCULAR PROGRESO DE PESO (25%) =====
    const firstWeight = series[0].weigth;
    const lastWeight = series[series.length - 1].weigth;
    const weightProgress = lastWeight - firstWeight;
    
    // Normalizar progreso a escala 1-10 (SÚPER GENEROSO)
    // Progreso de 3kg o más = 10 puntos (cualquier progreso pequeño da máximo)
    // Progreso de 0kg = 8 puntos (baseline casi perfecto)
    // Progreso negativo = mínimo 6 puntos (casi no se penaliza)
    let progressScore = 8 + (weightProgress / 3) * 2;
    progressScore = Math.max(6, Math.min(10, progressScore));

    // ===== CALCULAR PROMEDIO DE SENSACIONES (75%) =====
    const validSensations = series.filter(s => s.sensations !== null && s.sensations !== undefined);
    let sensationScore = 8; // Default casi perfecto si no hay datos
    
    if (validSensations.length > 0) {
      const avgSensations = validSensations.reduce((sum, s) => sum + s.sensations, 0) / validSensations.length;
      // Boost MAYOR a las sensaciones: sumar 1.5 puntos extra (máximo 10)
      sensationScore = Math.min(10, avgSensations + 1.5);
    }

    // ===== COMBINAR CON PESOS: 25% progreso + 75% sensaciones (sensaciones casi todo) =====
    const affinityScore = (progressScore * 0.25) + (sensationScore * 0.75);

    console.log(`✅ AffinityIndex calculado: ${affinityScore.toFixed(2)} (Progreso: ${progressScore.toFixed(2)}, Sensaciones: ${sensationScore.toFixed(2)})`);

    return parseFloat(affinityScore.toFixed(2));
  } catch (error) {
    console.error('❌ Error calculating affinity index:', error);
    return 0;
  }
};

/**
 * Calcula el Biomechanical Efficiency basado en las diferencias entre medidas ideales y reales de cada hueso
 * Puntuación 1-10: menor diferencia = mayor puntuación
 * 
 * @param {number} userId - ID del usuario
 * @param {string} exerciseName - Nombre del ejercicio
 * @returns {Promise<number>} - Puntuación de eficiencia biomecánica (1-10)
 */
const calculateBiomechanicalEfficiency = async (userId, exerciseName) => {
  try {
    console.log(`💪 Calculando BiomechanicalEfficiency - userId: ${userId}, ejercicio: ${exerciseName}`);
    
    // Obtener el ejercicio por nombre
    const exercise = await ExerciseModel.findOne({
      where: { name: exerciseName }
    });

    if (!exercise) {
      console.log(`❌ Ejercicio no encontrado: ${exerciseName}`);
      return 0;
    }

    console.log(`✅ Ejercicio encontrado - ID: ${exercise.id}`);

    // Obtener todas las medidas óseas del usuario para este ejercicio
    const boneMeasures = await BoneMeasuresUser.findAll({
      where: {
        userId: parseInt(userId), // Asegurar que sea número
        exerciseId: exercise.id
      },
      include: [{
        model: BoneModel,
        as: 'bone',
        attributes: ['name']
      }]
    });

    console.log(`� Medidas encontradas: ${boneMeasures.length}`);
    if (boneMeasures.length > 0) {
      console.log(`   Ejemplo: ${boneMeasures[0].bone.name} - Real: ${boneMeasures[0].real}, Ideal: ${boneMeasures[0].ideal}`);
    }

    if (!boneMeasures || boneMeasures.length === 0) {
      console.log(`⚠️  No hay medidas óseas para userId: ${userId}, exerciseId: ${exercise.id}`);
      return 0;
    }

    // Calcular la diferencia promedio entre ideal y real (mismo peso para cada hueso)
    let totalDifference = 0;
    const boneCount = boneMeasures.length;

    boneMeasures.forEach(measure => {
      const difference = Math.abs(measure.ideal - measure.real);
      totalDifference += difference;
    });

    const avgDifference = totalDifference / boneCount;

    // Convertir diferencia a puntuación (1-10)
    // Diferencia 0 cm = 10 puntos
    // Diferencia 10+ cm = 1 punto (más permisivo)
    // Escala lineal inversa
    let biomechanicalScore = 10 - (avgDifference * 0.9);
    biomechanicalScore = Math.max(1, Math.min(10, biomechanicalScore));

    console.log(`✅ BiomechanicalEfficiency calculado: ${biomechanicalScore.toFixed(2)} (Diferencia promedio: ${avgDifference.toFixed(2)}cm)`);

    return parseFloat(biomechanicalScore.toFixed(2));
  } catch (error) {
    console.error('❌ Error calculating biomechanical efficiency:', error);
    return 0;
  }
};

/**
 * Obtiene los KPIs completos para un usuario y ejercicio específico
 * Calcula dinámicamente desde la base de datos
 * 
 * @param {number} userId - ID del usuario
 * @param {string} exerciseName - Nombre del ejercicio
 * @returns {Promise<Object>} - Objeto con { affinityIndex, biomechanicalEfficiency }
 */
export const getExerciseKPI = async (userId, exerciseName) => {
  try {
    const [affinityIndex, biomechanicalEfficiency] = await Promise.all([
      calculateAffinityIndex(userId, exerciseName),
      calculateBiomechanicalEfficiency(userId, exerciseName)
    ]);

    return {
      affinityIndex,
      biomechanicalEfficiency
    };
  } catch (error) {
    console.error('Error getting exercise KPIs:', error);
    return {
      affinityIndex: 0,
      biomechanicalEfficiency: 0
    };
  }
};

/**
 * Obtiene la lista de todos los ejercicios disponibles en la base de datos
 * 
 * @returns {Promise<Array>} - Array de nombres de ejercicios
 */
export const getAllExerciseNames = async () => {
  try {
    const exercises = await ExerciseModel.findAll({
      attributes: ['name']
    });

    return exercises.map(ex => ex.name);
  } catch (error) {
    console.error('Error getting exercise names:', error);
    return [];
  }
};

/**
 * Obtiene todos los KPIs de un usuario para todos sus ejercicios realizados
 * 
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>} - Objeto con { exerciseName: { affinityIndex, biomechanicalEfficiency } }
 */
export const getUserKPIs = async (userId) => {
  try {
    // Obtener todos los ejercicios únicos que el usuario ha realizado
    const userSeries = await SerieModel.findAll({
      attributes: [],
      include: [{
        model: TrainingDayModel,
        where: { userId: userId },
        attributes: []
      }, {
        model: ExerciseModel,
        as: 'exercise',
        attributes: ['id', 'name']
      }],
      group: ['exercise.id', 'exercise.name']
    });

    const exerciseNames = [...new Set(userSeries.map(s => s.exercise.name))];

    // Calcular KPIs para cada ejercicio en paralelo
    const kpisPromises = exerciseNames.map(async (exerciseName) => {
      const kpis = await getExerciseKPI(userId, exerciseName);
      return { exerciseName, kpis };
    });

    const results = await Promise.all(kpisPromises);

    // Convertir array a objeto
    const userKPIs = {};
    results.forEach(({ exerciseName, kpis }) => {
      userKPIs[exerciseName] = kpis;
    });

    return userKPIs;
  } catch (error) {
    console.error('Error getting user all KPIs:', error);
    return {};
  }
};
