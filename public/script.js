async function getData() {
  const username = document.getElementById("username").value;
  if (!username) return alert("Please enter a GitHub username!");

  try {
    const res = await fetch(`/api/github/${username}`);
    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    document.getElementById("avatar").src = data.avatar_url;
    document.getElementById("name").textContent = data.name || username;
    document.getElementById("repos").textContent = data.repos;
    document.getElementById("xp").textContent = data.xp;
    document.getElementById("level").textContent = data.level;
    document.getElementById("badge").textContent = getBadge(data.level); // 👈 added badge line

    document.getElementById("result").style.display = "block";
  } catch (err) {
    alert("Error fetching user data.");
    console.error(err);
  }
}

function getBadge(level) {
  if (level >= 15) return "🦸‍♂️ Open Source Legend";
  if (level >= 10) return "🧠 Mastermind";
  if (level >= 5) return "🛠️ Contributor";
  if (level >= 2) return "🚀 Explorer";
  return "🐣 Beginner";
}
async function loadLeaderboard() {
  const usernames = ["torvalds", "gaearon", "sindresorhus", "yyx990803", "tj"];
  const leaderboard = [];

  for (let username of usernames) {
    try {
      const res = await fetch(`/api/github/${username}`);
      const data = await res.json();
      if (!data.error) {
        leaderboard.push({ 
          name: data.name || username, 
          xp: data.xp, 
          level: data.level 
        });
      }
    } catch (err) {
      console.error("Error fetching", username);
    }
  }

  // Sort by XP descending
  leaderboard.sort((a, b) => b.xp - a.xp);

  // Display it
  const board = document.getElementById("leaderboard");
  board.innerHTML = "<h2>🏆 Leaderboard</h2>";
  leaderboard.forEach((user, index) => {
    board.innerHTML += `<p>#${index + 1} ${user.name} — ⭐ ${user.xp} XP | 🎮 Level ${user.level}</p>`;
  });
}
let leaderboard = []; // Store leaderboard globally so it can be updated

async function addToLeaderboard() {
  const username = document.getElementById("username").value;
  if (!username) return alert("Please enter a GitHub username!");

  try {
    const res = await fetch(`/api/github/${username}`);
    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    const newEntry = {
      name: data.name || username,
      xp: data.xp,
      level: data.level
    };

    // Avoid duplicates
    const exists = leaderboard.some(user => user.name === newEntry.name);
    if (exists) {
      alert("Already on the leaderboard!");
      return;
    }

    leaderboard.push(newEntry);
    leaderboard.sort((a, b) => b.xp - a.xp);

    // Re-render leaderboard
    const board = document.getElementById("leaderboard");
    board.innerHTML = "<h2>🏆 Leaderboard</h2>";
    leaderboard.forEach((user, index) => {
      board.innerHTML += `<p>#${index + 1} ${user.name} — ⭐ ${user.xp} XP | 🎮 Level ${user.level}</p>`;
    });

    alert("You're added to the leaderboard! 🎉");
  } catch (err) {
    console.error("Error adding to leaderboard", err);
    alert("Something went wrong.");
  }
}

