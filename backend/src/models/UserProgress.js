import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"


const UserProgressModel = sequelize.define('UserProgress', {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'User',
      key: 'accountId'
    }
  },
  howWasIt: {
    type: DataTypes.ENUM('reallyEasy', 'easy', 'medium', 'hard', 'reallyHard'),
    allowNull: false
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true
  },
}, {
  tableName: 'UserProgress',
  timestamps: false,
  sequelize
});

export default UserProgressModel;