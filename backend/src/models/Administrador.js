import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const Adminsitrador = sequelize.define('administrador', {
    idAdministrador: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    tableName: 'Membresia',
    timestamps: false

});

export default Membresia;