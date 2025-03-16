import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const SeriesModel = sequelize.define('Series', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  repetitions: {
    type: DataTypes.STRING(255), // "15,12,10"
    allowNull: false,
    get() {
      return this.getDataValue('repetitions').split(',').map(Number);
    },
    set(val) {
      if (Array.isArray(val)) {
        this.setDataValue('repetitions', val.join(','));
      } else {
        this.setDataValue('repetitions', String(val));
      }
    }
  },
  restMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Series',
  timestamps: true
});

export default SeriesModel;