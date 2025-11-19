import { JuanPerezData } from '../data/dss-users'
import { mockExercises } from '../data/dss-exercises'

/**
 * Estructura de datos completa para el sistema de decisión
 * Incluye: datos del usuario, KPIs, progresión, biomecánica y ejercicios
 */
const datosDecisionCompletos = {
  // Información del usuario
  usuario: {
    id: JuanPerezData.id,
    nombre: JuanPerezData.name,
    email: "juan.perez@example.com", // Se puede obtener del parámetro de la URL
  },

  // Datos del perfil
  perfil: {
    edad: JuanPerezData.profile.edad,
    genero: JuanPerezData.profile.genero,
    peso: JuanPerezData.profile.peso,
    altura: JuanPerezData.profile.altura,
    pulsacionesReposo: JuanPerezData.profile.pulsacionesReposo,
    duracionSesiones: JuanPerezData.profile.duracionSesiones,
  },

  // KPIs de riesgo metabólico
  riesgoMetabolico: {
    circunferenciaCintura: JuanPerezData.metabolicRisk.waistCircumference,
    circunferenciaCinturaMaxima: JuanPerezData.metabolicRisk.maxWaistCircumference,
    ratio: JuanPerezData.metabolicRisk.waistCircumference / JuanPerezData.metabolicRisk.maxWaistCircumference,
  },

  // Observaciones del entrenador
  observaciones: JuanPerezData.observations,

  // Catálogo de ejercicios con KPIs
  ejercicios: mockExercises.map(exercise => ({
    id: exercise.id,
    nombre: exercise.name,
    tipo: exercise.type,
    kpis: {
      indiceAfinidad: exercise.affinityIndex,
      eficienciaBiomecanica: exercise.biomechanicalEfficiency,
    }
  })),

  // Datos de progresión temporal (peso levantado por semana)
  progresion: JuanPerezData.training.progressionData,

  // Datos biomecánicos (comparación real vs ideal por hueso)
  biomecanica: JuanPerezData.training.biomechanicalData,

  // Metadatos
  metadata: {
    fechaConsulta: new Date().toISOString(),
    version: "1.0.0",
    fuente: "datos-locales"
  }
}

/**
 * Función que obtiene los datos de decisión del usuario desde el backend
 * Los datos ya vienen formateados desde el backend
 * @param {string} userEmail - Email del usuario (parámetro de la URL)
 * @returns {Promise<Object>} Datos completos del usuario para el sistema de decisión
 */
export async function getDatosDecisionUsuario(userEmail) {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    // Llamar al endpoint del backend
    const response = await fetch(`${API_URL}/trainer-data/user/${encodeURIComponent(userEmail)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' // Para enviar cookies de autenticación
    });

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Error al obtener datos del usuario');
    }

    // Los datos ya vienen formateados desde el backend
    return {
      success: true,
      data: data.data,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error al obtener datos de decisión:', error);
    
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Función auxiliar para obtener los datos en formato compatible con los componentes actuales
 * Convierte el formato JSON centralizado al formato que esperan BentoGrid y SharedCharts
 */
export function formatearDatosParaComponentes(datosJSON) {
  return {
    id: datosJSON.usuario.id,
    name: datosJSON.usuario.nombre,
    profile: datosJSON.perfil,
    metabolicRisk: {
      waistCircumference: datosJSON.riesgoMetabolico.circunferenciaCintura,
      maxWaistCircumference: datosJSON.riesgoMetabolico.circunferenciaCinturaMaxima,
    },
    observations: datosJSON.observaciones,
    exercises: datosJSON.ejercicios.map(ejercicio => ({
      id: ejercicio.id,
      name: ejercicio.nombre,
      type: ejercicio.tipo,
      affinityIndex: ejercicio.kpis.indiceAfinidad,
      biomechanicalEfficiency: ejercicio.kpis.eficienciaBiomecanica,
    })),
    training: {
      progressionData: datosJSON.progresion,
      biomechanicalData: datosJSON.biomecanica,
    }
  }
}

// Exportar también los datos raw para debugging
export { datosDecisionCompletos }
