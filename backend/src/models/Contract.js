import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const ContractModel = sequelize.define(
  'Contract',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User', // Changed from 'users' to 'User' to match the table name
        key: 'accountId'
      }
    },
    membershipId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'memberships',
        key: 'id'
      }
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed'),
      defaultValue: 'paid'
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paymentReference: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'contracts',
    timestamps: true
  }
);

export default ContractModel;