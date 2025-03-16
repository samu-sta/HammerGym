import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const Usuario = sequelize.define('Usuario', {
    idUsuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    peso: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    idCuenta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Cuenta',
            key: 'idCuenta'
        }
    }

}, {
    tableName: 'Usuario',
    timestamps: false

});

export default Usuario;