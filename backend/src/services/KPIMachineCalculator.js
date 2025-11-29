import MaintenanceHistory from '../models/MaintenanceHistory.js';
import MachineMetrics from '../models/MachineMetrics.js';
import MachineModel from '../models/Machine.js';
import MachineModelModel from '../models/MachineModel.js';
import PredictiveModelService from './PredictiveModelService.js';
import { Op } from 'sequelize';

/**
 * Servicio para calcular KPIs de máquinas
 */
class KPIMachineCalculator {
  
  /**
   * Constante temporal para días hasta próximo fallo (DEPRECADA)
   * Se usa el servicio de predicción PredictiveModelService
   */
  static DIAS_DESPUES_DE_FALLO = 15; // Deprecado - solo para fallback

  /**
   * Calcula Equipment Uptime (%)
   * Formula: (operationalHours / (daysInPeriod × hoursPerDay)) × 100
   * 
   * @param {number} machineId - ID de la máquina
   * @param {Date} startDate - Fecha inicio del período
   * @param {Date} endDate - Fecha fin del período
   * @param {number} hoursPerDay - Horas operativas por día (default: 24)
   * @returns {Promise<number>} - Uptime en porcentaje
   */
  static async calculateEquipmentUptime(machineId, startDate, endDate, hoursPerDay = 24) {
    try {
      // Obtener todas las métricas del período
      const metrics = await MachineMetrics.findAll({
        where: {
          machineId: machineId,
          month: {
            [Op.between]: [startDate, endDate]
          }
        }
      });

      if (metrics.length === 0) {
        return 0;
      }

      // Sumar todas las horas operacionales
      const totalOperationalHours = metrics.reduce((sum, metric) => {
        return sum + parseInt(metric.totalOperationalHours || 0);
      }, 0);

      // Calcular días en el período
      const daysInPeriod = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

      // Calcular uptime
      const uptime = (totalOperationalHours / (daysInPeriod * hoursPerDay)) * 100;

      return Math.min(Math.round(uptime * 100) / 100, 100); // Redondear a 2 decimales, máximo 100%
    } catch (error) {
      console.error(`Error calculating uptime for machine ${machineId}:`, error);
      return 0;
    }
  }

  /**
   * Calcula Coste de Mantenimiento Relativo (% sobre valor de reemplazo)
   * Formula: (Σ repairCost12m / replacementValue) × 100
   * 
   * @param {number} machineId - ID de la máquina
   * @returns {Promise<number>} - Coste relativo en porcentaje
   */
  static async calculateMaintenanceCostRelative(machineId) {
    try {
      // Obtener la máquina para acceder al valor de reemplazo
      const machine = await MachineModel.findByPk(machineId);
      
      if (!machine || !machine.replacementValue || parseFloat(machine.replacementValue) === 0) {
        return 0;
      }

      // Calcular fecha de hace 12 meses
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      // Obtener todos los mantenimientos de los últimos 12 meses
      const maintenanceRecords = await MaintenanceHistory.findAll({
        where: {
          machineId: machineId,
          dateCompleted: {
            [Op.gte]: twelveMonthsAgo
          }
        }
      });

      // Sumar costos de reparación
      const totalRepairCost = maintenanceRecords.reduce((sum, record) => {
        return sum + parseFloat(record.repairCost || 0);
      }, 0);

      // Calcular porcentaje sobre valor de reemplazo
      const replacementValue = parseFloat(machine.replacementValue);
      const costeRelativo = (totalRepairCost / replacementValue) * 100;

      return Math.round(costeRelativo * 100) / 100; // Redondear a 2 decimales
    } catch (error) {
      console.error(`Error calculating maintenance cost for machine ${machineId}:`, error);
      return 0;
    }
  }

  /**
   * Calcula Índice de Rareza (IR)
   * Formula: IR = 10 / √N
   * Donde N es el número de máquinas del mismo tipo de ejercicio
   * 
   * @param {number} machineId - ID de la máquina
   * @returns {Promise<number>} - Índice de Rareza
   */
  static async calculateRarityIndex(machineId) {
    try {
      // Obtener la máquina con su modelo para saber el exerciseCategory
      const machine = await MachineModel.findByPk(machineId, {
        include: [{
          model: MachineModelModel,
          as: 'model',
          attributes: ['exerciseCategory']
        }]
      });

      if (!machine || !machine.model || !machine.model.exerciseCategory) {
        return 0;
      }

      const exerciseCategory = machine.model.exerciseCategory;

      // Contar cuántas máquinas tienen el mismo tipo de ejercicio
      const count = await MachineModel.count({
        include: [{
          model: MachineModelModel,
          as: 'model',
          where: {
            exerciseCategory: exerciseCategory
          }
        }]
      });

      if (count === 0) {
        return 0;
      }

      // Calcular IR = 10 / √N
      const rarityIndex = 10 / Math.sqrt(count);

      return Math.round(rarityIndex * 100) / 100; // Redondear a 2 decimales
    } catch (error) {
      console.error(`Error calculating rarity index for machine ${machineId}:`, error);
      return 0;
    }
  }

  /**
   * Calcula todos los KPIs para una máquina específica
   * 
   * @param {number} machineId - ID de la máquina
   * @param {Date} startDate - Fecha inicio para uptime (opcional, default: hace 12 meses)
   * @param {Date} endDate - Fecha fin para uptime (opcional, default: hoy)
   * @param {number} diasHastaFallo - Predicción de días hasta fallo (opcional, se obtiene del servicio predictivo)
   * @returns {Promise<Object>} - Objeto con todos los KPIs
   */
  static async calculateAllKPIs(machineId, startDate = null, endDate = null, diasHastaFallo = null) {
    try {
      // Fechas por defecto: últimos 12 meses
      if (!endDate) {
        endDate = new Date();
      }
      if (!startDate) {
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 12);
      }

      // Calcular todos los KPIs en paralelo
      const [equipmentUptime, maintenanceCostRelative, rarityIndex] = await Promise.all([
        this.calculateEquipmentUptime(machineId, startDate, endDate),
        this.calculateMaintenanceCostRelative(machineId),
        this.calculateRarityIndex(machineId)
      ]);

      return {
        equipmentUptime,
        maintenanceCostRelative,
        diasDespuesDeFallo: diasHastaFallo || this.DIAS_DESPUES_DE_FALLO, // Usar predicción o valor por defecto
        rarityIndex
      };
    } catch (error) {
      console.error(`Error calculating KPIs for machine ${machineId}:`, error);
      return {
        equipmentUptime: 0,
        maintenanceCostRelative: 0,
        diasDespuesDeFallo: diasHastaFallo || this.DIAS_DESPUES_DE_FALLO,
        rarityIndex: 0
      };
    }
  }

  /**
   * Calcula KPIs para múltiples máquinas
   * 
   * @param {Array<number>} machineIds - Array de IDs de máquinas
   * @param {Date} startDate - Fecha inicio para uptime (opcional)
   * @param {Date} endDate - Fecha fin para uptime (opcional)
   * @returns {Promise<Object>} - Objeto mapeando machineId -> KPIs
   */
  static async calculateKPIsForMachines(machineIds, startDate = null, endDate = null) {
    try {
      // Primero obtener predicciones de fallo para todas las máquinas
      console.log('📊 Obteniendo predicciones de fallos del modelo ML...');
      const failurePredictions = await PredictiveModelService.getPredictionsForMachines(machineIds);
      console.log(`📊 Predicciones obtenidas para ${Object.keys(failurePredictions).length} máquinas`);

      // Calcular KPIs para cada máquina con su predicción
      const kpisPromises = machineIds.map(async (machineId) => {
        const diasHastaFallo = failurePredictions[machineId] || this.DIAS_DESPUES_DE_FALLO;
        const kpis = await this.calculateAllKPIs(machineId, startDate, endDate, diasHastaFallo);
        return { machineId, kpis };
      });

      const results = await Promise.all(kpisPromises);

      // Convertir array a objeto mapeado
      const kpisMap = {};
      results.forEach(({ machineId, kpis }) => {
        kpisMap[machineId] = kpis;
      });

      return kpisMap;
    } catch (error) {
      console.error('Error calculating KPIs for multiple machines:', error);
      return {};
    }
  }

  /**
   * Obtiene información detallada para el cálculo de coste relativo
   * Útil para debugging y desglose de costos
   * 
   * @param {number} machineId - ID de la máquina
   * @returns {Promise<Object>} - Desglose detallado de costos
   */
  static async getMaintenanceCostBreakdown(machineId) {
    try {
      const machine = await MachineModel.findByPk(machineId);
      
      if (!machine) {
        return null;
      }

      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const maintenanceRecords = await MaintenanceHistory.findAll({
        where: {
          machineId: machineId,
          dateCompleted: {
            [Op.gte]: twelveMonthsAgo
          }
        },
        order: [['dateCompleted', 'DESC']]
      });

      const totalRepairCost = maintenanceRecords.reduce((sum, record) => {
        return sum + parseFloat(record.repairCost || 0);
      }, 0);

      const preventiveCost = maintenanceRecords
        .filter(r => r.maintenanceType === 'Preventive')
        .reduce((sum, r) => sum + parseFloat(r.repairCost || 0), 0);

      const correctiveCost = maintenanceRecords
        .filter(r => r.maintenanceType === 'Corrective')
        .reduce((sum, r) => sum + parseFloat(r.repairCost || 0), 0);

      return {
        equipmentId: machineId,
        replacementValue: parseFloat(machine.replacementValue || 0),
        totalRepairCost12m: totalRepairCost,
        preventiveCost12m: preventiveCost,
        correctiveCost12m: correctiveCost,
        maintenanceCount12m: maintenanceRecords.length,
        costeRelativo: (totalRepairCost / parseFloat(machine.replacementValue || 1)) * 100,
        records: maintenanceRecords.map(r => ({
          workOrderId: r.workOrderId,
          date: r.dateCompleted,
          type: r.maintenanceType,
          cost: parseFloat(r.repairCost || 0)
        }))
      };
    } catch (error) {
      console.error(`Error getting maintenance breakdown for machine ${machineId}:`, error);
      return null;
    }
  }
}

export default KPIMachineCalculator;
