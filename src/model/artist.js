const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database");

const Artist = db.define(
  "Artist",
  {
    artistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true, // Enable auto-generation of IDs
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deathYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Artists",
  }
);

module.exports = Artist;
