const express = require("express");
const ejs = require("ejs");
const https = require("https");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("home");
});

app.post("/", function (req, res) {
  const filmName = req.body.title;
  const apiKey = process.env.API;
  const mainUrl = process.env.URL;
  const url = mainUrl + apiKey + "&t=" + filmName;
  https.get(url, function (response) {
    const chunks = [];
    response
      .on("data", function (data) {
        chunks.push(data);
      })
      .on("end", function () {
        const data = Buffer.concat(chunks);
        const schema = JSON.parse(data);
        const response = schema.Response;
        if (response === "True") {
          const title = schema.Title;
          const posterUrl = schema.Poster;
          const released = schema.Released;
          const genre = schema.Genre;
          const director = schema.Director;
          const actors = schema.Actors;
          const plot = schema.Plot;
          const language = schema.Language;
          const imdbRating = schema.imdbRating;
          res.render("details", {
            title: title,
            posterUrl: posterUrl,
            released: released,
            genre: genre,
            director: director,
            actors: actors,
            plot: plot,
            imdbRating: imdbRating,
            language: language,
          });
        } else {
          res.render("failure");
        }
      });
  });
});

app.listen("3000", function () {
  console.log("Server started running at port 3000.");
});
