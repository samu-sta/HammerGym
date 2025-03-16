import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const AccountModel = sequelize.define('Account', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    login: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
}, {
    tableName: 'Account',
    timestamps: false
});

export default AccountModel;