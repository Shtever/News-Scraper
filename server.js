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
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// Default folder
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/News-Scraper", {useNewUrlParser: true});