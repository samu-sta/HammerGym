import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const AttendanceModel = sequelize.define('Attendance', {
  userid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  classId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
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