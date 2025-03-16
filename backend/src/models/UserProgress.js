import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const UserProgressModel = sequelize.define('UserProgress', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  trainingPlanId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'WeeklyTrainingPlan',
      key: 'id'
    }
  }
}, {
  tableName: 'UserProgress',
  timestamps: true
});

export default UserProgressModel;