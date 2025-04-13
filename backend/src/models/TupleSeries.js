import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const TupleSeriesModel = sequelize.define('TupleSeries', {
  exerciseTupleId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  seriesId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  }
}, {
  tableName: 'TupleSeries',
  timestamps: true
});

export default TupleSeriesModel;