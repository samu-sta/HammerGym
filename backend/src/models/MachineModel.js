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
    }
}, {
    tableName: 'MachineModel',
    timestamps: false,
    sequelize

});

export default MachineModelModel;