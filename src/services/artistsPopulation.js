// artistPopulation.js
const Artist = require("../model/artist");

async function populateArtists() {
  try {
    await Artist.bulkCreate([
      {
        name: "Leonardo Da Vinci",
        birthYear: 1452,
        deathYear: 1519,
      },
      {
        name: "Vincent van Gogh",
        birthYear: 1853,
        deathYear: 1890,
      },
      {
        name: "Pablo Picasso",
        birthYear: 1881,
        deathYear: 1973,
      },
      {
        name: "Claude Monet",
        birthYear: 1840,
        deathYear: 1926,
      },
      {
        name: "Salvador Dalí",
        birthYear: 1904,
        deathYear: 1989,
      },
      {
        name: "Artemisia Gentileschi",
        birthYear: 1593,
        deathYear: 1653,
      },
      {
        name: "Francisco Goya",
        birthYear: 1746,
        deathYear: 1828,
      },
      {
        name: "Andy Warhol",
        birthYear: 1928,
        deathYear: 1987,
      },
    ]);
    console.log("Artists table populated successfully!");
  } catch (error) {
    console.error("Error populating artists:", error);
  }
}

module.exports = populateArtists;
