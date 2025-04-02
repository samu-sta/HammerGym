import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const ScheduleModel = sequelize.define('Schedule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    start: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    end: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
  tableName: 'Schedule',
  timestamps: false
});

export default ScheduleModel;