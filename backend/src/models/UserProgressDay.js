import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const UserProgressDayModel = sequelize.define('UserProgressDay', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  userProgressId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'UserProgress',
      key: 'id'
    }
  }
}, {
  tableName: 'UserProgressDay',
  timestamps: true
});

export default UserProgressDayModel;