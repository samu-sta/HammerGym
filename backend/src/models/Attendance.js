import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const AttendanceModel = sequelize.define('Attendance', {
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'Class',
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