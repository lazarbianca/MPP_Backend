const appFile = require("./src/app");
const app = appFile.app;

const PORT = 5000;
const server = app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

module.exports = {
  s: server,
};

// node index.js
