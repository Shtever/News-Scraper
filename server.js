//NPM package requirements//
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");
var logger = require("morgan");
var MONGOD_URI = process.env.MONGOD_URI || "mongodb://localhost/News-Scraper"


//require items in models folder//
var db = require("./models");
var PORT = 3000;

//Exptress//
var app = express();
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Boilerplate stuff for json
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Default folder
app.use(express.static("public"));
// Mongo DB 
mongoose.connect("mongodb://localhost/News-Scraper", { useNewUrlParser: true });

// scrape route *** SEE EXERCISE 11 *** //
app.get("/", function (req, res) {
  axios.get("https://www.aljazeera.com/").then(function (response) {
    var $ = cheerio.load(response.data);
    var results = [];
    console.log("BINGO BANGO")

    $("article.mts-article-title").each(function (i, element) {
      var title = $(element).children().text();
      var link = $(element).find("a").attr("href");
      var img =  $(element).children().find("img").attr("src");
      results.push({
        title: title,
        link: link,
        img: img
      });
console.log(img)
      // Create a new Article using the `result` object built from scraping
      db.Article.create(results)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);

        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Article.findById(req.params.id)
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note.create(req.body)
    .then(function (dbArticle) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbArticle._id }, { new: true });
    })
    .then(function (results) {
      res.json(results);
    })
    .catch(function (err) {
      res.json(err);
    })
});

app.delete("/articles/:id", function (req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note.remove(req.body)
    .then(function (dbArticle) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbArticle._id }, { new: true });
    })
    .then(function (results) {
      res.json(results);
    })
    .catch(function (err) {
      res.json(err);
    })
});

// Start the server
app.listen(PORT, function () {
  console.log("App running http://localhost:" + PORT);
});
