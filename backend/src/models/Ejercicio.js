import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const Ejercicio = sequelize.define('Ejercicio', {
    idEjercicio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    musculo: {
        type: DataTypes.ENUM('biceps', 'triceps', 'espalda', 'pecho', 'hombros', 'piernas'),
    }
}, {
    tableName: 'Membresia',
    timestamps: false

});

export default Ejercicio;