import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const MembershipFeatureModel = sequelize.define(
  'MembershipFeature',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    membershipId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'memberships',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'membership_features',
    timestamps: true
  }
);

export default MembershipFeatureModel;