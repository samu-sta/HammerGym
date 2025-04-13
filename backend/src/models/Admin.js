import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const AdminModel = sequelize.define('Admin', {
    accountId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'Admin',
    timestamps: false,
    sequelize
});

export default AdminModel;