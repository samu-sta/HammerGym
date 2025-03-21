import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const TrainingModel = sequelize.define('Training', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  trainerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Trainer',
      key: 'accountId'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'accountId'
    }
  }
}, {
  tableName: 'Training',
  timestamps: true
});

export default TrainingModel;