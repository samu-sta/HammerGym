import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const TrainerModel = sequelize.define('Trainer', {
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Account',
      key: 'id'
    }
  }
}, {
  tableName: 'Trainer',
  timestamps: true
});

export default TrainerModel;