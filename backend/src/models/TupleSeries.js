import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const TupleSeriesModel = sequelize.define('TupleSeries', {
  exerciseTupleId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'ExerciseTuple',
      key: 'id'
    }
  },
  seriesId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Series',
      key: 'id'
    }
  }
}, {
  tableName: 'TupleSeries',
  timestamps: true
});

export default TupleSeriesModel;