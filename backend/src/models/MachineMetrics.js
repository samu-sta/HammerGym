import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const MachineMetrics = sequelize.define('MachineMetrics', {
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
    month: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    totalOperationalHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    totalSessions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    avgDailyPeakUsage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    vibrationLevel: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'IoT sensor vibration level'
    },
    temperatureDeviation: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Temperature deviation from normal'
    },
    powerConsumption: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
        defaultValue: 0.00
    }
    
}, {
    tableName: 'MachineMetrics',
    timestamps: false,
    sequelize
});

export default MachineMetrics;
