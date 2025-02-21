import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"


const UserModel = sequelize.define('User', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: "user"
  },
  realName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  lastNames: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
}, {
  sequelize,
  tableName: 'user',
  timestamps: false
});

export default UserModel;