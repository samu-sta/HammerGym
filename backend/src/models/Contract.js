import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
// hacer que la clave primaria sea membership y se guarde idContract en user
const ContractModel = sequelize.define('Contract', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  membershipId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Contract',
  timestamps: true
});

export default ContractModel;