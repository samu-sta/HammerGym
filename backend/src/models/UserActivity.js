import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const UserActivityModel = sequelize.define('UserActivity', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dateTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    type: {
        type: DataTypes.ENUM('Entry', 'Exit'),
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'accountId'
        }
    },
    gymId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Gym',
            key: 'id'
        }
    }
}, {
    tableName: 'UserActivity',
    timestamps: false,
    sequelize

});

export default UserActivityModel;