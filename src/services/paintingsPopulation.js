// paintingPopulation.js
const Painting = require("../model/painting");

async function populatePaintings() {
  try {
    await Painting.bulkCreate([
      {
        artistId: 1,
        title: "Gioconda",
        year: 1503,
        movement: "Renaissance",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/640px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
        museum: "Louvre museum",
      },
      {
        artistId: 2,
        title: "The Starry Night",
        year: 1889,
        movement: "Impressionism",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
        museum: "Museum of Modern Art",
      },
      {
        artistId: 3,
        title: "Guernica",
        year: 1937,
        movement: "Surrealism",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/PicassoGuernica.jpg/400px-PicassoGuernica.jpg",
        museum: "Museo Reina Sofia",
      },
      {
        artistId: 4,
        title: "Woman with a Parasol - Madame Monet and Her Son",
        year: 1875,
        movement: "Impressionism",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/8/8b/Claude_Monet%2C_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son%2C_1875%2C_NGA_61379.jpg",
        museum: "National Gallery of Art",
      },
      {
        artistId: 5,
        title: "The Persistence of Memory",
        year: 1931,
        movement: "Surrealism",
        imageUrl:
          "https://cdn.britannica.com/96/240496-138-66D89FAD/Salvador-Dali-Persistence-of-Memory.jpg?w=800&h=450&c=crop",
        museum: "Museum of Modern Art",
      },
      {
        artistId: 6,
        title: "Judith Slaying Holofernes",
        year: 1620,
        movement: "Baroque",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/4/4e/Artemisia_Gentileschi_-_Judith_Beheading_Holofernes_-_WGA8563.jpg",
        museum: "Uffizi Gallery",
      },
      {
        artistId: 7,
        title: "Saturn Devouring His Son",
        year: 1823,
        movement: "Romanticism",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/8/82/Francisco_de_Goya%2C_Saturno_devorando_a_su_hijo_%281819-1823%29.jpg",
        museum: "Museo del Prado",
      },
      {
        artistId: 8,
        title: "Marilyn Diptych",
        year: 1962,
        movement: "Post Modernism",
        imageUrl:
          "https://smarthistory.org/wp-content/uploads/2022/02/MarilynDip-scaled.jpg",
        museum: "Tate",
      },
    ]);
    console.log("Paintings table populated successfully!");
  } catch (error) {
    console.error("Error populating paintings:", error);
  }
}

module.exports = populatePaintings;
