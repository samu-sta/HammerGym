import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const UserAttendanceModel = sequelize.define('UserAttendance', {
  attendanceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Attendance',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'User',
      key: 'id'
    }
  }
}, {
  tableName: 'UserAttendance',
  timestamps: true
});

export default UserAttendanceModel;