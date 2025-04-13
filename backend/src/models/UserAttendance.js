import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const UserAttendanceModel = sequelize.define('UserAttendance', {
  attendanceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  }
}, {
  tableName: 'UserAttendance',
  timestamps: true
});

export default UserAttendanceModel;