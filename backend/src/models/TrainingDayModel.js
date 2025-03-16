import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const TrainingDayModel = sequelize.define('TrainingDay', {
  day: {
    type: DataTypes.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
    primaryKey: true,
    allowNull: false
  },
  trainingPlanId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'WeeklyTrainingPlan',
      key: 'id'
    }
  }
}, {
  tableName: 'TrainingDay',
  timestamps: true
});

export default TrainingDayModel;