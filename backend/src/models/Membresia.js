import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const Membresia = sequelize.define('Membresia', {
    idMembresia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    precio: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'Membresia',
    timestamps: false

});

export default Membresia;