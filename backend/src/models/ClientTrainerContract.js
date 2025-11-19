import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const ClientTrainerContractModel = sequelize.define('ClientTrainerContract', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'accountId'
    }
  },
  trainerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Trainer',
      key: 'accountId'
    }
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'ClientTrainerContract',
  sequelize,
  timestamps: false
});

export default ClientTrainerContractModel;
