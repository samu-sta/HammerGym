import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const UserActivityModel = sequelize.define('UserActivity', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.ENUM('Entry', 'Exit'),
        allowNull: false
    },
    idGym: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Gimnasio',
            key: 'idGimnasio'
        }
    },
    idUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuario',
            key: 'id'
        }
    }
}, {
    tableName: 'UserActivity',
    timestamps: false

});

export default UserActivityModel;