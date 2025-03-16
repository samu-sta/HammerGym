import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const Clase = sequelize.define('Clase', {
    idClase: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    capacidadMaxima: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dificultad: {
        type: DataTypes.ENUM('baja', 'media', 'alta'),
        allowNull: false
    }
}, {
    tableName: 'clase',
    timestamps: false

});

export default Clase;