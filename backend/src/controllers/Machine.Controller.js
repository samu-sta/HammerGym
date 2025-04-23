import MachineModel from "../models/Machine.js";
import MachineModelModel from "../models/MachineModel.js";
import GymModel from "../models/Gym.js";
import machineSchema from "../schemas/MachineSchema.js";
import MESSAGES from "../messages/messages.js";

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
}