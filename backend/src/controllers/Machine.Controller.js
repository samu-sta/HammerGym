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

  createMachine = async (req, res) => {
    const result = machineSchema.validateCreateMachine(req.body);
    
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
      
      const gymExists = await GymModel.findByPk(result.data.gymId);
      if (!gymExists) {
        return res.status(404).json({ success: false, message: "El gimnasio especificado no existe" });
      }
      
      const newMachine = await MachineModel.create(result.data);
      
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
    const result = machineSchema.validateUpdateMachine(req.body);
    
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
      
      if (result.data.gymId) {
        const gymExists = await GymModel.findByPk(result.data.gymId);
        if (!gymExists) {
          return res.status(404).json({ success: false, message: "El gimnasio especificado no existe" });
        }
      }
      
      await machine.update(result.data);
      
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