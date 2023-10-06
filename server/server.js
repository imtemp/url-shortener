//Server
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const shortId = require("shortid");
const bodyParser = require("body-parser");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
//MongoDB Connection
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://shotenURL:${process.env.MONGO_PASSWORD}@shortenurlcluster.uue0hh5.mongodb.net/?retryWrites=true&w=majority`;
const clientParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
};
// connect to db
mongoose
  .connect(uri, clientParams)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    ç;
    console.log(err);
  });

//Schema
const ShortUrl = require("./models/shortUrl");

app.use(
  cors({
    origin: "https://url-shortener-fawn-iota.vercel.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(bodyParser.json());
//Endpoints

app.get("/check", (req, res) => {
  res.send("123");
});

app.get("/:shortid", async (req, res) => {
  try {
    const urlMapping = await ShortUrl.findOne({ short: req.params.shortid });

    if (urlMapping) {
      // Redirect to an external URL (complete with protocol)
      res.redirect(`http://${urlMapping.full}`);
    } else {
      res.status(404).json({ error: "Short URL not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/shortenUrl", async (req, res) => {
  try {
    // Remove "http://" or "https://" from the URL if present
    const fullUrl = req.body.fullUrl.replace(/^https?:\/\//i, "");

    let shortID;

    // Check if customShortID is provided in the request body
    if (req.body.customShortID) {
      shortID = req.body.customShortID;
    } else {
      // Generate a new short ID
      shortID = shortId.generate();
    }

    const shortUrl = await ShortUrl.create({
      full: fullUrl,
      short: shortID, // Use customShortID or generated short ID
    });

    if (shortUrl) {
      res.status(201).json(shortUrl);
    } else {
      res.status(500).json({ error: "Failed to shorten URL" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to shorten URL" });
  }
});

app.listen(process.env.PORT || 2000);
