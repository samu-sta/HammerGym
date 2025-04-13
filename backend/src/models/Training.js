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
<<<<<<< HEAD
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
=======
    references: {
      model: 'Trainer',
      key: 'accountId'
    }
>>>>>>> 2f6f5fcb02fca6680508b9b5153fb0aae9a9841a
  }
}, {
  tableName: 'Training',
  timestamps: true
});

export default TrainingModel;