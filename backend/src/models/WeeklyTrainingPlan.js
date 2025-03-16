import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const WeeklyTrainingPlanModel = sequelize.define('WeeklyTrainingPlan', {
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
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  }
}, {
  tableName: 'WeeklyTrainingPlan',
  timestamps: true
});

export default WeeklyTrainingPlanModel;