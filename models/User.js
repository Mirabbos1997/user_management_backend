const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensures unique email
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_login: {
        type: DataTypes.DATE,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active', // Possible values: active, blocked
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = User;
