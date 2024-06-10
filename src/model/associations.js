const Painting = require("./painting");
const Artist = require("./artist");
const User = require("./user");
const Evaluation = require("./evaluations");

Painting.belongsTo(Artist, { foreignKey: "artistId" });
Artist.hasMany(Painting, { foreignKey: "artistId" });

User.hasMany(Evaluation, { foreignKey: "userId" });
Evaluation.belongsTo(User, { foreignKey: "userId" });

Painting.hasMany(Evaluation, { foreignKey: "paintingId", as: "Evaluation" });
Evaluation.belongsTo(Painting, { foreignKey: "paintingId" });

module.exports = { Painting, Artist, User, Evaluation };
