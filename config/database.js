const { Sequelize } = require('sequelize'); // Import Sequelize
require('dotenv').config(); // Load environment variables from .env file

// Create a Sequelize instance using DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres', // Specify the database dialect
    logging: false, // Disable SQL logging
    dialectOptions: {
        ssl: {
            require: true, // Enforce SSL for secure connections
            rejectUnauthorized: false, // Allow self-signed certificates
        },
    },
});

module.exports = sequelize; // Export the Sequelize instance
