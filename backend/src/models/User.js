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
  tableName: 'user',
  timestamps: false
});

export default UserModel;