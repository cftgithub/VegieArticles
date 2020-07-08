var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// Scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

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

// Connect to the Mongo DB
var MONGODB_URI = process.env.MOGODB_URI || "mongodb://localhost/vegieArticles";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, function (error) {
    if (error) {
        console.log(error);
    } else {
        console.log("mongoose connection successful");
    }
});

app.get("/", function (req, res) {
    db.Article.find({})
        .lean()
        .then(function (response) {
            var dbResponse = {
                articles: response
            };
            res.render("index", dbResponse);
        })
        .catch(function (err) {
            console.log(err);
            res.send(err);
        });
});

// A GET route for scraping the website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://pestadvisories.usu.edu/category/fruit/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $("article").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .find("h2")
                .text();
            result.link = $(this)
                .find("h2")
                .children()
                .attr("href");
            result.summary = $(this)
                .find("p").text();
            result.image = $(this)
                .find("a")
                .children("img")
                .attr("src");
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });

        res.send("Scrape Complete");
    });
});

app.get("/articles", function (req, res) {
    db.Article.find({}).sort({ _id: -1 })
        .then(function (response) {
            res.send(response);
        })
        .catch(function (err) {
            console.log(err);
            res.send(err);
        });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function (response) {
        res.json(response);
      })
      .catch(function (err) {
        console.log(err);
        res.send(err);
      })
  });

app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
      .then(function (dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, {note: dbNote._id}, { new: true});
      })
      .catch(function (err) {
        console.log(err);
        res.json(err);
      });
  });

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
