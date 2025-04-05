import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const ScheduleModel = sequelize.define('Schedule', {
    classId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'Class',
            key: 'id'
        }
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'Schedule',
    timestamps: false,
    sequelize
});

export default ScheduleModel;