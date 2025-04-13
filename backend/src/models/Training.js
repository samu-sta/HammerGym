import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const TrainingModel = sequelize.define('Training', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'User',
      key: 'accountId'
    }
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