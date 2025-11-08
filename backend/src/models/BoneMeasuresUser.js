import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const BoneMeasuresUser = sequelize.define('BoneMeasuresUser', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'accountId'
      }
    },
    boneId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Bone',
        key: 'id'
      }
    },
    exerciseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Exercise',
        key: 'id'
      }
    },
    real: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      get() {
        const value = this.getDataValue('real');
        return value ? parseFloat(value) : null;
      }
    },
    ideal: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      get() {
        const value = this.getDataValue('ideal');
        return value ? parseFloat(value) : null;
      }
    }
}, {
    tableName: 'BoneMeasuresUser',
    timestamps: false,
    sequelize
});

export default BoneMeasuresUser;