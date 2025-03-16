import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"


const tuplaEjMq = sequelize.define('tuplaEjMq', {
    idmodeloMaquina: {
        type: DataTypes.INTEGER,
        foreginKey: true,

        references: {
            model: 'modeloMaquina',
            key: 'idmodeloMaquina'
        }
    },
    idEjercicio: {
        type: DataTypes.INTEGER,
        foreginKey: true,

        references: {
            model: 'ejercicio',
            key: 'idEjercicio'
        }
    }
}, {
    tableName: 'tuplaEjMq',
    timestamps: false

});

export default tuplaEjMq;