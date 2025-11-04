import { juanPerezTrainingData } from './dss-trainingData'

// Mock users data
export const mockUsers = [
  { id: "user1", name: "Juan Pérez" },
  { id: "user2", name: "María García" },
  { id: "user3", name: "Carlos López" },
]

// Consolidated data for Juan Pérez - all user information in one place
export const JuanPerezData = {
  // User identification
  id: "user1",
  name: "Juan Pérez",
  
  // Profile data
  profile: {
    edad: 32,
    genero: "Masculino",
    peso: 78,
    altura: 175,
    pulsacionesReposo: 65,
    duracionSesiones: 60,
  },
  
  // Metabolic risk data
  metabolicRisk: {
    waistCircumference: 85,
    maxWaistCircumference: 102,
  },
  
  // Observations
  observations: "Usuario con excelente progreso en ejercicios de empuje. Muestra constancia en sus entrenamientos y mejora gradual en todos los índices. Se recomienda mantener el ritmo actual y considerar incrementar la intensidad en ejercicios de pierna.",
  
  // Training data (progression and biomechanical)
  training: {
    progressionData: juanPerezTrainingData.progressionData,
    biomechanicalData: juanPerezTrainingData.biomechanicalData,
  },
}

// Consolidated data for María García
export const MariaGarciaData = {
  // User identification
  id: "user2",
  name: "María García",
  
  // Profile data
  profile: {
    edad: 28,
    genero: "Femenino",
    peso: 62,
    altura: 165,
    pulsacionesReposo: 72,
    duracionSesiones: 45,
  },
  
  // Metabolic risk data
  metabolicRisk: {
    waistCircumference: 72,
    maxWaistCircumference: 88,
  },
  
  // Observations
  observations: "Usuario con buen rendimiento en ejercicios de jalón y excelente técnica biomecánica. Se observa mayor afinidad con ejercicios de espalda. Se recomienda trabajar más frecuentemente los ejercicios de empuje para equilibrar el desarrollo muscular.",
  
  // Training data (progression and biomechanical)
  training: {
    progressionData: [
      { date: "Sem 1", "Press con Mancuernas": 25, "Press Militar": 30, "Press Banca": 40, "Press Inclinado": 35, "Fondos": 30, "Dominadas": 45, "Jalón al Pecho": 55, "Remo con Barra": 50, "Peso Muerto Rumano": 60, "Remo con Mancuerna": 28, "Sentadilla": 65, "Prensa de Piernas": 120, "Extensiones de Cuádriceps": 35, "Peso Muerto": 70, "Zancadas": 30 },
      { date: "Sem 2", "Press con Mancuernas": 26, "Press Militar": null, "Press Banca": 42, "Press Inclinado": 36, "Fondos": null, "Dominadas": 47, "Jalón al Pecho": 57, "Remo con Barra": null, "Peso Muerto Rumano": 62, "Remo con Mancuerna": 29, "Sentadilla": 67, "Prensa de Piernas": null, "Extensiones de Cuádriceps": 36, "Peso Muerto": 72, "Zancadas": null },
      { date: "Sem 3", "Press con Mancuernas": null, "Press Militar": 32, "Press Banca": 44, "Press Inclinado": null, "Fondos": 33, "Dominadas": null, "Jalón al Pecho": 59, "Remo con Barra": 53, "Peso Muerto Rumano": 64, "Remo con Mancuerna": null, "Sentadilla": 69, "Prensa de Piernas": 125, "Extensiones de Cuádriceps": null, "Peso Muerto": 74, "Zancadas": 32 },
      { date: "Sem 4", "Press con Mancuernas": 28, "Press Militar": 34, "Press Banca": null, "Press Inclinado": 38, "Fondos": 35, "Dominadas": 50, "Jalón al Pecho": null, "Remo con Barra": 55, "Peso Muerto Rumano": null, "Remo con Mancuerna": 31, "Sentadilla": 71, "Prensa de Piernas": 130, "Extensiones de Cuádriceps": 38, "Peso Muerto": null, "Zancadas": 34 },
      { date: "Sem 5", "Press con Mancuernas": 29, "Press Militar": null, "Press Banca": 47, "Press Inclinado": 39, "Fondos": null, "Dominadas": 52, "Jalón al Pecho": 62, "Remo con Barra": 57, "Peso Muerto Rumano": 68, "Remo con Mancuerna": null, "Sentadilla": null, "Prensa de Piernas": 132, "Extensiones de Cuádriceps": 39, "Peso Muerto": 78, "Zancadas": 35 },
      { date: "Sem 6", "Press con Mancuernas": null, "Press Militar": 36, "Press Banca": 49, "Press Inclinado": null, "Fondos": 37, "Dominadas": 54, "Jalón al Pecho": null, "Remo con Barra": 59, "Peso Muerto Rumano": 70, "Remo con Mancuerna": 33, "Sentadilla": 75, "Prensa de Piernas": null, "Extensiones de Cuádriceps": 40, "Peso Muerto": 80, "Zancadas": null },
      { date: "Sem 7", "Press con Mancuernas": 31, "Press Militar": 38, "Press Banca": 51, "Press Inclinado": 42, "Fondos": null, "Dominadas": null, "Jalón al Pecho": 65, "Remo con Barra": 61, "Peso Muerto Rumano": 72, "Remo con Mancuerna": 34, "Sentadilla": 77, "Prensa de Piernas": 137, "Extensiones de Cuádriceps": null, "Peso Muerto": 82, "Zancadas": 37 },
      { date: "Sem 8", "Press con Mancuernas": 32, "Press Militar": null, "Press Banca": null, "Press Inclinado": 43, "Fondos": 40, "Dominadas": 57, "Jalón al Pecho": 67, "Remo con Barra": null, "Peso Muerto Rumano": 74, "Remo con Mancuerna": null, "Sentadilla": 79, "Prensa de Piernas": 140, "Extensiones de Cuádriceps": 42, "Peso Muerto": null, "Zancadas": 38 },
      { date: "Sem 9", "Press con Mancuernas": null, "Press Militar": 40, "Press Banca": 54, "Press Inclinado": null, "Fondos": 42, "Dominadas": 59, "Jalón al Pecho": null, "Remo con Barra": 64, "Peso Muerto Rumano": null, "Remo con Mancuerna": 36, "Sentadilla": 81, "Prensa de Piernas": null, "Extensiones de Cuádriceps": 43, "Peso Muerto": 86, "Zancadas": null },
      { date: "Sem 10", "Press con Mancuernas": 34, "Press Militar": 42, "Press Banca": 56, "Press Inclinado": 45, "Fondos": 44, "Dominadas": 61, "Jalón al Pecho": 70, "Remo con Barra": 66, "Peso Muerto Rumano": 78, "Remo con Mancuerna": 37, "Sentadilla": 83, "Prensa de Piernas": 145, "Extensiones de Cuádriceps": 44, "Peso Muerto": 88, "Zancadas": 40 },
      { date: "Sem 11", "Press con Mancuernas": 35, "Press Militar": null, "Press Banca": 58, "Press Inclinado": 46, "Fondos": null, "Dominadas": null, "Jalón al Pecho": 72, "Remo con Barra": 68, "Peso Muerto Rumano": 80, "Remo con Mancuerna": null, "Sentadilla": 85, "Prensa de Piernas": 147, "Extensiones de Cuádriceps": null, "Peso Muerto": 90, "Zancadas": 41 },
      { date: "Sem 12", "Press con Mancuernas": null, "Press Militar": 44, "Press Banca": null, "Press Inclinado": 47, "Fondos": 46, "Dominadas": 64, "Jalón al Pecho": 74, "Remo con Barra": null, "Peso Muerto Rumano": 82, "Remo con Mancuerna": 39, "Sentadilla": null, "Prensa de Piernas": 150, "Extensiones de Cuádriceps": 46, "Peso Muerto": 92, "Zancadas": null },
      { date: "Sem 13", "Press con Mancuernas": 37, "Press Militar": 46, "Press Banca": 61, "Press Inclinado": null, "Fondos": 48, "Dominadas": 66, "Jalón al Pecho": null, "Remo con Barra": 71, "Peso Muerto Rumano": null, "Remo con Mancuerna": 40, "Sentadilla": 89, "Prensa de Piernas": null, "Extensiones de Cuádriceps": 47, "Peso Muerto": 94, "Zancadas": 43 },
      { date: "Sem 14", "Press con Mancuernas": 38, "Press Militar": null, "Press Banca": 63, "Press Inclinado": 49, "Fondos": null, "Dominadas": 68, "Jalón al Pecho": 77, "Remo con Barra": 73, "Peso Muerto Rumano": 86, "Remo con Mancuerna": null, "Sentadilla": 91, "Prensa de Piernas": 155, "Extensiones de Cuádriceps": null, "Peso Muerto": null, "Zancadas": 44 },
      { date: "Sem 15", "Press con Mancuernas": null, "Press Militar": 48, "Press Banca": 65, "Press Inclinado": 50, "Fondos": 50, "Dominadas": null, "Jalón al Pecho": 79, "Remo con Barra": null, "Peso Muerto Rumano": 88, "Remo con Mancuerna": 42, "Sentadilla": 93, "Prensa de Piernas": 157, "Extensiones de Cuádriceps": 49, "Peso Muerto": 98, "Zancadas": null },
      { date: "Sem 16", "Press con Mancuernas": 40, "Press Militar": 50, "Press Banca": null, "Press Inclinado": null, "Fondos": 52, "Dominadas": 71, "Jalón al Pecho": 81, "Remo con Barra": 76, "Peso Muerto Rumano": null, "Remo con Mancuerna": 43, "Sentadilla": null, "Prensa de Piernas": 160, "Extensiones de Cuádriceps": 50, "Peso Muerto": 100, "Zancadas": 46 },
      { date: "Sem 17", "Press con Mancuernas": 41, "Press Militar": null, "Press Banca": 68, "Press Inclinado": 52, "Fondos": null, "Dominadas": 73, "Jalón al Pecho": null, "Remo con Barra": 78, "Peso Muerto Rumano": 92, "Remo con Mancuerna": null, "Sentadilla": 97, "Prensa de Piernas": 162, "Extensiones de Cuádriceps": null, "Peso Muerto": 102, "Zancadas": 47 },
      { date: "Sem 18", "Press con Mancuernas": null, "Press Militar": 52, "Press Banca": 70, "Press Inclinado": 53, "Fondos": 54, "Dominadas": null, "Jalón al Pecho": 84, "Remo con Barra": 80, "Peso Muerto Rumano": 94, "Remo con Mancuerna": 45, "Sentadilla": 99, "Prensa de Piernas": null, "Extensiones de Cuádriceps": 52, "Peso Muerto": null, "Zancadas": 48 },
      { date: "Sem 19", "Press con Mancuernas": 43, "Press Militar": 54, "Press Banca": null, "Press Inclinado": null, "Fondos": 56, "Dominadas": 76, "Jalón al Pecho": 86, "Remo con Barra": null, "Peso Muerto Rumano": 96, "Remo con Mancuerna": 46, "Sentadilla": 101, "Prensa de Piernas": 167, "Extensiones de Cuádriceps": 53, "Peso Muerto": 106, "Zancadas": null },
      { date: "Sem 20", "Press con Mancuernas": 44, "Press Militar": 56, "Press Banca": 73, "Press Inclinado": 55, "Fondos": 58, "Dominadas": 78, "Jalón al Pecho": 88, "Remo con Barra": 83, "Peso Muerto Rumano": 98, "Remo con Mancuerna": 47, "Sentadilla": 103, "Prensa de Piernas": 170, "Extensiones de Cuádriceps": 54, "Peso Muerto": 108, "Zancadas": 50 },
    ],
    biomechanicalData: {
      Fémur: [
        { exercise: "Press con Mancuernas", real: 42, ideal: 42 },
        { exercise: "Press Militar", real: 42, ideal: 42 },
        { exercise: "Press Banca", real: 42, ideal: 44 },
        { exercise: "Press Inclinado", real: 42, ideal: 43 },
        { exercise: "Fondos", real: 42, ideal: 42 },
        { exercise: "Dominadas", real: 42, ideal: 44 },
        { exercise: "Jalón al Pecho", real: 42, ideal: 43 },
        { exercise: "Remo con Barra", real: 42, ideal: 44 },
        { exercise: "Peso Muerto Rumano", real: 42, ideal: 45 },
        { exercise: "Remo con Mancuerna", real: 42, ideal: 43 },
        { exercise: "Sentadilla", real: 42, ideal: 45 },
        { exercise: "Prensa de Piernas", real: 42, ideal: 45 },
        { exercise: "Extensiones de Cuádriceps", real: 42, ideal: 44 },
        { exercise: "Peso Muerto", real: 42, ideal: 46 },
        { exercise: "Zancadas", real: 42, ideal: 44 },
      ],
      Tibia: [
        { exercise: "Press con Mancuernas", real: 35, ideal: 35 },
        { exercise: "Press Militar", real: 35, ideal: 36 },
        { exercise: "Press Banca", real: 35, ideal: 37 },
        { exercise: "Press Inclinado", real: 35, ideal: 36 },
        { exercise: "Fondos", real: 35, ideal: 35 },
        { exercise: "Dominadas", real: 35, ideal: 36 },
        { exercise: "Jalón al Pecho", real: 35, ideal: 36 },
        { exercise: "Remo con Barra", real: 35, ideal: 37 },
        { exercise: "Peso Muerto Rumano", real: 35, ideal: 38 },
        { exercise: "Remo con Mancuerna", real: 35, ideal: 36 },
        { exercise: "Sentadilla", real: 35, ideal: 39 },
        { exercise: "Prensa de Piernas", real: 35, ideal: 38 },
        { exercise: "Extensiones de Cuádriceps", real: 35, ideal: 37 },
        { exercise: "Peso Muerto", real: 35, ideal: 39 },
        { exercise: "Zancadas", real: 35, ideal: 38 },
      ],
      Húmero: [
        { exercise: "Press con Mancuernas", real: 29, ideal: 31 },
        { exercise: "Press Militar", real: 29, ideal: 32 },
        { exercise: "Press Banca", real: 29, ideal: 31 },
        { exercise: "Press Inclinado", real: 29, ideal: 31 },
        { exercise: "Fondos", real: 29, ideal: 31 },
        { exercise: "Dominadas", real: 29, ideal: 32 },
        { exercise: "Jalón al Pecho", real: 29, ideal: 31 },
        { exercise: "Remo con Barra", real: 29, ideal: 31 },
        { exercise: "Peso Muerto Rumano", real: 29, ideal: 30 },
        { exercise: "Remo con Mancuerna", real: 29, ideal: 31 },
        { exercise: "Sentadilla", real: 29, ideal: 29 },
        { exercise: "Prensa de Piernas", real: 29, ideal: 29 },
        { exercise: "Extensiones de Cuádriceps", real: 29, ideal: 29 },
        { exercise: "Peso Muerto", real: 29, ideal: 30 },
        { exercise: "Zancadas", real: 29, ideal: 29 },
      ],
      Radio: [
        { exercise: "Press con Mancuernas", real: 23, ideal: 25 },
        { exercise: "Press Militar", real: 23, ideal: 25 },
        { exercise: "Press Banca", real: 23, ideal: 25 },
        { exercise: "Press Inclinado", real: 23, ideal: 25 },
        { exercise: "Fondos", real: 23, ideal: 25 },
        { exercise: "Dominadas", real: 23, ideal: 25 },
        { exercise: "Jalón al Pecho", real: 23, ideal: 24 },
        { exercise: "Remo con Barra", real: 23, ideal: 24 },
        { exercise: "Peso Muerto Rumano", real: 23, ideal: 24 },
        { exercise: "Remo con Mancuerna", real: 23, ideal: 25 },
        { exercise: "Sentadilla", real: 23, ideal: 23 },
        { exercise: "Prensa de Piernas", real: 23, ideal: 23 },
        { exercise: "Extensiones de Cuádriceps", real: 23, ideal: 23 },
        { exercise: "Peso Muerto", real: 23, ideal: 24 },
        { exercise: "Zancadas", real: 23, ideal: 23 },
      ],
      Torso: [
        { exercise: "Press con Mancuernas", real: 50, ideal: 52 },
        { exercise: "Press Militar", real: 50, ideal: 52 },
        { exercise: "Press Banca", real: 50, ideal: 53 },
        { exercise: "Press Inclinado", real: 50, ideal: 52 },
        { exercise: "Fondos", real: 50, ideal: 52 },
        { exercise: "Dominadas", real: 50, ideal: 53 },
        { exercise: "Jalón al Pecho", real: 50, ideal: 52 },
        { exercise: "Remo con Barra", real: 50, ideal: 53 },
        { exercise: "Peso Muerto Rumano", real: 50, ideal: 54 },
        { exercise: "Remo con Mancuerna", real: 50, ideal: 52 },
        { exercise: "Sentadilla", real: 50, ideal: 54 },
        { exercise: "Prensa de Piernas", real: 50, ideal: 53 },
        { exercise: "Extensiones de Cuádriceps", real: 50, ideal: 51 },
        { exercise: "Peso Muerto", real: 50, ideal: 54 },
        { exercise: "Zancadas", real: 50, ideal: 53 },
      ],
    },
  },
}

// Consolidated data for Carlos López
export const CarlosLopezData = {
  // User identification
  id: "user3",
  name: "Carlos López",
  
  // Profile data
  profile: {
    edad: 45,
    genero: "Masculino",
    peso: 92,
    altura: 182,
    pulsacionesReposo: 58,
    duracionSesiones: 75,
  },
  
  // Metabolic risk data
  metabolicRisk: {
    waistCircumference: 95,
    maxWaistCircumference: 102,
  },
  
  // Observations
  observations: "Usuario experimentado con excelente capacidad en ejercicios compuestos, especialmente peso muerto y sentadilla. Muestra alta eficiencia biomecánica en ejercicios de pierna. Se recomienda mantener el enfoque en ejercicios básicos y continuar el trabajo de movilidad articular.",
  
  // Training data (progression and biomechanical)
  training: {
    progressionData: [
      { date: "Sem 1", "Press con Mancuernas": 50, "Press Militar": 55, "Press Banca": 80, "Press Inclinado": 70, "Fondos": 65, "Dominadas": 70, "Jalón al Pecho": 85, "Remo con Barra": 75, "Peso Muerto Rumano": 100, "Remo con Mancuerna": 45, "Sentadilla": 110, "Prensa de Piernas": 180, "Extensiones de Cuádriceps": 60, "Peso Muerto": 120, "Zancadas": 55 },
      { date: "Sem 2", "Press con Mancuernas": 52, "Press Militar": null, "Press Banca": 82, "Press Inclinado": 72, "Fondos": null, "Dominadas": 72, "Jalón al Pecho": 87, "Remo con Barra": null, "Peso Muerto Rumano": 102, "Remo con Mancuerna": 46, "Sentadilla": 112, "Prensa de Piernas": null, "Extensiones de Cuádriceps": 61, "Peso Muerto": 122, "Zancadas": null },
      { date: "Sem 3", "Press con Mancuernas": null, "Press Militar": 58, "Press Banca": 85, "Press Inclinado": null, "Fondos": 68, "Dominadas": null, "Jalón al Pecho": 89, "Remo con Barra": 78, "Peso Muerto Rumano": 104, "Remo con Mancuerna": null, "Sentadilla": 115, "Prensa de Piernas": 185, "Extensiones de Cuádriceps": null, "Peso Muerto": 125, "Zancadas": 58 },
      { date: "Sem 4", "Press con Mancuernas": 55, "Press Militar": 60, "Press Banca": null, "Press Inclinado": 75, "Fondos": 70, "Dominadas": 75, "Jalón al Pecho": null, "Remo con Barra": 80, "Peso Muerto Rumano": null, "Remo con Mancuerna": 48, "Sentadilla": 117, "Prensa de Piernas": 190, "Extensiones de Cuádriceps": 63, "Peso Muerto": null, "Zancadas": 60 },
      { date: "Sem 5", "Press con Mancuernas": 56, "Press Militar": null, "Press Banca": 89, "Press Inclinado": 77, "Fondos": null, "Dominadas": 77, "Jalón al Pecho": 93, "Remo con Barra": 82, "Peso Muerto Rumano": 108, "Remo con Mancuerna": null, "Sentadilla": null, "Prensa de Piernas": 192, "Extensiones de Cuádriceps": 64, "Peso Muerto": 130, "Zancadas": 61 },
      { date: "Sem 6", "Press con Mancuernas": null, "Press Militar": 63, "Press Banca": 92, "Press Inclinado": null, "Fondos": 73, "Dominadas": 79, "Jalón al Pecho": null, "Remo con Barra": 84, "Peso Muerto Rumano": 110, "Remo con Mancuerna": 50, "Sentadilla": 122, "Prensa de Piernas": null, "Extensiones de Cuádriceps": 65, "Peso Muerto": 132, "Zancadas": null },
      { date: "Sem 7", "Press con Mancuernas": 59, "Press Militar": 65, "Press Banca": 94, "Press Inclinado": 80, "Fondos": null, "Dominadas": null, "Jalón al Pecho": 97, "Remo con Barra": 86, "Peso Muerto Rumano": 112, "Remo con Mancuerna": 51, "Sentadilla": 124, "Prensa de Piernas": 198, "Extensiones de Cuádriceps": null, "Peso Muerto": 135, "Zancadas": 64 },
      { date: "Sem 8", "Press con Mancuernas": 60, "Press Militar": null, "Press Banca": null, "Press Inclinado": 82, "Fondos": 76, "Dominadas": 82, "Jalón al Pecho": 99, "Remo con Barra": null, "Peso Muerto Rumano": 114, "Remo con Mancuerna": null, "Sentadilla": 126, "Prensa de Piernas": 200, "Extensiones de Cuádriceps": 67, "Peso Muerto": null, "Zancadas": 65 },
      { date: "Sem 9", "Press con Mancuernas": null, "Press Militar": 68, "Press Banca": 98, "Press Inclinado": null, "Fondos": 78, "Dominadas": 84, "Jalón al Pecho": null, "Remo con Barra": 89, "Peso Muerto Rumano": null, "Remo con Mancuerna": 53, "Sentadilla": 128, "Prensa de Piernas": null, "Extensiones de Cuádriceps": 68, "Peso Muerto": 140, "Zancadas": null },
      { date: "Sem 10", "Press con Mancuernas": 63, "Press Militar": 70, "Press Banca": 100, "Press Inclinado": 85, "Fondos": 80, "Dominadas": 86, "Jalón al Pecho": 103, "Remo con Barra": 91, "Peso Muerto Rumano": 118, "Remo con Mancuerna": 54, "Sentadilla": 130, "Prensa de Piernas": 205, "Extensiones de Cuádriceps": 69, "Peso Muerto": 142, "Zancadas": 68 },
      { date: "Sem 11", "Press con Mancuernas": 64, "Press Militar": null, "Press Banca": 102, "Press Inclinado": 87, "Fondos": null, "Dominadas": null, "Jalón al Pecho": 105, "Remo con Barra": 93, "Peso Muerto Rumano": 120, "Remo con Mancuerna": null, "Sentadilla": 132, "Prensa de Piernas": 207, "Extensiones de Cuádriceps": null, "Peso Muerto": 144, "Zancadas": 69 },
      { date: "Sem 12", "Press con Mancuernas": null, "Press Militar": 73, "Press Banca": null, "Press Inclinado": 89, "Fondos": 83, "Dominadas": 89, "Jalón al Pecho": 107, "Remo con Barra": null, "Peso Muerto Rumano": 122, "Remo con Mancuerna": 56, "Sentadilla": null, "Prensa de Piernas": 210, "Extensiones de Cuádriceps": 71, "Peso Muerto": 146, "Zancadas": null },
      { date: "Sem 13", "Press con Mancuernas": 67, "Press Militar": 75, "Press Banca": 106, "Press Inclinado": null, "Fondos": 85, "Dominadas": 91, "Jalón al Pecho": null, "Remo con Barra": 96, "Peso Muerto Rumano": null, "Remo con Mancuerna": 57, "Sentadilla": 136, "Prensa de Piernas": null, "Extensiones de Cuádriceps": 72, "Peso Muerto": 148, "Zancadas": 72 },
      { date: "Sem 14", "Press con Mancuernas": 68, "Press Militar": null, "Press Banca": 108, "Press Inclinado": 92, "Fondos": null, "Dominadas": 93, "Jalón al Pecho": 111, "Remo con Barra": 98, "Peso Muerto Rumano": 126, "Remo con Mancuerna": null, "Sentadilla": 138, "Prensa de Piernas": 215, "Extensiones de Cuádriceps": null, "Peso Muerto": null, "Zancadas": 73 },
      { date: "Sem 15", "Press con Mancuernas": null, "Press Militar": 78, "Press Banca": 110, "Press Inclinado": 94, "Fondos": 88, "Dominadas": null, "Jalón al Pecho": 113, "Remo con Barra": null, "Peso Muerto Rumano": 128, "Remo con Mancuerna": 59, "Sentadilla": 140, "Prensa de Piernas": 217, "Extensiones de Cuádriceps": 74, "Peso Muerto": 153, "Zancadas": null },
      { date: "Sem 16", "Press con Mancuernas": 71, "Press Militar": 80, "Press Banca": null, "Press Inclinado": null, "Fondos": 90, "Dominadas": 96, "Jalón al Pecho": 115, "Remo con Barra": 101, "Peso Muerto Rumano": null, "Remo con Mancuerna": 60, "Sentadilla": null, "Prensa de Piernas": 220, "Extensiones de Cuádriceps": 75, "Peso Muerto": 155, "Zancadas": 76 },
      { date: "Sem 17", "Press con Mancuernas": 72, "Press Militar": null, "Press Banca": 114, "Press Inclinado": 97, "Fondos": null, "Dominadas": 98, "Jalón al Pecho": null, "Remo con Barra": 103, "Peso Muerto Rumano": 132, "Remo con Mancuerna": null, "Sentadilla": 144, "Prensa de Piernas": 222, "Extensiones de Cuádriceps": null, "Peso Muerto": 157, "Zancadas": 77 },
      { date: "Sem 18", "Press con Mancuernas": null, "Press Militar": 83, "Press Banca": 116, "Press Inclinado": 99, "Fondos": 93, "Dominadas": null, "Jalón al Pecho": 119, "Remo con Barra": 105, "Peso Muerto Rumano": 134, "Remo con Mancuerna": 62, "Sentadilla": 146, "Prensa de Piernas": null, "Extensiones de Cuádriceps": 77, "Peso Muerto": null, "Zancadas": 78 },
      { date: "Sem 19", "Press con Mancuernas": 75, "Press Militar": 85, "Press Banca": null, "Press Inclinado": null, "Fondos": 95, "Dominadas": 101, "Jalón al Pecho": 121, "Remo con Barra": null, "Peso Muerto Rumano": 136, "Remo con Mancuerna": 63, "Sentadilla": 148, "Prensa de Piernas": 227, "Extensiones de Cuádriceps": 78, "Peso Muerto": 161, "Zancadas": null },
      { date: "Sem 20", "Press con Mancuernas": 76, "Press Militar": 87, "Press Banca": 120, "Press Inclinado": 102, "Fondos": 97, "Dominadas": 103, "Jalón al Pecho": 123, "Remo con Barra": 108, "Peso Muerto Rumano": 138, "Remo con Mancuerna": 64, "Sentadilla": 150, "Prensa de Piernas": 230, "Extensiones de Cuádriceps": 79, "Peso Muerto": 163, "Zancadas": 81 },
    ],
    biomechanicalData: {
      Fémur: [
        { exercise: "Press con Mancuernas", real: 48, ideal: 48 },
        { exercise: "Press Militar", real: 48, ideal: 48 },
        { exercise: "Press Banca", real: 48, ideal: 50 },
        { exercise: "Press Inclinado", real: 48, ideal: 49 },
        { exercise: "Fondos", real: 48, ideal: 48 },
        { exercise: "Dominadas", real: 48, ideal: 50 },
        { exercise: "Jalón al Pecho", real: 48, ideal: 49 },
        { exercise: "Remo con Barra", real: 48, ideal: 50 },
        { exercise: "Peso Muerto Rumano", real: 48, ideal: 51 },
        { exercise: "Remo con Mancuerna", real: 48, ideal: 49 },
        { exercise: "Sentadilla", real: 48, ideal: 51 },
        { exercise: "Prensa de Piernas", real: 48, ideal: 51 },
        { exercise: "Extensiones de Cuádriceps", real: 48, ideal: 50 },
        { exercise: "Peso Muerto", real: 48, ideal: 52 },
        { exercise: "Zancadas", real: 48, ideal: 50 },
      ],
      Tibia: [
        { exercise: "Press con Mancuernas", real: 40, ideal: 40 },
        { exercise: "Press Militar", real: 40, ideal: 41 },
        { exercise: "Press Banca", real: 40, ideal: 42 },
        { exercise: "Press Inclinado", real: 40, ideal: 41 },
        { exercise: "Fondos", real: 40, ideal: 40 },
        { exercise: "Dominadas", real: 40, ideal: 41 },
        { exercise: "Jalón al Pecho", real: 40, ideal: 41 },
        { exercise: "Remo con Barra", real: 40, ideal: 42 },
        { exercise: "Peso Muerto Rumano", real: 40, ideal: 43 },
        { exercise: "Remo con Mancuerna", real: 40, ideal: 41 },
        { exercise: "Sentadilla", real: 40, ideal: 44 },
        { exercise: "Prensa de Piernas", real: 40, ideal: 43 },
        { exercise: "Extensiones de Cuádriceps", real: 40, ideal: 42 },
        { exercise: "Peso Muerto", real: 40, ideal: 44 },
        { exercise: "Zancadas", real: 40, ideal: 43 },
      ],
      Húmero: [
        { exercise: "Press con Mancuernas", real: 34, ideal: 36 },
        { exercise: "Press Militar", real: 34, ideal: 37 },
        { exercise: "Press Banca", real: 34, ideal: 36 },
        { exercise: "Press Inclinado", real: 34, ideal: 36 },
        { exercise: "Fondos", real: 34, ideal: 36 },
        { exercise: "Dominadas", real: 34, ideal: 37 },
        { exercise: "Jalón al Pecho", real: 34, ideal: 36 },
        { exercise: "Remo con Barra", real: 34, ideal: 36 },
        { exercise: "Peso Muerto Rumano", real: 34, ideal: 35 },
        { exercise: "Remo con Mancuerna", real: 34, ideal: 36 },
        { exercise: "Sentadilla", real: 34, ideal: 34 },
        { exercise: "Prensa de Piernas", real: 34, ideal: 34 },
        { exercise: "Extensiones de Cuádriceps", real: 34, ideal: 34 },
        { exercise: "Peso Muerto", real: 34, ideal: 35 },
        { exercise: "Zancadas", real: 34, ideal: 34 },
      ],
      Radio: [
        { exercise: "Press con Mancuernas", real: 28, ideal: 30 },
        { exercise: "Press Militar", real: 28, ideal: 30 },
        { exercise: "Press Banca", real: 28, ideal: 30 },
        { exercise: "Press Inclinado", real: 28, ideal: 30 },
        { exercise: "Fondos", real: 28, ideal: 30 },
        { exercise: "Dominadas", real: 28, ideal: 30 },
        { exercise: "Jalón al Pecho", real: 28, ideal: 29 },
        { exercise: "Remo con Barra", real: 28, ideal: 29 },
        { exercise: "Peso Muerto Rumano", real: 28, ideal: 29 },
        { exercise: "Remo con Mancuerna", real: 28, ideal: 30 },
        { exercise: "Sentadilla", real: 28, ideal: 28 },
        { exercise: "Prensa de Piernas", real: 28, ideal: 28 },
        { exercise: "Extensiones de Cuádriceps", real: 28, ideal: 28 },
        { exercise: "Peso Muerto", real: 28, ideal: 29 },
        { exercise: "Zancadas", real: 28, ideal: 28 },
      ],
      Torso: [
        { exercise: "Press con Mancuernas", real: 58, ideal: 60 },
        { exercise: "Press Militar", real: 58, ideal: 60 },
        { exercise: "Press Banca", real: 58, ideal: 61 },
        { exercise: "Press Inclinado", real: 58, ideal: 60 },
        { exercise: "Fondos", real: 58, ideal: 60 },
        { exercise: "Dominadas", real: 58, ideal: 61 },
        { exercise: "Jalón al Pecho", real: 58, ideal: 60 },
        { exercise: "Remo con Barra", real: 58, ideal: 61 },
        { exercise: "Peso Muerto Rumano", real: 58, ideal: 62 },
        { exercise: "Remo con Mancuerna", real: 58, ideal: 60 },
        { exercise: "Sentadilla", real: 58, ideal: 62 },
        { exercise: "Prensa de Piernas", real: 58, ideal: 61 },
        { exercise: "Extensiones de Cuádriceps", real: 58, ideal: 59 },
        { exercise: "Peso Muerto", real: 58, ideal: 62 },
        { exercise: "Zancadas", real: 58, ideal: 61 },
      ],
    },
  },
}

// Map of all users data for easy access
export const allUsersData = {
  user1: JuanPerezData,
  user2: MariaGarciaData,
  user3: CarlosLopezData,
}

// Legacy exports for backward compatibility
export const mockUserProfile = JuanPerezData.profile
export const mockMetabolicRisk = JuanPerezData.metabolicRisk
export const mockUserObservations = JuanPerezData.observations
