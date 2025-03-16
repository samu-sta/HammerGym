import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const Gimnasio = sequelize.define('Gimnasio', {
    idGimnasio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Ubicacion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    capacidadMaxima: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    afluenciaActual: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'Gimnasio',
    timestamps: false

});

export default Gimnasio;