import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const ExerciseModel = sequelize.define('Exercise', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    muscles: {
        type: DataTypes.ENUM('biceps', 'triceps', 'back', 'chest', 'shoulders', 'legs'),
    }
}, {
    tableName: 'Exercise',
    timestamps: false,
    sequelize
});

export default ExerciseModel;