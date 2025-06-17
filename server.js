const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

let commandsQueue = [];

app.get("/", (req, res) => {
  if (commandsQueue.length === 0) {
    res.send("none");
  } else {
    const command = commandsQueue.shift();
    res.json(command);
  }
});

app.post("/roblox", (req, res) => {
  const { action, playerName, reason } = req.body;

  if (!action || !playerName) {
    return res.status(400).send("Missing action or playerName");
  }

  commandsQueue.push({
    type: action,
    username: playerName,
    reason: reason || "Без причины",
  });

  res.send("OK");
});

app.listen(port, () => {
  console.log(`🌐 Server is running on http://localhost:${port}`);
});
