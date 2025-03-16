import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const modeloMaquina = sequelize.define('modeloMaquina', {
    idmodeloMaquina: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    marca: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
}, {
    tableName: 'Membresia',
    timestamps: false

});

export default modeloMaquina;