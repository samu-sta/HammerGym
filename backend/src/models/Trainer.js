import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const TrainerModel = sequelize.define('Trainer', {
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Account',
      key: 'id'
    }
  },
  averageRating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'Trainer',
  sequelize,
  timestamps: false
});

export default TrainerModel;