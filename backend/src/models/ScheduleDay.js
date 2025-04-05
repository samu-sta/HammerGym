import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const ScheduleDayModel = sequelize.define('ScheduleDay', {
  scheduleId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Schedule',
      key: 'classId'
    }
  },
  day: {
    type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
    primaryKey: true,
    allowNull: false
  },
  startHour: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endHour: {
    type: DataTypes.TIME,
    allowNull: false
  }
}, {
  tableName: 'ScheduleDay',
  timestamps: false,
  sequelize
});

export default ScheduleDayModel;