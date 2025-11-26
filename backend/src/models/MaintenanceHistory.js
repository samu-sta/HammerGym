import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const MaintenanceHistory = sequelize.define('MaintenanceHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    machineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Machine',
            key: 'id'
        }
    },
    dateReported: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    dateCompleted: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    maintenanceType: {
        type: DataTypes.ENUM('Preventive', 'Corrective'),
        allowNull: false
    },
    failureMode: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    repairCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    }
}, {
    tableName: 'MaintenanceHistory',
    timestamps: true,
    sequelize
});

export default MaintenanceHistory;
