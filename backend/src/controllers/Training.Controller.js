import TrainingService from "../services/TrainingService.js";

export default class TrainingController {

  constructor() {
    this.trainingService = new TrainingService();
  }

  getUserAsignedTraining = async (req, res) => {
    try {
      const { id } = req.account;

      const rawTraining = await this.trainingService.fetchUserTraining(id);

      if (!rawTraining) {
        return res.status(404).json({
          success: false,
          message: "No tienes entrenamientos asignados"
        });
      }

      const training = this.trainingService.formatTrainingData(rawTraining);

      return res.status(200).json({
        success: true,
        training
      });

    }
    catch (error) {
      console.error('Error al obtener entrenamiento:', error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  }

  createUserTraining = async (req, res) => {
    
  }
}