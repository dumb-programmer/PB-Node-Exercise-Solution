const { Sequelize } = require("sequelize");

const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const HOST = process.env.DB_HOST;
const DB = process.env.DB_NAME;

const sequelize = new Sequelize(`mysql://${USER}:${PASSWORD}@${HOST}/${DB}`);

module.exports = sequelize;
