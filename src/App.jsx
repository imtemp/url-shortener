import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [originalURL, setOriginalURL] = useState("");
  const [customShortID, setCustomShortID] = useState("");
  const [shortenedURL, setShortenedURL] = useState("");
  const [error, setError] = useState("");
  const [shortenedURLs, setShortenedURLs] = useState([]); // Store all shortened URLs as objectsde
  const BACKEND_URL = "https://url-shortener-fawn-iota.vercel.app/api";

  useEffect(() => {
    const storedShortenedURLs = JSON.parse(
      localStorage.getItem("shortenedURLs")
    );
    if (storedShortenedURLs) {
      setShortenedURLs(storedShortenedURLs);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("shortenedURLs", JSON.stringify(shortenedURLs));
  }, [shortenedURLs]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BACKEND_URL}/shortenUrl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullUrl: originalURL, customShortID }),
      });

      if (response.ok) {
        const data = await response.json();
        setShortenedURL(data.short);
        setShortenedURLs([
          { original: originalURL, shortened: `${BACKEND_URL}/${data.short}` },
          ...shortenedURLs,
        ]); // Add new URL object to the list
        setError("");
      } else {
        setError("Failed to shorten URL");
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("Network error. Please try again.");
    }
  };

  return (
    <div>
      <h1>URL Shortener</h1>
      <p>
        URL Shortener is a free tool that lets you create a shorter url with a
        custom back-half{" "}
      </p>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label>
            Enter URL
            <input
              type="text"
              value={originalURL}
              onChange={(e) => setOriginalURL(e.target.value)}
            />
          </label>
          <br />
          <label>
            Custom Link
            <input
              type="text"
              value={customShortID}
              onChange={(e) => setCustomShortID(e.target.value)}
            />
          </label>
          <button type="submit">Shorten URL</button>
        </form>
        {error && <p>{error}</p>}
      </div>
      <div className="form-container">
        <h2>Shortened URLs</h2>
        <ul>
          {shortenedURLs.map((url, index) => (
            <li key={index}>
              <p>
                <a
                  href={url.shortened}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${url.original}`}
                >
                  {url.shortened}
                </a>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
