import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const SerieModel = sequelize.define('Serie', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idTrainingDay: {
        type: DataTypes.INTEGER
    },
    idExercise: {
        type: DataTypes.INTEGER
    },
    reps: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    weigth: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
}, {
    tableName: 'Serie',
    timestamps: false
});

export default SerieModel;