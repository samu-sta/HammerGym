import MaintenanceHistory from '../models/MaintenanceHistory.js';
import MachineMetrics from '../models/MachineMetrics.js';
import MachineModel from '../models/Machine.js';
import MachineModelModel from '../models/MachineModel.js';
import { Op } from 'sequelize';

/**
 * Servicio para llamar al modelo predictivo de fallos
 */
class PredictiveModelService {
  
  /**
   * URL del servicio de predicción (simulado por ahora)
   * TODO: Cambiar por la URL real del modelo ML desplegado
   */
  static PREDICTION_API_URL = 'http://localhost:5000/predict'; // URL simulada

  /**
   * Prepara los datos de una máquina para enviar al modelo predictivo
   * 
   * @param {Object} machine - Objeto de máquina con sus relaciones
   * @param {Array} machineMetrics - Array de métricas de la máquina
   * @param {Array} maintenanceHistory - Array de historial de mantenimiento
   * @returns {Promise<Object>} - Objeto con los datos preparados para predicción
   */
  static async prepareMachineDataForPrediction(machine, machineMetrics, maintenanceHistory) {
    try {
      const now = new Date();
      const purchaseDate = new Date(machine.purchaseDate);
      const ageMonths = Math.floor((now - purchaseDate) / (30.44 * 24 * 60 * 60 * 1000));

      // Obtener métricas del último mes
      const latestMetrics = machineMetrics
        ?.filter(m => m.machineId === machine.id)
        .sort((a, b) => new Date(b.month) - new Date(a.month))[0];

      // Calcular fallos de los últimos 12 meses
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
      
      const failuresLast12m = maintenanceHistory
        ?.filter(m => 
          m.machineId === machine.id && 
          m.maintenanceType === 'Corrective' &&
          new Date(m.dateCompleted) >= twelveMonthsAgo
        ).length || 0;

      return {
        idMaquina: machine.id,
        fallosUltimos12m: failuresLast12m,
        horasTotales: latestMetrics?.totalOperationalHours || 0,
        tipoEquipo: machine.model?.exerciseCategory || 'unknown',
        idEquipo: machine.id,
        edadMeses: ageMonths,
        sesionesTotales: latestMetrics?.totalSessions || 0,
        consumoEnergia: latestMetrics?.powerConsumption || 0,
        nivelVibracion: parseFloat(latestMetrics?.vibrationLevel || 0),
        desviacionTemp: parseFloat(latestMetrics?.temperatureDeviation || 0),
        usoPicoDiario: latestMetrics?.avgDailyPeakUsage || 0,
        marca: machine.model?.brand || 'unknown'
      };
    } catch (error) {
      console.error(`Error preparing data for machine ${machine.id}:`, error);
      return null;
    }
  }

  /**
   * Llama al modelo predictivo para obtener predicciones de fallos
   * Por ahora devuelve valores simulados
   * 
   * @param {Array} machinesData - Array de objetos con datos de máquinas preparados
   * @returns {Promise<Array>} - Array de objetos con idMaquina y diasHastaFallo
   */
  static async predictFailures(machinesData) {
    try {
      // TODO: Descomentar cuando el servicio ML esté desplegado
      /*
      const response = await fetch(this.PREDICTION_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ machines: machinesData })
      });

      if (!response.ok) {
        throw new Error(`Prediction API error: ${response.status}`);
      }

      const predictions = await response.json();
      return predictions.map(pred => ({
        idMaquina: pred.idMaquina,
        diasHastaFallo: pred.diasHastaFallo
      }));
      */

      // SIMULACIÓN: Generar predicciones basadas en factores de riesgo
      return machinesData.map(machine => {
        // Calcular predicción simulada basada en datos reales
        let diasBase = 30; // Base de 30 días
        
        // Reducir días por fallos recientes
        if (machine.fallosUltimos12m > 3) {
          diasBase -= 10;
        } else if (machine.fallosUltimos12m > 1) {
          diasBase -= 5;
        }
        
        // Reducir días por edad avanzada
        if (machine.edadMeses > 48) {
          diasBase -= 5;
        } else if (machine.edadMeses > 24) {
          diasBase -= 3;
        }
        
        // Reducir días por uso intensivo
        if (machine.horasTotales > 5000) {
          diasBase -= 5;
        } else if (machine.horasTotales > 3000) {
          diasBase -= 3;
        }
        
        // Reducir días por vibraciones altas
        if (machine.nivelVibracion > 1.5) {
          diasBase -= 4;
        } else if (machine.nivelVibracion > 1.0) {
          diasBase -= 2;
        }
        
        // Reducir días por temperatura alta
        if (machine.desviacionTemp > 2.0) {
          diasBase -= 3;
        } else if (machine.desviacionTemp > 1.5) {
          diasBase -= 2;
        }
        
        // Asegurar que el valor esté en un rango razonable (5-30 días)
        const diasHastaFallo = Math.max(5, Math.min(30, diasBase + Math.floor(Math.random() * 10 - 5)));
        
        return {
          idMaquina: machine.idMaquina,
          diasHastaFallo: diasHastaFallo
        };
      });
    } catch (error) {
      console.error('Error calling prediction API:', error);
      // En caso de error, devolver predicción por defecto
      return machinesData.map(machine => ({
        idMaquina: machine.idMaquina,
        diasHastaFallo: 15 // Valor por defecto
      }));
    }
  }

  /**
   * Obtiene predicciones para múltiples máquinas
   * 
   * @param {Array<number>} machineIds - Array de IDs de máquinas
   * @returns {Promise<Object>} - Objeto mapeando machineId -> diasHastaFallo
   */
  static async getPredictionsForMachines(machineIds) {
    try {
      // Obtener todas las máquinas con sus datos necesarios
      const machines = await MachineModel.findAll({
        where: {
          id: {
            [Op.in]: machineIds
          }
        },
        include: [
          {
            model: MachineModelModel,
            as: 'model',
            attributes: ['brand', 'exerciseCategory']
          }
        ]
      });

      // Obtener métricas para todas las máquinas
      const machineMetrics = await MachineMetrics.findAll({
        where: {
          machineId: {
            [Op.in]: machineIds
          }
        }
      });

      // Obtener historial de mantenimiento
      const maintenanceHistory = await MaintenanceHistory.findAll({
        where: {
          machineId: {
            [Op.in]: machineIds
          }
        }
      });

      // Preparar datos para cada máquina
      const machinesDataPromises = machines.map(machine =>
        this.prepareMachineDataForPrediction(machine, machineMetrics, maintenanceHistory)
      );
      const machinesData = (await Promise.all(machinesDataPromises)).filter(d => d !== null);

      // Llamar al modelo predictivo
      const predictions = await this.predictFailures(machinesData);

      // Convertir a objeto mapeado
      const predictionsMap = {};
      predictions.forEach(pred => {
        predictionsMap[pred.idMaquina] = pred.diasHastaFallo;
      });

      return predictionsMap;
    } catch (error) {
      console.error('Error getting predictions for machines:', error);
      // En caso de error, devolver valores por defecto
      const defaultMap = {};
      machineIds.forEach(id => {
        defaultMap[id] = 15;
      });
      return defaultMap;
    }
  }
}

export default PredictiveModelService;
