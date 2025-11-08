/**
 * Servicio para formatear datos del sistema de decisión de entrenamiento
 * Transforma los datos del backend al formato esperado por el frontend
 */

/**
 * Calcula el número de semana del año
 * @param {Date} date - Fecha
 * @returns {number} Número de semana
 */
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Genera datos de progresión semanal desde las series de ejercicios
 * @param {Array} exercises - Array de ejercicios con sus series
 * @returns {Array} Datos de progresión por semana
 */
function generarProgresionSemanal(exercises) {
  const exercisesByWeek = {};

  exercises.forEach(exercise => {
    exercise.series.forEach(serie => {
      const date = new Date(serie.date);
      const weekNumber = getWeekNumber(date);
      const weekKey = `Sem ${weekNumber}`;
      
      if (!exercisesByWeek[weekKey]) {
        exercisesByWeek[weekKey] = { date: weekKey };
      }
      
      // Guardar el peso máximo de cada ejercicio por semana
      if (!exercisesByWeek[weekKey][exercise.exercise.name] || 
          exercisesByWeek[weekKey][exercise.exercise.name] < serie.weight) {
        exercisesByWeek[weekKey][exercise.exercise.name] = serie.weight;
      }
    });
  });

  // Convertir a array y ordenar por semana
  const progressionArray = Object.values(exercisesByWeek).sort((a, b) => {
    const numA = parseInt(a.date.split(' ')[1]);
    const numB = parseInt(b.date.split(' ')[1]);
    return numA - numB;
  });

  // Asegurar que todos los ejercicios existen en cada semana (con null si no hay datos)
  const allExerciseNames = exercises.map(ex => ex.exercise.name);
  progressionArray.forEach(week => {
    allExerciseNames.forEach(exerciseName => {
      if (!(exerciseName in week)) {
        week[exerciseName] = null;
      }
    });
  });

  return progressionArray.length > 0 ? progressionArray : [{ date: "Sem 1" }];
}

/**
 * Transforma los datos del backend al formato esperado por el sistema de decisión
 * @param {Object} backendData - Datos crudos del backend
 * @returns {Object} Datos formateados para el frontend
 */
export function transformarDatosDecision(backendData) {
  const { user, boneMeasures, exercises, summary } = backendData;

  // Agrupar medidas óseas por hueso desde los ejercicios
  // Cada ejercicio tiene sus propias medidas de huesos específicas
  const biomechanicalData = {};
  
  // Iterar sobre cada ejercicio y sus medidas de huesos
  exercises.forEach(exercise => {
    if (exercise.boneMeasures && exercise.boneMeasures.length > 0) {
      exercise.boneMeasures.forEach(bone => {
        const boneName = bone.boneName.charAt(0).toUpperCase() + bone.boneName.slice(1);
        
        if (!biomechanicalData[boneName]) {
          biomechanicalData[boneName] = [];
        }
        
        biomechanicalData[boneName].push({
          exercise: exercise.exercise.name,
          real: bone.real,
          ideal: bone.ideal
        });
      });
    }
  });

  // Generar datos de progresión desde las series agrupadas por semana
  const progressionData = generarProgresionSemanal(exercises);

  // Construir el objeto de respuesta formateado
  return {
    usuario: {
      id: user.userId.toString(),
      nombre: user.fullName || user.username,
      email: user.email,
    },
    perfil: {
      edad: user.age,
      genero: user.gender === 'male' ? 'Masculino' : user.gender === 'female' ? 'Femenino' : 'Otro',
      peso: user.weight,
      altura: Math.round(user.height * 100), // convertir m a cm
      pulsacionesReposo: user.restingBpm,
      duracionSesiones: Math.round(user.sessionDurationHours * 60), // convertir horas a minutos
    },
    riesgoMetabolico: {
      circunferenciaCintura: user.waistCircumferenceCm,
      circunferenciaCinturaMaxima: user.maxWaistCircumferenceCm,
      ratio: user.waistCircumferenceCm / user.maxWaistCircumferenceCm,
    },
    observaciones: `Usuario con ${summary.totalExercises} ejercicios diferentes. Índice de afinidad promedio: ${summary.averageAffinityIndex.toFixed(2)}. Eficiencia biomecánica promedio: ${summary.averageBiomechanicalEfficiency.toFixed(2)}.`,
    ejercicios: exercises.map(exercise => ({
      id: exercise.exercise.id.toString(),
      nombre: exercise.exercise.name,
      tipo: exercise.exercise.type,
      kpis: {
        indiceAfinidad: exercise.kpis.affinityIndex,
        eficienciaBiomecanica: exercise.kpis.biomechanicalEfficiency,
      }
    })),
    progresion: progressionData,
    biomecanica: biomechanicalData,
    metadata: {
      fechaConsulta: new Date().toISOString(),
      version: "2.0.0",
      fuente: "api-backend"
    }
  };
}
