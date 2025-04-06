const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Serve frontend files from "public" folder
app.use(express.static("public"));

// GitHub API route
app.get("/api/github/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        "User-Agent": "gamified-tracker-app",
        "Accept": "application/vnd.github.v3+json"
      }
    });

    const user = await response.json();

    if (user.message === "Not Found") {
      return res.json({ error: "GitHub user not found!" });
    }

    const xp = user.public_repos * 10;
    const level = Math.floor(xp / 100);

    res.json({
      name: user.name,
      avatar_url: user.avatar_url,
      repos: user.public_repos,
      xp,
      level
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Failed to fetch user data." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
