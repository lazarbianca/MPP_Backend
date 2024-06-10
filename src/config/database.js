const { Sequelize } = require("sequelize");
const crypto = require("crypto");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);

// const sequelize = new Sequelize("MPP_PAINTINGS", "postgres", "0000", {
//   host: "localhost",
//   dialect: "postgres",
// });

// const jwtSecret = crypto.randomBytes(64).toString("hex");
const jwtSecret =
  "c206be3143d5ec86a41c3ff995fc45769d7c03a2ad7859de02b8cd29c05da963b5edf76205838e7ae1136c1cde71c621ca9466f4cd033fcc00eaeb0b93598fba";
console.log("JWT Secret:", jwtSecret);

module.exports = { sequelize, jwtSecret };
// module.exports = sequelize;
