import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const MembershipModel = sequelize.define(
    'Membership',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                isNumeric: true,
                min: 0
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: 'memberships',
        timestamps: true
    }
);

export default MembershipModel;