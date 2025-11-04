import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"


const UserModel = sequelize.define('User', {
  accountId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'Account',
      key: 'id'
    }
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true
  },
  weight: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  height: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  restingBpm: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  sessionDurationHours: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  fatPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  waistCircumferenceCm: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  maxWaistCircumferenceCm: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  }
}, {
  tableName: 'User',
  timestamps: false,
  sequelize
});

export default UserModel;