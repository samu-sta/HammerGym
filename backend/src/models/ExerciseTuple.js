import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const ExerciseTupleModel = sequelize.define('ExerciseTuple', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  exerciseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Exercise',
      key: 'id'
    }
  },
  trainingDayId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'TrainingDay',
      key: 'id'
    }
  },
  userProgressDayId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'UserProgressDay',
      key: 'id'
    }
  },
  estimatedTime: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  seriesId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Series',
      key: 'id'
    }
  },
  weight: {
    type: DataTypes.DOUBLE,
    allowNull: true
  }
}, {
  tableName: 'ExerciseTuple',
  timestamps: true
});

export default ExerciseTupleModel;