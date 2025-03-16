import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const AttendanceModel = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Class',
      key: 'id'
    }
  }
}, {
  tableName: 'Attendance',
  timestamps: true
});

export default AttendanceModel;