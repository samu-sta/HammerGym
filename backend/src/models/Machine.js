import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const MachineModel = sequelize.define('Machine', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.ENUM('available', 'inUse', 'broken', 'preparing', 'outOfService'),
        allowNull: false,
        defaultValue: 'available'
    },
    machineModelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    gymId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'Machine',
    timestamps: false,
    methods: {
        estimateRepairCost() {
            if (this.status === 'broken') {
                return Math.random() * 1000;
            }
            return 0;
        }
    }
});

export default MachineModel;