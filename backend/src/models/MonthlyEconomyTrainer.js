import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const MonthlyEconomyTrainerModel = sequelize.define('MonthlyEconomyTrainer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  period: {
    type: DataTypes.STRING(7),
    allowNull: false,
    comment: 'Format: YYYY-MM'
  },
  trainerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Trainer',
      key: 'accountId'
    }
  },
  income: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  costs: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  activeClients: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  potentialClients: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'MonthlyEconomyTrainer',
  sequelize,
  timestamps: false
});

export default MonthlyEconomyTrainerModel;
