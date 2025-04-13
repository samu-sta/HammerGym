import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const AttendanceModel = sequelize.define('Attendance', {

  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  classId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  attendanceDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Attendance',
  timestamps: true
});

export default AttendanceModel;