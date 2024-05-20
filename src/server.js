import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {
  getAllPaintings,
  addPainting,
  updatePainting,
  getPaintingById,
  deletePainting,
} from "../models/paintings";
// const express = require("express");
// const bodyParser = require("body-parser");

const app = express();
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);
app.use(bodyParser.json());

app.post("/addPainting", (req, res) => {
  const { title, author, year, movement, imageUrl, museum } = req.body;
  const newPainting = { title, author, year, movement, imageUrl, museum };
  addPainting(newPainting);
  res.status(201).json(newPainting);
});

// Your other routes and server setup...

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

// const app = express();

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log("console is listening on port " + PORT);
// });

app.get("/getPaintings", (req, res) => {
  const paintings = getAllPaintings();
  res.send(paintings);
});

app.put("/updatePainting/:id", (req, res) => {
  const { id } = req.params;
  const updatedPaintingData = req.body;

  // Find the painting to update
  const paintingToUpdate = getPaintingById(parseInt(id));

  if (paintingToUpdate) {
    // Update the painting with the new data
    const updatedPainting = updatePainting(parseInt(id), updatedPaintingData);
    res.status(200).json(updatedPainting);
  } else {
    res.status(404).json({ error: "Painting not found" });
  }
});

app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const returned = deletePainting(parseInt(id));
  res.status(200).json(returned);
});

export default app;
// app.post("/", (req, res) => {
//   // const { id, title, author, year, movement, imageUrl, museum } = req.body;
//   const id = req.body.id;
//   // const newPainting = { id, title, author, year, movement, imageUrl, museum };
//   // addPainting(newPainting);
//   // res.status(201).json(newPainting);
//   res.send(id);
// });

// npm start
