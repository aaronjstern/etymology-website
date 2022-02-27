const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const { urlencoded } = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const Blog = require("./model.js");
const { text } = require("cheerio/lib/api/manipulation");

// const methodOverride = require("method-override");

mongoose.connect("mongodb://localhost:27017/etymologydb");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database Connected");
});

const oxfordSearch = async function (query) {
  return (blogDocs = await Blog.find({
    Words: query,
  }));
};

const etymOnline = async function () {
  axios(`https://www.etymonline.com/word/${word}`).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const entry = [];
    $("div.word--C9UPa p").each((i, el) => {
      const item = $(el).text();
      entry.push(item);
    });
  });
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(methodOverride("_method"));

app.get("/search", (req, res) => {
  res.render("index.ejs");
});

app.post("/search", (req, res) => {
  console.log(req.body);
  const { word } = req.body;
  res.redirect(`/search/${word}`);
});

app.get("/search/:word", async (req, res) => {
  const { word } = req.params;
  const oxford = await oxfordSearch(word);
  axios(`https://www.etymonline.com/word/${word}`)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const eOnline = [];
      $("div.word--C9UPa p").each((i, el) => {
        const item = $(el).text();
        eOnline.push(item);
      });
      const error = "";
      res.render("word.ejs", { word, eOnline, error, oxford });
    })
    .catch(() => {
      const error = `Nothing for ${word}`;
      const eOnline = "";
      res.render("word.ejs", { word, eOnline, error, oxford });
    });
});

app.listen(8080, () => {
  console.log("LISTENING ON 8080");
});
