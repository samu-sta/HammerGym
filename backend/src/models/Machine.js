import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const MachineModel = sequelize.define('Machine', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    purchaseDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    purchaseCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    replacementValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    location: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('available', 'broken', 'preparing', 'outOfService'),
        allowNull: false,
        defaultValue: 'available'
    },
    machineModelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'MachineModel',
            key: 'id'
        }
    },
    gymId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Gym',
            key: 'id'
        }
    }
}, {
    tableName: 'Machine',
    timestamps: false,
    sequelize,
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