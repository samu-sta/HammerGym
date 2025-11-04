import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const Bone = sequelize.define('Bone', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'Bone',
  timestamps: false,
  sequelize
});

export default Bone;