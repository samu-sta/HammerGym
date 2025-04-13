import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const AttendanceModel = sequelize.define('Attendance', {
<<<<<<< HEAD
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  classId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
=======
  
  classId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
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
>>>>>>> 2f6f5fcb02fca6680508b9b5153fb0aae9a9841a
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