//NPM package requirements//
var express = require("express");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");
var logger = require("morgan");

//require items in models folder//
var db = require("./models");
var PORT = 3000;

//Exptress//
var app = express();

// Boilerplate stuff for json
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Default folder
app.use(express.static("public"));

// Mongo DB 
mongoose.connect("mongodb://localhost/News-Scraper", { useNewUrlParser: true });

// scrape route //
app.get("/", function (req, res) {
    axios.get("https://www.aljazeera.com/").then(function (response) {
        var $ = cheerio.load(response.data);
        var results = [];
        $("h1.mts-article-title").each(function (i, element) {
            var title = $(element).children().text();
            var link = $(element).find("a").attr("href");
            results.push({
                title: title,
                link: link
            });
        });

        // Log the results once you've looped through each of the elements found with cheerio
        console.log(results);
    })
    .catch(function(err) {
        console.log(err);
    })
});

app.listen(PORT, function () {
    console.log("App running: https://localhost:" + PORT);
  });
  