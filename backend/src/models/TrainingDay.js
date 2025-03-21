import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const TrainingDayModel = sequelize.define('TrainingDay', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  day: {
    type: DataTypes.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
    allowNull: false
  },
  trainingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Training',
      key: 'id'
    }
  }
}, {
  tableName: 'TrainingDay',
  timestamps: true
});

export default TrainingDayModel;