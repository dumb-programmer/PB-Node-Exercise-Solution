"use strict";
const { Model, Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
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
      otp_expiration_date: {
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
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
