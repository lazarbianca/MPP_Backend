const request = require("supertest");
const { sequelize } = require("../config/database");
const db = sequelize;
const serverFile = require("../../index");
let s = serverFile.s;
const appFile = require("../app");
const app = appFile.app;
const Painting = require("../model/painting");
const Artist = require("../model/artist");

// db.truncate();
// POST ///////////////////////////////////////////////////////////////////////////////////////////////////////
describe("POST /addArtist", () => {
  beforeEach(async () => {
    // db.sync({ force: true });
    try {
      await db.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
    s = serverFile.s;
  });
  afterEach((done) => {
    s.close(done);
  });

  it("should add a new artist", async () => {
    const newArtist = {
      name: "Vincent Willem van Gogh",
      birthYear: 1853,
      deathYear: 1890,
    };

    const response = await request(app).post("/addArtist").send(newArtist);
    expect(response.status).toBe(201);

    const { name, birthYear, deathYear } = response.body;

    expect(name).toBe(newArtist.name);
    expect(birthYear).toBe(newArtist.birthYear);
    expect(deathYear).toBe(newArtist.deathYear);
  });
});

describe("POST /addPainting", () => {
  beforeEach(async () => {
    try {
      await db.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
    s = serverFile.s.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  });
  afterEach((done) => {
    s.close(done);
  });

  it("should add a new painting", async () => {
    const existingArtistId = 1;
    const newPainting = {
      artistId: existingArtistId,
      title: "Sample Painting",
      author: "Sample Author",
      year: 2024,
      movement: "POSTMODERNISM",
      imageUrl: "http://example.com/sample-image.jpg",
      museum: "Sample Museum",
    };

    const response = await request(app).post("/addPainting").send(newPainting);
    expect(response.status).toBe(201);

    const { artistId, title, author, year, movement, imageUrl, museum } =
      response.body;

    expect(artistId).toBe(newPainting.artistId);
    expect(title).toBe(newPainting.title);
    expect(author).toBe(newPainting.author);
    expect(year).toBe(newPainting.year);
    expect(movement).toBe(newPainting.movement);
    expect(imageUrl).toBe(newPainting.imageUrl);
    expect(museum).toBe(newPainting.museum);
  });
});

// // GET ///////////////////////////////////////////////////////////////////////////////////////////////////////
describe("GET /getPaintings", () => {
  beforeEach(async () => {
    try {
      await db.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
    s = serverFile.s.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  });

  afterAll((done) => {
    s.close(done);
  });

  it("should return a list of paintings", async () => {
    const response = await request(app).get("/getPaintings");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/json/);

    const paintings = response.body;
    expect(Array.isArray(paintings)).toBe(true);
    const numberOfPaintings = 1;
    expect(paintings.length).toBe(numberOfPaintings);
  });
});

describe("GET /getArtists", () => {
  beforeEach(async () => {
    try {
      await db.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
    s = serverFile.s.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  });

  afterAll((done) => {
    s.close(done);
  });

  it("should return a list of artists", async () => {
    const response = await request(app).get("/getArtists");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/json/);

    const artists = response.body;
    expect(Array.isArray(artists)).toBe(true);
    const numberOfArtists = 1;
    expect(artists.length).toBe(numberOfArtists);
  });
});

// UPDATE ///////////////////////////////////////////////////////////////////////////////////////////////////////

describe("PUT /updatePainting/:paintingId", () => {
  beforeAll(async () => {
    try {
      await db.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
    s = serverFile.s.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  });
  afterAll((done) => {
    s.close(done);
  });

  it("should update an existing painting", async () => {
    const existingPaintingId = 1;
    const existingArtistId = 1;

    const updatedPaintingData = {
      artistId: existingArtistId,
      title: "Updated Painting Title",
      author: "Updated Painting Author",
      year: 2025,
      movement: "POSTMODERNISM", //POSTMODERNISM
      imageUrl: "http://example.com/updated-image.jpg",
      museum: "Updated Painting Museum",
    };

    const response = await request(app)
      .put(`/updatePainting/${existingPaintingId}`)
      .send(updatedPaintingData);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: "Painting updated successfully!",
    });
  });

  it("should return 404 if painting with given ID does not exist", async () => {
    const nonExistingPaintingId = 1000;
    const nonExistingArtistId = 1000;

    const updatedPaintingData = {
      artistId: nonExistingArtistId,
      title: "Updated Painting Title",
      author: "Updated Painting Author",
      year: 2025,
      movement: "POSTMODERNISM",
      imageUrl: "http://example.com/updated-image.jpg",
      museum: "Updated Painting Museum",
    };

    const response = await request(app)
      .put(`/updatePainting/${nonExistingPaintingId}`)
      .send(updatedPaintingData);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Painting not found" });
  });
});

describe("PUT /updateArtist/:artistId", () => {
  beforeAll(async () => {
    try {
      await db.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
    s = serverFile.s.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  });
  afterAll((done) => {
    s.close(done);
  });

  it("should update an existing painting", async () => {
    const existingArtistId = 1;

    const updatedArtistData = {
      name: "Vincent Willem van Gogh",
      birthYear: 1853,
      deathYear: 1890,
    };

    const response = await request(app)
      .put(`/updateArtist/${existingArtistId}`)
      .send(updatedArtistData);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({ message: "Artist updated successfully!" });
  });

  it("should return 404 if painting with given ID does not exist", async () => {
    const nonExistingArtistId = 1000;

    const updatedArtistData = {
      name: "Vincent Willem van Gogh",
      birthYear: 1853,
      deathYear: 1890,
    };

    const response = await request(app)
      .put(`/updateArtist/${nonExistingArtistId}`)
      .send(updatedArtistData);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Artist not found" });
  });
});

// DELETE ///////////////////////////////////////////////////////////////////////////////////////////////////////

describe("DELETE /deletePainting/:paintingId", () => {
  beforeAll(async () => {
    try {
      await db.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
    s = serverFile.s.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  });
  afterAll((done) => {
    s.close(done);
  });

  it("should delete an existing painting", async () => {
    const existingPaintingId = 1;

    const response = await request(app).delete(
      `/deletePainting/${existingPaintingId}`
    );

    expect(response.status).toBe(200);

    expect(response.body).toStrictEqual({
      message: "Painting deleted successfully!",
    });
  });

  it("should return 404 if painting with given ID does not exist", async () => {
    const nonExistingPaintingId = 10000;

    const response = await request(app).delete(
      `/deletePainting/${nonExistingPaintingId}`
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Painting not found" });
  });
});

describe("DELETE /deleteArtist/:artistId", () => {
  beforeAll(async () => {
    try {
      await db.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
    s = serverFile.s.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  });
  afterAll((done) => {
    s.close(done);
  });

  it("should delete an existing artist", async () => {
    const existingArtistId = 1;

    const response = await request(app).delete(
      `/deleteArtist/${existingArtistId}`
    );

    expect(response.status).toBe(200);

    expect(response.body).toStrictEqual({
      message: "Artist deleted successfully!",
    });
  });

  it("should return 404 if artist with given ID does not exist", async () => {
    const nonExistingArtistId = 10000;

    const response = await request(app).delete(
      `/deleteArtist/${nonExistingArtistId}`
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Artist not found" });
  });
});

//npx jest
