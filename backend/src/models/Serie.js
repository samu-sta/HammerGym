import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const SerieModel = sequelize.define('Serie', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idTrainingDay: {
        type: DataTypes.INTEGER,
        references: {
            model: 'TrainingDay',
            key: 'id'
        }
    },
    idExercise: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Exercise',
            key: 'id'
        }
    },
    reps: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    weigth: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    sensations: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 10
        }
    },
    injured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'Serie',
    timestamps: false,
    sequelize
});

export default SerieModel;