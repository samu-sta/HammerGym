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
    allowNull: false
  },
  trainingDayId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  userProgressDayId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  estimatedTime: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  seriesId: {
    type: DataTypes.INTEGER,
    allowNull: false
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