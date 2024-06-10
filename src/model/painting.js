const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Painting = sequelize.define(
  "Painting",
  {
    paintingId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Enable auto-generation of IDs
      allowNull: false, // Ensure it does not allow null values for existing records
    },
    artistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      foreignKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    movement: {
      type: DataTypes.ENUM(
        "Renaissance",
        "Baroque",
        "Romanticism",
        "Realism",
        "Impressionism",
        "Surrealism",
        "Post Modernism"
      ),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    museum: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Paintings",
  }
);

module.exports = Painting;
