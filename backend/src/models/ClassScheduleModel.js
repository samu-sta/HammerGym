import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const ClassScheduleModel = sequelize.define('ClassSchedule', {
  classId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    references: {
      model: 'Class',
      key: 'id'
    }
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  days: {
    type: DataTypes.STRING(255),
    allowNull: false,
    get() {
      return this.getDataValue('days').split(',');
    },
    set(val) {
      this.setDataValue('days', Array.isArray(val) ? val.join(',') : val);
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'ClassSchedule',
  timestamps: true
});

export default ClassScheduleModel;