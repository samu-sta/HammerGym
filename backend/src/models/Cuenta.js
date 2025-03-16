import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const Cuenta = sequelize.define('Cuenta', {
    idCuenta: {
        type: DataTypes.INTEGER, // Cambiado de DataTypes,INTEGER a DataTypes.INTEGER
        primaryKey: true,
        autoIncrement: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    fechaActivacion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    login: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

}, {
    tableName: 'cuenta',
    timestamps: false

});

export default Cuenta;