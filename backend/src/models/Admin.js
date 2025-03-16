import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const AdminModel = sequelize.define('Admin', {
    accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Account',
            key: 'id'
        }
    }
}, {
    tableName: 'Admin',
    timestamps: false

});

export default AdminModel;