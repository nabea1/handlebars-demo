const express = require("express");
const Handlebars = require("handlebars");
const expressHandlebars = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const { sequelize, Sauce } = require("./models");

const port = 3000;

const app = express();

// serve static assets from the public/ folder
app.use(express.static("public"));

//Configures handlebars library to work well w/ Express + Sequelize model
const handlebars = expressHandlebars({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

//Tell this express app we're using handlebars
app.engine("handlebars", handlebars);
app.set("view engine", "handlebars");

const seedDb = async () => {
  await sequelize.sync({ force: true });

  const sauces = [
    { name: "Sriracha", image: "/img/Sriracha.gif" },
    { name: "Franks", image: "/img/Franks.gif" },
    { name: "Tobasco", image: "/img/Tobasco.gif" },
  ];

  const saucePromises = sauces.map((sauce) => Sauce.create(sauce));
  await Promise.all(saucePromises);
  console.log("db populated!");
};

seedDb();

//sauces route renders all sauces
app.get("/sauces", async (req, res) => {
  //find all sauces
  const sauceList = await Sauce.findAll(); //render the response with two arguments
  //argument 1.stringtemplatename
  //arg 2. data passed to template
  res.render("sauces", { sauceList }); //
});

//sauces/: id route renders one sauce by id
app.get("/sauces/:id", async (req, res) => {
  const sauce = await Sauce.findByPk(req.params.id);
  res.render("sauce", { sauce });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
