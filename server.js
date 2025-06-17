const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

let pendingCommand = null;

app.use(bodyParser.json());

// Telegram Webhook
app.post('/telegram', (req, res) => {
    const msg = req.body.message;
    if (!msg || !msg.text) return res.sendStatus(200);

    const [cmd, username, ...reasonParts] = msg.text.trim().split(" ");
    const reason = reasonParts.join(" ") || "Без причины";

    if (["/kick", "/ban", "/unban"].includes(cmd) && username) {
        pendingCommand = {
            action: cmd.slice(1), // 'kick' from '/kick'
            username,
            reason
        };
        console.log("✅ Получена команда:", pendingCommand);
    }

    res.sendStatus(200);
});

// Roblox GET
app.get('/', (req, res) => {
    if (pendingCommand) {
        res.json(pendingCommand);
        pendingCommand = null;
    } else {
        res.send("none");
    }
});

app.listen(PORT, () => {
    console.log(`🌐 Server running at http://localhost:${PORT}`);
});
