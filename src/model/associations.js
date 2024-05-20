const Painting = require("./painting");
const Artist = require("./artist");

Painting.belongsTo(Artist, { foreignKey: "artistId" });
Artist.hasMany(Painting, { foreignKey: "artistId" });

module.exports = { Painting, Artist };
