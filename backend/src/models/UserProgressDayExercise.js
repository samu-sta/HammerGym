import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const UserProgressDayExerciseModel = sequelize.define('UserProgressDayExercise', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  exerciseTupeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ExerciseTuple',
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
  },
  idUserProgressDay: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'UserProgressDay',
      key: 'id'
    }
  },
}, {
  tableName: 'UserProgress',
  timestamps: true
});

export default UserProgressModel;