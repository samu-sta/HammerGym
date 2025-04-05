import { DataTypes } from "sequelize"
import sequelize from "../database/database.js"

const MembershipModel = sequelize.define('Membership', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'Membership',
    timestamps: false,
    sequelize
});

export default MembershipModel;