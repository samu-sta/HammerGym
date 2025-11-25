import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const MachineModelModel = sequelize.define('MachineModel', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    brand: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    criticality: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: true,
        validate: {
            min: 1.0,
            max: 5.0
        },
        comment: 'Criticality rating 1.0-5.0'
    }
}, {
    tableName: 'MachineModel',
    timestamps: false,
    sequelize

});

export default MachineModelModel;