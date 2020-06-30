var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

var router = express.Router();
require("./config/routes")(router);

// Configure middleware

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
// Router middleware to connect router in routes.js
app.use(router);
// Connect to the Mongo DB
var mondb = process.env.MOGODB_URI || "mongodb://localhost/mongoVegieArticles";
mongoose.connect(mondb, { useNewUrlParser: true }, function(error) {
    if (error) {
        console.log(error);
    } else {
        console.log("mongoose connection successful");
    }
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});