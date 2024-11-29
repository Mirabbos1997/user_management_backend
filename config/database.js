const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use DATABASE_URL for Render Deployment
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true, // Enforce SSL
            rejectUnauthorized: false, // Allow self-signed certificates
        },
    },
});

module.exports = sequelize;
