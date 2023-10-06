const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const shortId = require("shortid");

admin.initializeApp();

// Firebase Realtime Database
const db = admin.database();

exports.check = functions.https.onRequest((req, res) => {
  // Sample Firebase Cloud Function endpoint
  res.status(200).send("123");
});

exports.redirectShortUrl = functions.https.onRequest(async (req, res) => {
  // Endpoint for redirecting short URLs
  try {
    const shortIdParam = req.path.substring(1); // Get the short ID from the URL path

    const snapshot = await db.ref(`shortUrls/${shortIdParam}`).once("value");

    const fullUrl = snapshot.val();

    if (fullUrl) {
      res.redirect(fullUrl); // Redirect to the full URL
    } else {
      res.status(404).json({ error: "Short URL not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

exports.shortenUrl = functions.https.onRequest(async (req, res) => {
  // Endpoint for shortening URLs
  cors(req, res, async () => {
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

      // Store the short URL in the Firebase Realtime Database
      await db.ref(`shortUrls/${shortID}`).set(fullUrl);

      res.status(201).json({ short: shortID });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to shorten URL" });
    }
  });
});
