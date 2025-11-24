import TrainingModel from '../models/Training.js';
import UserModel from '../models/User.js';
import AccountModel from '../models/Account.js';
import TrainerModel from '../models/Trainer.js';
import ClientTrainerContractModel from '../models/ClientTrainerContract.js';
import MonthlyEconomyTrainerModel from '../models/MonthlyEconomyTrainer.js';
import ClassModel from '../models/Class.js';
import AttendanceModel from '../models/Attendance.js';
import MESSAGES from '../messages/messages.js';
import updateUserSchema from "../schemas/UpdateUserSchema.js";
import { Sequelize } from 'sequelize';
import { calculateAllKPIs } from '../services/KPICalculator.js';

export default class TrainerController {

  getTrainerAssignedUsers = async (req, res) => {
    const trainerId = req.account.id;

    try {
      const assignedUsers = await TrainingModel.findAll({
        where: { trainerId },
        attributes: [
          ['createdAt', 'assignedAt']
        ],
        include: [
          {
            model: UserModel,
            as: 'user',
            include: [
              {
                model: AccountModel,
                as: 'account',
                attributes: ['username', 'email']
              }
            ]
          }
        ],
        raw: true
      });

      if (assignedUsers.length === 0) {
        return res.status(404).json({ success: false, message: MESSAGES.NO_USERS_FOUND });
      }

      const results = assignedUsers.map(user => ({
        username: user['user.account.username'],
        email: user['user.account.email'],
        assignedAt: user.assignedAt
      }));

      return res.status(200).json({ success: true, users: results });
    }
    catch (error) {
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  }

  getAllTrainers = async (_req, res) => {
    try {
      const trainers = await TrainerModel.findAll({
        include: [{ model: AccountModel, as: "account" }]
      });

      const refactoredTrainers = trainers.map(trainer => {
        const { account, accountId, ...trainerData } = trainer.dataValues;
        return {
          ...trainerData,
          id: account.id,
          email: account.email,
          username: account.username
        };
      });

      return res.status(200).json({ success: true, trainers: refactoredTrainers });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  getTrainerById = async (req, res) => {
    const { id } = req.params;
    try {
      const trainer = await TrainerModel.findByPk(id, {
        include: [{ model: AccountModel, as: "account" }]
      });
      if (!trainer) {
        return res.status(404).json({ success: false, message: "Entrenador no encontrado" });
      }
      return res.status(200).json({ success: true, trainer });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  createTrainer = async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const account = await AccountModel.create({ email, username, password });
      const trainer = await TrainerModel.create({ accountId: account.id });
      return res.status(201).json({ success: true, trainer });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  updateTrainer = async (req, res) => {
    const { id } = req.params;
    const result = updateUserSchema.validateUpdateUser(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_DATA,
        errors: result.error.format()
      });
    }

    try {
      const trainer = await TrainerModel.findByPk(id, {
        include: [{ model: AccountModel, as: "account" }]
      });

      if (!trainer) {
        return res.status(404).json({ success: false, message: "Entrenador no encontrado" });
      }

      const accountData = {};
      accountData.email = result.data.email;
      accountData.username = result.data.username;

      await trainer.account.update(accountData);

      return res.status(200).json({ success: true });
    }
    catch (error) {
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  deleteTrainer = async (req, res) => {
    const { id } = req.params;
    try {
      const trainer = await TrainerModel.findByPk(id);
      if (!trainer) {
        console.error("Entrenador no encontrado");
        return res.status(404).json({ success: false, message: "Entrenador no encontrado" });
      }
      await trainer.destroy();
      return res.status(200).json({ success: true, message: "Entrenador eliminado correctamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  getTrainersStatistics = async (_req, res) => {
    try {
      // Obtener todos los entrenadores con sus relaciones
      const trainers = await TrainerModel.findAll({
        include: [
          {
            model: AccountModel,
            as: 'account',
            attributes: ['id', 'username', 'email']
          },
          {
            model: ClientTrainerContractModel,
            as: 'clientContracts',
            include: [
              {
                model: UserModel,
                as: 'client',
                include: [
                  {
                    model: AccountModel,
                    as: 'account',
                    attributes: ['username', 'email']
                  }
                ]
              }
            ]
          },
          {
            model: MonthlyEconomyTrainerModel,
            as: 'monthlyEconomy'
          },
          {
            model: ClassModel,
            as: 'classes'
          }
        ]
      });

      // Procesar cada entrenador para calcular estadísticas
      const trainersStatistics = await Promise.all(
        trainers.map(async (trainer) => {
          // Calcular asistencia promedio y capacidad máxima promedio de las clases
          const classes = trainer.classes || [];
          
          let avgAttendance = 0;
          let avgMaxCapacity = 0;
          
          if (classes.length > 0) {
            // Calcular asistencia promedio
            const attendanceCounts = await Promise.all(
              classes.map(async (classInstance) => {
                const count = await AttendanceModel.count({
                  where: { classId: classInstance.id }
                });
                return count;
              })
            );
            
            const totalAttendance = attendanceCounts.reduce((sum, count) => sum + count, 0);
            avgAttendance = totalAttendance / classes.length;
            
            // Calcular capacidad máxima promedio
            const totalMaxCapacity = classes.reduce((sum, cls) => sum + cls.maxCapacity, 0);
            avgMaxCapacity = totalMaxCapacity / classes.length;
          }

          return {
            id: trainer.accountId,
            username: trainer.account?.username,
            email: trainer.account?.email,
            averageRating: trainer.averageRating,
            clientContracts: trainer.clientContracts.map(contract => ({
              id: contract.id,
              clientId: contract.clientId,
              clientUsername: contract.client?.account?.username,
              clientEmail: contract.client?.account?.email,
              startDate: contract.startDate,
              endDate: contract.endDate
            })),
            monthlyEconomy: trainer.monthlyEconomy.map(economy => {
              const period = new Date(economy.period);
              const mesInicio = new Date(period.getFullYear(), period.getMonth(), 1);
              const mesFin = new Date(period.getFullYear(), period.getMonth() + 1, 0);

              // Calcular NUEVOS CLIENTES en este mes desde clientContracts
              const nuevosClientes = trainer.clientContracts.filter(contract => {
                const startDate = new Date(contract.startDate);
                return startDate >= mesInicio && startDate <= mesFin;
              }).length;

              // Calcular CLIENTES PERDIDOS en este mes desde clientContracts
              const clientesPerdidos = trainer.clientContracts.filter(contract => {
                if (!contract.endDate) return false;
                const endDate = new Date(contract.endDate);
                return endDate >= mesInicio && endDate <= mesFin;
              }).length;

              return {
                id: economy.id,
                period: economy.period,
                income: parseFloat(economy.income),
                costs: parseFloat(economy.costs),
                activeClients: economy.activeClients,
                potentialClients: economy.potentialClients,
                nuevosClientes: nuevosClientes,
                clientesPerdidos: clientesPerdidos
              };
            }),
            averageAttendance: Math.round(avgAttendance * 100) / 100,
            averageMaxCapacity: Math.round(avgMaxCapacity * 100) / 100,
            totalClasses: classes.length
          };
        })
      );

      // Calcular KPIs para cada entrenador
      const trainersWithKPIs = trainersStatistics.map(trainer => {
        const kpis = calculateAllKPIs(trainer, trainersStatistics);
        
        // Calcular retención real (porcentaje de contratos activos)
        const totalContratos = trainer.clientContracts.length;
        const contratosActivos = trainer.clientContracts.filter(c => !c.endDate || c.endDate === null).length;
        const retencionReal = totalContratos > 0 ? (contratosActivos / totalContratos) * 100 : 0;
        
        return {
          ...trainer,
          kpis,
          retencionReal: Math.round(retencionReal * 100) / 100
        };
      });

      return res.status(200).json({
        success: true,
        trainers: trainersWithKPIs
      });
    } catch (error) {
      console.error('Error en getTrainersStatistics:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.ERROR_500,
        error: error.message
      });
    }
  };

}