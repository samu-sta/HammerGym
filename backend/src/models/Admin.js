import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const AdminModel = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idAccount: {
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