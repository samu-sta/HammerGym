import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const MachinePart = sequelize.define('MachinePart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'MachinePart',
    timestamps: false,
    sequelize
});

export default MachinePart;
