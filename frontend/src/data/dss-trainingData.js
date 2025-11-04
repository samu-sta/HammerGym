// Training data associated with specific users
// This structure makes it easy to fetch user-specific training data from a database

/**
 * Complete training data for a user including:
 * - Exercise progression over time
 * - Biomechanical measurements
 * - Selected exercises
 */

// Juan Pérez's training data
export const juanPerezTrainingData = {
  userId: "user1",
  userName: "Juan Pérez",
  
  // Weekly progression data for all exercises (20 weeks)
  progressionData: [
    { date: "Sem 1", "Press con Mancuernas": 40, "Press Militar": 45, "Press Banca": 65, "Press Inclinado": 55, "Fondos": 50, "Dominadas": 60, "Jalón al Pecho": 70, "Remo con Barra": 60, "Peso Muerto Rumano": 80, "Remo con Mancuerna": 35, "Sentadilla": 85, "Prensa de Piernas": 150, "Extensiones de Cuádriceps": 45, "Peso Muerto": 95, "Zancadas": 40 },
    { date: "Sem 2", "Press con Mancuernas": 42, "Press Militar": null, "Press Banca": 67, "Press Inclinado": 57, "Fondos": null, "Dominadas": 62, "Jalón al Pecho": 72, "Remo con Barra": null, "Peso Muerto Rumano": 82, "Remo con Mancuerna": 36, "Sentadilla": 87, "Prensa de Piernas": null, "Extensiones de Cuádriceps": 46, "Peso Muerto": 97, "Zancadas": null },
    { date: "Sem 3", "Press con Mancuernas": null, "Press Militar": 48, "Press Banca": 70, "Press Inclinado": null, "Fondos": 53, "Dominadas": null, "Jalón al Pecho": 74, "Remo con Barra": 63, "Peso Muerto Rumano": 84, "Remo con Mancuerna": null, "Sentadilla": 90, "Prensa de Piernas": 155, "Extensiones de Cuádriceps": null, "Peso Muerto": 100, "Zancadas": 43 },
    { date: "Sem 4", "Press con Mancuernas": 45, "Press Militar": 50, "Press Banca": null, "Press Inclinado": 60, "Fondos": 55, "Dominadas": 66, "Jalón al Pecho": null, "Remo con Barra": 65, "Peso Muerto Rumano": null, "Remo con Mancuerna": 38, "Sentadilla": 92, "Prensa de Piernas": 160, "Extensiones de Cuádriceps": 48, "Peso Muerto": null, "Zancadas": 45 },
    { date: "Sem 5", "Press con Mancuernas": 46, "Press Militar": null, "Press Banca": 74, "Press Inclinado": 62, "Fondos": null, "Dominadas": 68, "Jalón al Pecho": 78, "Remo con Barra": 67, "Peso Muerto Rumano": 88, "Remo con Mancuerna": null, "Sentadilla": null, "Prensa de Piernas": 162, "Extensiones de Cuádriceps": 49, "Peso Muerto": 105, "Zancadas": 46 },
    { date: "Sem 6", "Press con Mancuernas": null, "Press Militar": 53, "Press Banca": 77, "Press Inclinado": null, "Fondos": 58, "Dominadas": 70, "Jalón al Pecho": null, "Remo con Barra": 69, "Peso Muerto Rumano": 90, "Remo con Mancuerna": 40, "Sentadilla": 97, "Prensa de Piernas": null, "Extensiones de Cuádriceps": 50, "Peso Muerto": 107, "Zancadas": null },
    { date: "Sem 7", "Press con Mancuernas": 49, "Press Militar": 55, "Press Banca": 79, "Press Inclinado": 65, "Fondos": null, "Dominadas": null, "Jalón al Pecho": 82, "Remo con Barra": 71, "Peso Muerto Rumano": 92, "Remo con Mancuerna": 41, "Sentadilla": 99, "Prensa de Piernas": 168, "Extensiones de Cuádriceps": null, "Peso Muerto": 110, "Zancadas": 49 },
    { date: "Sem 8", "Press con Mancuernas": 50, "Press Militar": null, "Press Banca": null, "Press Inclinado": 67, "Fondos": 61, "Dominadas": 74, "Jalón al Pecho": 84, "Remo con Barra": null, "Peso Muerto Rumano": 94, "Remo con Mancuerna": null, "Sentadilla": 101, "Prensa de Piernas": 170, "Extensiones de Cuádriceps": 52, "Peso Muerto": null, "Zancadas": 50 },
    { date: "Sem 9", "Press con Mancuernas": null, "Press Militar": 58, "Press Banca": 83, "Press Inclinado": null, "Fondos": 63, "Dominadas": 76, "Jalón al Pecho": null, "Remo con Barra": 75, "Peso Muerto Rumano": null, "Remo con Mancuerna": 43, "Sentadilla": 103, "Prensa de Piernas": null, "Extensiones de Cuádriceps": 53, "Peso Muerto": 115, "Zancadas": null },
    { date: "Sem 10", "Press con Mancuernas": 53, "Press Militar": 60, "Press Banca": 85, "Press Inclinado": 70, "Fondos": 65, "Dominadas": 78, "Jalón al Pecho": 88, "Remo con Barra": 77, "Peso Muerto Rumano": 98, "Remo con Mancuerna": 44, "Sentadilla": 105, "Prensa de Piernas": 175, "Extensiones de Cuádriceps": 54, "Peso Muerto": 117, "Zancadas": 53 },
    { date: "Sem 11", "Press con Mancuernas": 54, "Press Militar": null, "Press Banca": 87, "Press Inclinado": 72, "Fondos": null, "Dominadas": null, "Jalón al Pecho": 90, "Remo con Barra": 79, "Peso Muerto Rumano": 100, "Remo con Mancuerna": null, "Sentadilla": 107, "Prensa de Piernas": 177, "Extensiones de Cuádriceps": null, "Peso Muerto": 119, "Zancadas": 54 },
    { date: "Sem 12", "Press con Mancuernas": null, "Press Militar": 63, "Press Banca": null, "Press Inclinado": 74, "Fondos": 68, "Dominadas": 82, "Jalón al Pecho": 92, "Remo con Barra": null, "Peso Muerto Rumano": 102, "Remo con Mancuerna": 46, "Sentadilla": null, "Prensa de Piernas": 180, "Extensiones de Cuádriceps": 56, "Peso Muerto": 121, "Zancadas": null },
    { date: "Sem 13", "Press con Mancuernas": 57, "Press Militar": 65, "Press Banca": 91, "Press Inclinado": null, "Fondos": 70, "Dominadas": 84, "Jalón al Pecho": null, "Remo con Barra": 83, "Peso Muerto Rumano": null, "Remo con Mancuerna": 47, "Sentadilla": 111, "Prensa de Piernas": null, "Extensiones de Cuádriceps": 57, "Peso Muerto": 123, "Zancadas": 57 },
    { date: "Sem 14", "Press con Mancuernas": 58, "Press Militar": null, "Press Banca": 93, "Press Inclinado": 77, "Fondos": null, "Dominadas": 86, "Jalón al Pecho": 96, "Remo con Barra": 85, "Peso Muerto Rumano": 106, "Remo con Mancuerna": null, "Sentadilla": 113, "Prensa de Piernas": 185, "Extensiones de Cuádriceps": null, "Peso Muerto": null, "Zancadas": 58 },
    { date: "Sem 15", "Press con Mancuernas": null, "Press Militar": 68, "Press Banca": 95, "Press Inclinado": 79, "Fondos": 73, "Dominadas": null, "Jalón al Pecho": 98, "Remo con Barra": null, "Peso Muerto Rumano": 108, "Remo con Mancuerna": 49, "Sentadilla": 115, "Prensa de Piernas": 187, "Extensiones de Cuádriceps": 59, "Peso Muerto": 128, "Zancadas": null },
    { date: "Sem 16", "Press con Mancuernas": 61, "Press Militar": 70, "Press Banca": null, "Press Inclinado": null, "Fondos": 75, "Dominadas": 90, "Jalón al Pecho": 100, "Remo con Barra": 89, "Peso Muerto Rumano": null, "Remo con Mancuerna": 50, "Sentadilla": null, "Prensa de Piernas": 190, "Extensiones de Cuádriceps": 60, "Peso Muerto": 130, "Zancadas": 61 },
    { date: "Sem 17", "Press con Mancuernas": 62, "Press Militar": null, "Press Banca": 99, "Press Inclinado": 82, "Fondos": null, "Dominadas": 92, "Jalón al Pecho": null, "Remo con Barra": 91, "Peso Muerto Rumano": 112, "Remo con Mancuerna": null, "Sentadilla": 119, "Prensa de Piernas": 192, "Extensiones de Cuádriceps": null, "Peso Muerto": 132, "Zancadas": 62 },
    { date: "Sem 18", "Press con Mancuernas": null, "Press Militar": 73, "Press Banca": 101, "Press Inclinado": 84, "Fondos": 78, "Dominadas": null, "Jalón al Pecho": 104, "Remo con Barra": 93, "Peso Muerto Rumano": 114, "Remo con Mancuerna": 52, "Sentadilla": 121, "Prensa de Piernas": null, "Extensiones de Cuádriceps": 62, "Peso Muerto": null, "Zancadas": 63 },
    { date: "Sem 19", "Press con Mancuernas": 65, "Press Militar": 75, "Press Banca": null, "Press Inclinado": null, "Fondos": 80, "Dominadas": 96, "Jalón al Pecho": 106, "Remo con Barra": null, "Peso Muerto Rumano": 116, "Remo con Mancuerna": 53, "Sentadilla": 123, "Prensa de Piernas": 197, "Extensiones de Cuádriceps": 63, "Peso Muerto": 136, "Zancadas": null },
    { date: "Sem 20", "Press con Mancuernas": 66, "Press Militar": 77, "Press Banca": 105, "Press Inclinado": 87, "Fondos": 82, "Dominadas": 98, "Jalón al Pecho": 108, "Remo con Barra": 97, "Peso Muerto Rumano": 118, "Remo con Mancuerna": 54, "Sentadilla": 125, "Prensa de Piernas": 200, "Extensiones de Cuádriceps": 64, "Peso Muerto": 138, "Zancadas": 66 },
  ],
  
  // Biomechanical measurements for each exercise
  biomechanicalData: {
    Fémur: [
      { exercise: "Press con Mancuernas", real: 45, ideal: 45 },
      { exercise: "Press Militar", real: 45, ideal: 45 },
      { exercise: "Press Banca", real: 45, ideal: 47 },
      { exercise: "Press Inclinado", real: 45, ideal: 46 },
      { exercise: "Fondos", real: 45, ideal: 45 },
      { exercise: "Dominadas", real: 45, ideal: 47 },
      { exercise: "Jalón al Pecho", real: 45, ideal: 46 },
      { exercise: "Remo con Barra", real: 45, ideal: 47 },
      { exercise: "Peso Muerto Rumano", real: 45, ideal: 48 },
      { exercise: "Remo con Mancuerna", real: 45, ideal: 46 },
      { exercise: "Sentadilla", real: 45, ideal: 48 },
      { exercise: "Prensa de Piernas", real: 45, ideal: 48 },
      { exercise: "Extensiones de Cuádriceps", real: 45, ideal: 47 },
      { exercise: "Peso Muerto", real: 45, ideal: 49 },
      { exercise: "Zancadas", real: 45, ideal: 47 },
    ],
    Tibia: [
      { exercise: "Press con Mancuernas", real: 38, ideal: 38 },
      { exercise: "Press Militar", real: 38, ideal: 39 },
      { exercise: "Press Banca", real: 38, ideal: 40 },
      { exercise: "Press Inclinado", real: 38, ideal: 39 },
      { exercise: "Fondos", real: 38, ideal: 38 },
      { exercise: "Dominadas", real: 38, ideal: 39 },
      { exercise: "Jalón al Pecho", real: 38, ideal: 39 },
      { exercise: "Remo con Barra", real: 38, ideal: 40 },
      { exercise: "Peso Muerto Rumano", real: 38, ideal: 41 },
      { exercise: "Remo con Mancuerna", real: 38, ideal: 39 },
      { exercise: "Sentadilla", real: 38, ideal: 42 },
      { exercise: "Prensa de Piernas", real: 38, ideal: 41 },
      { exercise: "Extensiones de Cuádriceps", real: 38, ideal: 40 },
      { exercise: "Peso Muerto", real: 38, ideal: 42 },
      { exercise: "Zancadas", real: 38, ideal: 41 },
    ],
    Húmero: [
      { exercise: "Press con Mancuernas", real: 32, ideal: 34 },
      { exercise: "Press Militar", real: 32, ideal: 35 },
      { exercise: "Press Banca", real: 32, ideal: 34 },
      { exercise: "Press Inclinado", real: 32, ideal: 34 },
      { exercise: "Fondos", real: 32, ideal: 34 },
      { exercise: "Dominadas", real: 32, ideal: 35 },
      { exercise: "Jalón al Pecho", real: 32, ideal: 34 },
      { exercise: "Remo con Barra", real: 32, ideal: 34 },
      { exercise: "Peso Muerto Rumano", real: 32, ideal: 33 },
      { exercise: "Remo con Mancuerna", real: 32, ideal: 34 },
      { exercise: "Sentadilla", real: 32, ideal: 32 },
      { exercise: "Prensa de Piernas", real: 32, ideal: 32 },
      { exercise: "Extensiones de Cuádriceps", real: 32, ideal: 32 },
      { exercise: "Peso Muerto", real: 32, ideal: 33 },
      { exercise: "Zancadas", real: 32, ideal: 32 },
    ],
    Radio: [
      { exercise: "Press con Mancuernas", real: 26, ideal: 28 },
      { exercise: "Press Militar", real: 26, ideal: 28 },
      { exercise: "Press Banca", real: 26, ideal: 28 },
      { exercise: "Press Inclinado", real: 26, ideal: 28 },
      { exercise: "Fondos", real: 26, ideal: 28 },
      { exercise: "Dominadas", real: 26, ideal: 28 },
      { exercise: "Jalón al Pecho", real: 26, ideal: 27 },
      { exercise: "Remo con Barra", real: 26, ideal: 27 },
      { exercise: "Peso Muerto Rumano", real: 26, ideal: 27 },
      { exercise: "Remo con Mancuerna", real: 26, ideal: 28 },
      { exercise: "Sentadilla", real: 26, ideal: 26 },
      { exercise: "Prensa de Piernas", real: 26, ideal: 26 },
      { exercise: "Extensiones de Cuádriceps", real: 26, ideal: 26 },
      { exercise: "Peso Muerto", real: 26, ideal: 27 },
      { exercise: "Zancadas", real: 26, ideal: 26 },
    ],
    Torso: [
      { exercise: "Press con Mancuernas", real: 55, ideal: 57 },
      { exercise: "Press Militar", real: 55, ideal: 57 },
      { exercise: "Press Banca", real: 55, ideal: 58 },
      { exercise: "Press Inclinado", real: 55, ideal: 57 },
      { exercise: "Fondos", real: 55, ideal: 57 },
      { exercise: "Dominadas", real: 55, ideal: 58 },
      { exercise: "Jalón al Pecho", real: 55, ideal: 57 },
      { exercise: "Remo con Barra", real: 55, ideal: 58 },
      { exercise: "Peso Muerto Rumano", real: 55, ideal: 59 },
      { exercise: "Remo con Mancuerna", real: 55, ideal: 57 },
      { exercise: "Sentadilla", real: 55, ideal: 59 },
      { exercise: "Prensa de Piernas", real: 55, ideal: 58 },
      { exercise: "Extensiones de Cuádriceps", real: 55, ideal: 56 },
      { exercise: "Peso Muerto", real: 55, ideal: 59 },
      { exercise: "Zancadas", real: 55, ideal: 58 },
    ],
  },
}

// Map of user training data (ready for multiple users)
export const userTrainingDataMap = {
  user1: juanPerezTrainingData,
  // Future users can be added here:
  // user2: mariaGarciaTrainingData,
  // user3: carlosLopezTrainingData,
}

/**
 * Get training data for a specific user
 * @param {string} userId - User ID
 * @returns {Object} User's training data
 */
export function getUserTrainingData(userId) {
  return userTrainingDataMap[userId] || null
}

/**
 * Get progression data for a specific user
 * @param {string} userId - User ID
 * @returns {Array} Progression data
 */
export function getUserProgressionData(userId) {
  const trainingData = getUserTrainingData(userId)
  return trainingData ? trainingData.progressionData : []
}

/**
 * Get biomechanical data for a specific user
 * @param {string} userId - User ID
 * @returns {Object} Biomechanical data
 */
export function getUserBiomechanicalData(userId) {
  const trainingData = getUserTrainingData(userId)
  return trainingData ? trainingData.biomechanicalData : {}
}
