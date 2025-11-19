import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const TrainingDayModel = sequelize.define('TrainingDay', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Training',
      key: 'userId'
    }
  },
  trainerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Training',
      key: 'trainerId'
    }
  }
}, {
  tableName: 'TrainingDay',
  timestamps: true,
  sequelize
});

export default TrainingDayModel;