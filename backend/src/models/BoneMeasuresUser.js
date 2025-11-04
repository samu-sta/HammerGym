import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const BoneMeasuresUser = sequelize.define('BoneMeasuresUser', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'User',
        key: 'accountId'
      }
    },
    boneId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'Bone',
        key: 'id'
      }
    },
    real: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ideal: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
}, {
    tableName: 'Exercise',
    timestamps: false,
    sequelize
});

export default ExerciseModel;