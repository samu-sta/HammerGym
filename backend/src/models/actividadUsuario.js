import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const actividadUsuario = sequelize.define('actividadUsuario', {
    idActividad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo: {
        type: DataTypes.ENUM('Entrada', 'Salida'),
        allowNull: false
    },
    idGimnasio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Gimnasio',
            key: 'idGimnasio'
        }
    },
    idMaquina: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Maquina',
            key: 'idMaquina'
        }
    },
    idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuario',
            key: 'idUsuario'
        }
    }
}, {
    tableName: 'Membresia',
    timestamps: false

});

export default Membresia;