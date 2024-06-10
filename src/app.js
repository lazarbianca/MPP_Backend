const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Op } = require("sequelize");
const { sequelize } = require("./config/database");
const db = sequelize;
const { Painting, Artist, Evaluation } = require("./model/associations");
const populateArtists = require("./services/artistsPopulation");
const populatePaintings = require("./services/paintingsPopulation");
const authRoutes = require("./routes"); // New auth routes
const {
  authenticateToken,
  authorizeRole,
} = require("./services/authMiddleware");
const populateUsers = require("./services/usersPopulation");

//{ force: true }
(async () => {
  try {
    await db.sync();
    await populateArtists();
    await populatePaintings();
    console.log("Database initialization complete!");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
})();

(async () => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

const app = express();
app.use(cors({ credentials: true, origin: ["http://localhost:3000"] }));
app.use(bodyParser.json());

app.use("/auth", authRoutes);

app.post("/getPaintings", authenticateToken, async (req, res) => {
  try {
    console.log("Entered getPaintings");
    const userId = req.body.userId; // Assuming you have the userId from the currently logged-in user

    const paintings = await Painting.findAll({
      include: [
        {
          model: Artist,
          attributes: ["name"],
        },
        {
          model: Evaluation,
          attributes: ["price"],
          as: "Evaluation",
          where: {
            userId: { [Op.or]: [userId, null] }, // Include evaluations of the logged-in user and paintings without evaluations
          },
          required: false, // Left join to include paintings without evaluations
        },
      ],
    });

    // Map the paintings to include only evaluations of the logged-in user
    const result = paintings.map((painting) => {
      const userEvaluation = painting.Evaluation.find(
        (evaluation) => evaluation.userId === userId
      );
      return {
        ...painting.toJSON(),
        evaluation: userEvaluation ? { price: userEvaluation.price } : null,
      };
    });

    res.json(result);
  } catch (error) {
    console.log("Error fetching paintings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getArtists", async (req, res) => {
  try {
    const artists = await Artist.findAll();
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/eval/:paintingId", authenticateToken, async (req, res) => {
  const { paintingId } = req.params;
  const { price, userId } = req.body;
  try {
    const newEval = await Evaluation.create({ paintingId, userId, price });
    res.status(201).json(newEval);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.put("/updateEval/:paintingId", authenticateToken, async (req, res) => {
  const { paintingId } = req.params;
  const { price, userId } = req.body;
  try {
    const [affectedCount] = await Evaluation.update(
      { paintingId, userId, price },
      {
        where: { paintingId, userId },
        returning: true,
      }
    );
    if (affectedCount === 0)
      return res.status(404).json({ error: "Evaluation not found" });
    res.status(200).json({ message: "Evaluation updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add protected routes for managers and admins
app.post(
  "/addPainting",
  authenticateToken,
  authorizeRole(["manager", "admin"]),
  async (req, res) => {
    const { artistId, title, year, movement, imageUrl, museum } = req.body;
    try {
      const newPainting = await Painting.create({
        artistId,
        title,
        year,
        movement,
        imageUrl,
        museum,
      });
      res.status(201).json(newPainting);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

app.post(
  "/addArtist",
  authenticateToken,
  authorizeRole(["manager", "admin"]),
  async (req, res) => {
    const { name, birthYear, deathYear } = req.body;
    try {
      const newArtist = await Artist.create({ name, birthYear, deathYear });
      res.status(201).json(newArtist);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

app.put(
  "/updatePainting/:paintingId",
  authenticateToken,
  authorizeRole(["manager", "admin"]),
  async (req, res) => {
    const { paintingId } = req.params;
    const updatedPaintingData = req.body;
    try {
      const [affectedCount] = await Painting.update(updatedPaintingData, {
        where: { paintingId },
        returning: true,
      });
      if (affectedCount === 0)
        return res.status(404).json({ error: "Painting not found" });
      res.status(200).json({ message: "Painting updated successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.put(
  "/updateArtist/:artistId",
  authenticateToken,
  authorizeRole(["manager", "admin"]),
  async (req, res) => {
    const { artistId } = req.params;
    const updatedArtistData = req.body;
    try {
      const [affectedCount] = await Artist.update(updatedArtistData, {
        where: { artistId },
        returning: true,
      });
      if (affectedCount === 0)
        return res.status(404).json({ error: "Artist not found" });
      res.status(200).json({ message: "Artist updated successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.delete(
  "/deletePainting/:paintingId",
  authenticateToken,
  authorizeRole(["manager", "admin"]),
  async (req, res) => {
    const { paintingId } = req.params;
    try {
      const rowsAffected = await Painting.destroy({ where: { paintingId } });
      if (rowsAffected === 0)
        return res.status(404).json({ error: "Painting not found" });
      res.status(200).json({ message: "Painting deleted successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.delete(
  "/deleteArtist/:artistId",
  authenticateToken,
  authorizeRole(["manager", "admin"]),
  async (req, res) => {
    const { artistId } = req.params;
    try {
      const rowsAffected = await Artist.destroy({ where: { artistId } });
      if (rowsAffected === 0)
        return res.status(404).json({ error: "Artist not found" });
      res.status(200).json({ message: "Artist deleted successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = {
  app,
};

/////////////////

// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// const db = require("./config/database");
// const { Painting, Artist } = require("./model/associations");
// const populateArtists = require("./services/artistsPopulation");
// const populatePaintings = require("./services/paintingsPopulation");

// (async () => {
//   try {
//     await db.sync({ force: true }); // Sync the database schema
//     await populateArtists(); // Populate artists first
//     await populatePaintings(); // Populate paintings afterwards
//     console.log("Database initialization complete!");
//   } catch (error) {
//     console.error("Error initializing database:", error);
//   }
// })();
/////////
// Sync the models with the database
// db.sync({})
//   .then(() => {
//     console.log("Database synchronized");
//     // Start your server or perform other operations here
//   })
//   .catch((error) => {
//     console.error("Error syncing database:", error);
//   });
//////////
// (async () => {
//   try {
//     await db.authenticate();
//     console.log("Connection has been established successfully.");
//     return db; // Return the sequelize instance after connection
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//     throw error; // Throw error to handle it in the caller
//   }
// })();

// const app = express();
// app.use(
//   cors({
//     credentials: true,
//     origin: ["http://localhost:3000"],
//   })
// );
// app.use(bodyParser.json());

// // Include the auth routes
// app.use("/api/auth", authRoutes);

// app.get("/getPaintings", async (req, res) => {
//   try {
//     const paintings = await Painting.findAll({
//       include: {
//         model: Artist,
//         attributes: ["name"], // Include only the artist's name
//       },
//     });
//     res.json(paintings);
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
// app.get("/getArtists", async (req, res) => {
//   try {
//     const artists = await Artist.findAll();
//     res.json(artists);
//   } catch (error) {
//     res.status(500).json({ error: "Sorry! Internal Server Error" });
//   }
// });
// app.get("/artist/:name");

// app.post("/addPainting", async (req, res) => {
//   const { artistId, title, author, year, movement, imageUrl, museum } =
//     req.body;
//   try {
//     const newPainting = await Painting.create({
//       artistId,
//       title,
//       author,
//       year,
//       movement,
//       imageUrl,
//       museum,
//     });
//     res.status(201).json(newPainting);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });
// app.post("/addArtist", async (req, res) => {
//   const { name, birthYear, deathYear } = req.body;
//   try {
//     const newArtist = await Artist.create({
//       name,
//       birthYear,
//       deathYear,
//     });
//     res.status(201).json(newArtist);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// app.put("/updatePainting/:paintingId", async (req, res) => {
//   const { paintingId } = req.params;
//   const updatedPaintingData = req.body;

//   try {
//     const [affectedCount, affectedRows] = await Painting.update(
//       updatedPaintingData,
//       {
//         where: { paintingId },
//         returning: true, // This option enables returning the affected entities
//       }
//     );

//     if (affectedCount === 0) {
//       return res.status(404).json({ error: "Painting not found" });
//     }

//     // const updatedPainting = affectedRows[0];
//     res.status(200).json({ message: "Painting updated successfully!" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.put("/updateArtist/:artistId", async (req, res) => {
//   const { artistId } = req.params;
//   const updatedArtistData = req.body;

//   try {
//     const [affectedCount, affectedRows] = await Artist.update(
//       updatedArtistData,
//       {
//         where: { artistId },
//         returning: true, // This option enables returning the affected entities
//       }
//     );

//     if (affectedCount === 0) {
//       return res.status(404).json({ error: "Artist not found" });
//     }

//     res.status(200).json({ message: "Artist updated successfully!" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.delete("/deletePainting/:paintingId", async (req, res) => {
//   const { paintingId } = req.params;

//   try {
//     const rowsAffected = await Painting.destroy({ where: { paintingId } });
//     if (rowsAffected === 0) {
//       return res.status(404).json({ error: "Painting not found" });
//     }
//     res.status(200).json({ message: "Painting deleted successfully!" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// app.delete("/deleteArtist/:artistId", async (req, res) => {
//   const { artistId } = req.params;
//   try {
//     const rowsAffected = await Artist.destroy({ where: { artistId } });
//     if (rowsAffected === 0) {
//       return res.status(404).json({ error: "Artist not found" });
//     }
//     res.status(200).json({ message: "Artist deleted successfully!" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = {
//   app: app,
// };
