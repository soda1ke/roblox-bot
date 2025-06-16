const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

let lastCommand = null; // Здесь храним последнюю команду от Telegram

// Получение команды Roblox Studio
app.get("/roblox", (req, res) => {
	if (lastCommand) {
		const commandToSend = { ...lastCommand };
		lastCommand = null; // Очистить после отправки
		console.log("✅ Команда отправлена в Roblox:", commandToSend);
		res.json(commandToSend);
	} else {
		res.status(204).send(); // Нет команды
	}
});

// Получение команды от Telegram-бота
app.post("/roblox", (req, res) => {
	const { action, playerName, reason } = req.body;

	if (!action || !playerName) {
		return res.status(400).send("❌ Не хватает параметров");
	}

	lastCommand = { action, playerName, reason };
	console.log("📥 Получена команда от Telegram:", lastCommand);
	res.send("✅ Команда сохранена");
});

app.listen(PORT, () => {
	console.log(`🌐 Server is running on http://localhost:${PORT}`);
});
