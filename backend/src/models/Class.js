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
    difficulty: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: false
    },
    trainerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    scheduleid: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'Class',
    timestamps: false
});

export default ClassModel;