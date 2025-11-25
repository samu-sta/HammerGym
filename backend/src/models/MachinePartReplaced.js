import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const MachinePartReplaced = sequelize.define('MachinePartReplaced', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    maintenanceHistoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'MaintenanceHistory',
            key: 'id'
        }
    },
    machinePartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'MachinePart',
            key: 'id'
        }
    }
}, {
    tableName: 'MachinePartReplaced',
    timestamps: false,
    sequelize
    
});

export default MachinePartReplaced;
