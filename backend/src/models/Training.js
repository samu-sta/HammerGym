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
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'Training',
  timestamps: true
});

export default TrainingModel;