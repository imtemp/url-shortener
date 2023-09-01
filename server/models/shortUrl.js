const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const shortId = require("shortid");

const shortUrlSchema = new Schema({
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
  },
  customShortID: {
    type: String, // Store custom short ID, if provided
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("ShortUrl", shortUrlSchema);
