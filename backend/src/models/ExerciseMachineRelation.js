import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const ExerciseMachineRelationModel = sequelize.define('ExerciseMachineRelation', {
    machineModelId: {
        type: DataTypes.INTEGER,
        foreginKey: true,
        references: {
            model: 'MachineModel',
            key: 'id'
        }
    },
    exerciseId: {
        type: DataTypes.INTEGER,
        foreginKey: true,
        references: {
            model: 'Exercise',
            key: 'id'
        }
    }
}, {
    tableName: 'ExerciseMachineRelation',
    timestamps: false
});

export default ExerciseMachineRelationModel;