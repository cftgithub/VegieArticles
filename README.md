# VegieArticles

## Purpose
This is a web app that lets users view and leave comments/notes on Pest Advisory articles scraped from Utah State University (USU) Extension website (https://pestadvisories.usu.edu/category/fruit/).

## MVP
1.When a user visits this site, the app will scrape articles from USU Extension website and display the following on the main page:
  * Headline (title of the article)
  * Summary (summary of the article)
  * URL (URL to the article)

2.Users will be able to leave comments on the articles displayed and save or delete those comments at user's discretion. Stored comments are visible to every user.

## Additional Features
  * Each scrape will only add new articles to the database and will not add duplicate articles.
  * Image associated with the article will be displayed, if available
  * Notes associated with each article will pop up as a modal and auto-popu;ated witht the title of the article.
  * The URL to the article is embedded in a button. Clicking the button will take the user to the article in a separate tab.
  * This app is responsive.

## NPM Packages
* Express
* Express-Handlebars
* Mongoose
* Cheerio
* Axios
* Morgan