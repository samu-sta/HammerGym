import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const SeireModel = sequelize.define('Serie', {
    idTrain: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        references: {
            model: 'Train',
            key: 'id'
        }
    },
    idExercise: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        references: {
            model: 'Exercise',
            key: 'id'
        }
    },
    type: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'Serie',
    timestamps: false
});

export default SerieModel;