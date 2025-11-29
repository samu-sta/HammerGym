import MachineModel from "../models/Machine.js";
import MachineModelModel from "../models/MachineModel.js";
import GymModel from "../models/Gym.js";
import MaintenanceHistory from "../models/MaintenanceHistory.js";
import MachinePart from "../models/MachinePart.js";
import MachinePartReplaced from "../models/MachinePartReplaced.js";
import MachineMetrics from "../models/MachineMetrics.js";
import machineSchema from "../schemas/MachineSchema.js";
import MESSAGES from "../messages/messages.js";
import { Op } from "sequelize";
import KPIMachineCalculator from "../services/KPIMachineCalculator.js";

export default class MachineController {
  getAllMachines = async (_req, res) => {
    try {
      const machines = await MachineModel.findAll({
        include: [
          { model: MachineModelModel, as: 'model' },
          { model: GymModel, as: 'gym' }
        ]
      });
      return res.status(200).json({ success: true, machines });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  getMachineById = async (req, res) => {
    const { id } = req.params;
    try {
      const machine = await MachineModel.findByPk(id, {
        include: [
          { model: MachineModelModel, as: 'model' },
          { model: GymModel, as: 'gym' }
        ]
      });

      if (!machine) {
        return res.status(404).json({ success: false, message: "Máquina no encontrada" });
      }

      return res.status(200).json({ success: true, machine });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  getMachinesByGymId = async (req, res) => {
    const { gymId } = req.params;
    try {
      const machines = await MachineModel.findAll({
        where: { gymId },
        include: [
          { model: MachineModelModel, as: 'model' },
          { model: GymModel, as: 'gym' }
        ]
      });

      return res.status(200).json({ success: true, machines });
    } catch (error) {
      console.error(`Error al obtener máquinas del gimnasio ${gymId}:`, error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  createMachine = async (req, res) => {
    const { gymLocation, ...machineData } = req.body;
    const result = machineSchema.validateCreateMachine(machineData);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_DATA,
        errors: result.error.errors
      });
    }

    try {
      const modelExists = await MachineModelModel.findByPk(result.data.machineModelId);
      if (!modelExists) {
        return res.status(404).json({ success: false, message: "El modelo de máquina especificado no existe" });
      }

      // Buscar el gimnasio por ubicación en lugar de ID
      const gym = await GymModel.findOne({
        where: { location: gymLocation }
      });

      if (!gym) {
        return res.status(404).json({ success: false, message: "No se encontró gimnasio con la ubicación especificada" });
      }

      // Crear la máquina con el ID del gimnasio obtenido
      const newMachine = await MachineModel.create({
        ...result.data,
        gymId: gym.id
      });

      const machine = await MachineModel.findByPk(newMachine.id, {
        include: [
          { model: MachineModelModel, as: 'model' },
          { model: GymModel, as: 'gym' }
        ]
      });

      return res.status(201).json({ success: true, machine });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  updateMachine = async (req, res) => {
    const { id } = req.params;
    const { gymLocation, ...machineData } = req.body;
    const result = machineSchema.validateUpdateMachine(machineData);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_DATA,
        errors: result.error.errors
      });
    }

    try {
      const machine = await MachineModel.findByPk(id);
      if (!machine) {
        return res.status(404).json({ success: false, message: "Máquina no encontrada" });
      }

      if (result.data.machineModelId) {
        const modelExists = await MachineModelModel.findByPk(result.data.machineModelId);
        if (!modelExists) {
          return res.status(404).json({ success: false, message: "El modelo de máquina especificado no existe" });
        }
      }

      // Preparar datos de actualización
      let updateData = { ...result.data };

      // Si se proporciona una ubicación, buscar el gimnasio correspondiente
      if (gymLocation) {
        const gym = await GymModel.findOne({ where: { location: gymLocation } });
        if (!gym) {
          return res.status(404).json({ success: false, message: "No se encontró gimnasio con la ubicación especificada" });
        }
        updateData.gymId = gym.id;
      }

      await machine.update(updateData);

      const updatedMachine = await MachineModel.findByPk(id, {
        include: [
          { model: MachineModelModel, as: 'model' },
          { model: GymModel, as: 'gym' }
        ]
      });

      return res.status(200).json({ success: true, machine: updatedMachine });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  deleteMachine = async (req, res) => {
    const { id } = req.params;
    try {
      const machine = await MachineModel.findByPk(id);
      if (!machine) {
        return res.status(404).json({ success: false, message: "Máquina no encontrada" });
      }

      await machine.destroy();
      return res.status(200).json({ success: true, message: "Máquina eliminada correctamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  // Admin-only endpoint: Get complete equipment data from datasets
  getEquipmentDatasets = async (_req, res) => {
    try {
      console.log('📊 Starting getEquipmentDatasets...');
      
      // 1. Get all machines with their models and gym info
      console.log('📊 Step 1: Fetching machines...');
      const machines = await MachineModel.findAll({
        include: [
          { 
            model: MachineModelModel, 
            as: 'model',
            attributes: ['id', 'name', 'brand', 'criticality', 'exerciseCategory', 'originalPurchasePrice', 'fixedMaintenancePrice']
          },
          { 
            model: GymModel, 
            as: 'gym',
            attributes: ['id', 'location']
          }
        ],
        order: [['id', 'ASC']]
      });
      console.log(`📊 Found ${machines.length} machines`);

      // 2. Calculate KPIs for all machines
      console.log('📊 Step 2: Calculating KPIs...');
      const machineIds = machines.map(m => m.id);
      const kpisMap = await KPIMachineCalculator.calculateKPIsForMachines(machineIds);
      console.log(`📊 Calculated KPIs for ${Object.keys(kpisMap).length} machines`);

      // 3. Attach KPIs to each machine
      const machinesWithKPIs = machines.map(machine => {
        const machineData = machine.toJSON();
        return {
          ...machineData,
          kpis: kpisMap[machine.id] || {
            equipmentUptime: 0,
            maintenanceCostRelative: 0,
            diasDespuesDeFallo: KPIMachineCalculator.DIAS_DESPUES_DE_FALLO,
            rarityIndex: 0
          }
        };
      });

      // 4. Get all maintenance history with parts replaced
      console.log('📊 Step 3: Fetching maintenance history...');
      const maintenanceHistory = await MaintenanceHistory.findAll({
        include: [
          {
            model: MachineModel,
            as: 'machine',
            attributes: ['id'],
            include: [
              {
                model: MachineModelModel,
                as: 'model',
                attributes: ['name', 'brand']
              }
            ]
          },
          {
            model: MachinePart,
            as: 'partsReplaced',
            through: { attributes: [] },
            attributes: ['id', 'name']
          }
        ],
        order: [['dateCompleted', 'DESC']]
      });
      console.log(`📊 Found ${maintenanceHistory.length} maintenance records`);

      // 5. Get all machine metrics
      console.log('📊 Step 4: Fetching machine metrics...');
      const machineMetrics = await MachineMetrics.findAll({
        include: [
          {
            model: MachineModel,
            as: 'machine',
            attributes: ['id'],
            include: [
              {
                model: MachineModelModel,
                as: 'model',
                attributes: ['name', 'brand']
              }
            ]
          }
        ],
        order: [['machineId', 'ASC'], ['month', 'DESC']]
      });
      console.log(`📊 Found ${machineMetrics.length} metrics records`);

      // 6. Get all machine parts catalog
      console.log('📊 Step 5: Fetching machine parts...');
      const machineParts = await MachinePart.findAll({
        order: [['name', 'ASC']]
      });
      console.log(`📊 Found ${machineParts.length} machine parts`);

      // 7. Calculate summary statistics
      console.log('📊 Step 6: Calculating summary statistics...');
      const totalMachines = machines.length;
      const totalMaintenanceRecords = maintenanceHistory.length;
      const totalMetricsRecords = machineMetrics.length;
      const totalParts = machineParts.length;

      const machinesByStatus = machines.reduce((acc, machine) => {
        acc[machine.status] = (acc[machine.status] || 0) + 1;
        return acc;
      }, {});

      const maintenanceByType = maintenanceHistory.reduce((acc, maintenance) => {
        acc[maintenance.maintenanceType] = (acc[maintenance.maintenanceType] || 0) + 1;
        return acc;
      }, {});

      const totalRepairCost = maintenanceHistory.reduce((sum, m) => sum + parseFloat(m.repairCost || 0), 0);

      // 8. Get recent maintenance (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentMaintenance = maintenanceHistory.filter(m => 
        new Date(m.dateCompleted) >= thirtyDaysAgo
      );

      // 9. Calculate average KPIs
      const avgUptime = machinesWithKPIs.reduce((sum, m) => sum + m.kpis.equipmentUptime, 0) / totalMachines;
      const avgCostRelative = machinesWithKPIs.reduce((sum, m) => sum + m.kpis.maintenanceCostRelative, 0) / totalMachines;

      console.log('📊 Sending response...');
      return res.status(200).json({
        success: true,
        data: {
          summary: {
            totalMachines,
            totalMaintenanceRecords,
            totalMetricsRecords,
            totalParts,
            machinesByStatus,
            maintenanceByType,
            totalRepairCost: parseFloat(totalRepairCost.toFixed(2)),
            recentMaintenanceCount: recentMaintenance.length,
            averageKPIs: {
              equipmentUptime: Math.round(avgUptime * 100) / 100,
              maintenanceCostRelative: Math.round(avgCostRelative * 100) / 100
            }
          },
          machines: machinesWithKPIs,
          maintenanceHistory,
          machineMetrics,
          machineParts
        }
      });
    } catch (error) {
      console.error('❌ Error fetching equipment datasets:', error);
      console.error('Error stack:', error.stack);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };
}