const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Evaluation = sequelize.define(
  "Evaluation",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "Users", // Name of the users table
        key: "userId",
      },
    },
    paintingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "Paintings", // Name of the paintings table
        key: "paintingId",
      },
    },
    price: {
      type: DataTypes.DOUBLE,
    },
  },
  {
    tableName: "Evaluations",
  }
);

module.exports = Evaluation;
