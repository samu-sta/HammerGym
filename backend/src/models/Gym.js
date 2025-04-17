import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const GymModel = sequelize.define('Gym', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    telephone: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    maxCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    currentOccupancy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'Gym',
    timestamps: false,
    sequelize
});

export default GymModel;