import ClassModel from "../models/Class.js";
import MESSAGES from "../messages/messages.js";

export default class ClassController {
  getAllClasses = async (req, res) => {
    try {
      const classes = await ClassModel.findAll({
        attributes: ['id', 'name', 'description', 'schedule', 'difficulty', 'maxCapacity', 'currentCapacity']
      });

      return res.status(200).json({ success: true, classes });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  enrollInClass = async (req, res) => {
    const { id: classId } = req.params;
    const userId = req.account.id;

    try {
      const classInstance = await ClassModel.findByPk(classId);

      if (!classInstance) {
        return res.status(404).json({ success: false, message: "Clase no encontrada" });
      }

      if (classInstance.currentCapacity >= classInstance.maxCapacity) {
        return res.status(400).json({ success: false, message: "La clase está llena" });
      }

      // Increment current capacity
      classInstance.currentCapacity += 1;
      await classInstance.save();

      // Here you could also save the enrollment in a separate table if needed
      return res.status(200).json({ success: true, message: "Inscripción exitosa" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  createClass = async (req, res) => {
    const { name, description, maxCapacity, schedule, difficulty } = req.body;
    const trainerId = req.account.id;

    try {
      // Verificar si el usuario es un entrenador
      const trainer = await TrainerModel.findOne({ where: { accountId: trainerId } });

      if (!trainer) {
        return res.status(403).json({ success: false, message: "No tienes permisos para crear clases" });
      }

      // Crear la clase
      const newClass = await ClassModel.create({
        name,
        description,
        maxCapacity,
        schedule,
        difficulty,
        trainerId: trainer.id,
        currentCapacity: 0
      });

      return res.status(201).json({ success: true, message: "Clase creada exitosamente", class: newClass });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };
  
}