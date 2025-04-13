import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const assistanceListModel = sequelize.define('assistanceList', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  classId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
    attendanceDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
}, {
  tableName: 'assitanceList',
  timestamps: true
});

export default assistanceListModel;