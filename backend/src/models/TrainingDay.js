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
  userId: {
    type: DataTypes.INTEGER,
<<<<<<< HEAD
    allowNull: false
=======
    allowNull: false,
    references: {
      model: 'Training',
      key: 'userId'
    }
>>>>>>> 2f6f5fcb02fca6680508b9b5153fb0aae9a9841a
  }
}, {
  tableName: 'TrainingDay',
  timestamps: true
});

export default TrainingDayModel;