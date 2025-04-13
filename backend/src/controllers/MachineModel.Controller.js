import MachineModelModel from "../models/MachineModel.js";
import machineModelSchema from "../schemas/MachineModelSchema.js";
import MESSAGES from "../messages/messages.js";

export default class MachineModelController {
  getAllMachineModels = async (_req, res) => {
    try {
      const machineModels = await MachineModelModel.findAll();
      return res.status(200).json({ success: true, machineModels });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  getMachineModelById = async (req, res) => {
    const { id } = req.params;
    try {
      const machineModel = await MachineModelModel.findByPk(id);
      if (!machineModel) {
        return res.status(404).json({ success: false, message: "Modelo de máquina no encontrado" });
      }
      return res.status(200).json({ success: true, machineModel });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  createMachineModel = async (req, res) => {
    const result = machineModelSchema.validateCreateMachineModel(req.body);
    
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        message: MESSAGES.INVALID_DATA, 
        errors: result.error.errors 
      });
    }
    
    try {
      const newMachineModel = await MachineModelModel.create(result.data);
      return res.status(201).json({ success: true, machineModel: newMachineModel });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  updateMachineModel = async (req, res) => {
    const { id } = req.params;
    const result = machineModelSchema.validateUpdateMachineModel(req.body);
    
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        message: MESSAGES.INVALID_DATA, 
        errors: result.error.errors 
      });
    }
    
    try {
      const machineModel = await MachineModelModel.findByPk(id);
      if (!machineModel) {
        return res.status(404).json({ success: false, message: "Modelo de máquina no encontrado" });
      }
      
      await machineModel.update(result.data);
      return res.status(200).json({ success: true, machineModel });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  deleteMachineModel = async (req, res) => {
    const { id } = req.params;
    try {
      const machineModel = await MachineModelModel.findByPk(id);
      if (!machineModel) {
        return res.status(404).json({ success: false, message: "Modelo de máquina no encontrado" });
      }
      
      await machineModel.destroy();
      return res.status(200).json({ success: true, message: "Modelo de máquina eliminado correctamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };
}