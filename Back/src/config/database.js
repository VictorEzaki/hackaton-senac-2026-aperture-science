const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'aperture_science',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '50ft4@t1',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
    }
);
module.exports = sequelize;
