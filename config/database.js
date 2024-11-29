const { Sequelize } = require('sequelize'); // Import Sequelize
require('dotenv').config(); // Load environment variables

// Log DATABASE_URL for debugging
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Throw an error if DATABASE_URL is not set
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in the environment variables.');
}

// Create Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres', // Specify database dialect
    logging: false, // Disable SQL logging
    dialectOptions: {
        ssl: {
            require: true, // Enforce SSL for secure connections
            rejectUnauthorized: false, // Allow self-signed certificates
        },
    },
});

module.exports = sequelize; // Export Sequelize instance
