const { DataTypes, Sequelize } = require("sequelize");

const sequelize = require("../db");

const User = sequelize.define("Users", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255],
    },
  },
  otp: {
    type: DataTypes.INTEGER(4),
  },
  otp_expiration: {
    type: DataTypes.DATE,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [11],
    },
    primaryKey: true,
  },
});

module.exports = User;
