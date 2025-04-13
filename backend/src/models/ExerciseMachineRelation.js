import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const ExerciseMachineRelationModel = sequelize.define('ExerciseMachineRelation', {
    machineModelId: {
        type: DataTypes.INTEGER,
        foreginKey: true,
    },
    exerciseId: {
        type: DataTypes.INTEGER,
        foreginKey: true,
    }
}, {
    tableName: 'ExerciseMachineRelation',
    timestamps: false
});

export default ExerciseMachineRelationModel;