import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const ScheduleModel = sequelize.define('Schedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  start: {
    type: DataTypes.TIME, // Cambiado a TIME para almacenar correctamente la hora
    allowNull: false
  },
  end: {
    type: DataTypes.TIME, // Cambiado a TIME para almacenar correctamente la hora
    allowNull: false
  }
}, {
  tableName: 'Schedule',
  timestamps: false
});

export default ScheduleModel;