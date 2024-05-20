const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("MPP_PAINTINGS", "postgres", "0000", {
  host: "localhost",
  dialect: "postgres",
});

module.exports = sequelize;
