import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const Maquina = sequelize.define('maquina', {
    idMaquina: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    estado: {
        type: DataTypes.ENUM('libre', 'ocupado', 'mantenimiento', 'outservice'),
        allowNull: false
    },
    idModeloMaquina: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'modeloMaquina',
            key: 'idmodeloMaquina'
        }
    },
    idGimnasio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'gimnasio',
            key: 'idGimnasio'
        }
    }
}, {
    tableName: 'Maquina',
    timestamps: false
});

export default Maquina;