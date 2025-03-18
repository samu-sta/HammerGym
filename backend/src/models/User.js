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
  }
}, {
  tableName: 'User',
  timestamps: false,
  sequelize
});

export default UserModel;