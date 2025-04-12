import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const ClassModel = sequelize.define('Class', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    maxCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    currentCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    difficulty: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: false
    },
    trainerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Trainer',
            key: 'id'
        }
    }
}, {
    tableName: 'Class',
    timestamps: false,
    sequelize
});

export default ClassModel;