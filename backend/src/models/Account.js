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
    username: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
}, {
    tableName: 'Account',
    timestamps: false,
    sequelize
});

export default AccountModel;