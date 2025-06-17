const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

process.env.BOT_TOKEN = "7685580414:AAESieIhpTYC4cqu4rlsylautq99bA-W8Vg";

app.use(cors());
app.use(bodyParser.json());

let commandsQueue = []; // очередь команд от Telegram

// 📥 Получение команды от Telegram (POST)
app.post("/roblox", (req, res) => {
	const { action, playerName, reason } = req.body;

	if (!action || !playerName) {
		return res.status(400).send("❌ Не хватает параметров");
	}

	commandsQueue.push({ type: action, username: playerName, reason: reason || "Без причины" });
	console.log("📥 Получена команда от Telegram:", commandsQueue[commandsQueue.length - 1]);

	res.send("✅ Команда сохранена");
});

// 🤖 Кнопки Telegram (POST)
app.post("/telegram", async (req, res) => {
	const body = req.body;

	if (body.callback_query) {
		const data = body.callback_query.data;
		const callbackId = body.callback_query.id;

		const [action, playerName] = data.split("_");
		const reason = "Из Telegram";

		commandsQueue.push({ type: action, username: playerName, reason });
		console.log("📩 Команда от кнопки Telegram:", { action, playerName, reason });

		// Ответ на callback Telegram
		try {
			await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/answerCallbackQuery`, {
				callback_query_id: callbackId,
				text: `✅ Команда ${action} отправлена`,
				show_alert: false
			});
		} catch (err) {
			console.error("❌ Ошибка Telegram callback:", err.message);
		}

		return res.send("ok");
	}

	res.sendStatus(200);
});

// 📤 Roblox получает команду (GET)
app.get("/commands", (req, res) => {
	if (commandsQueue.length === 0) {
		return res.json([]);
	}

	const toSend = [...commandsQueue];
	commandsQueue = []; // очистка очереди
	console.log("✅ Отправлены команды в Roblox:", toSend);
	res.json(toSend);
});

// 🔍 Тестовый маршрут
app.get("/test", (req, res) => {
	res.send("🟢 Сервер работает");
});

app.listen(PORT, () => {
	console.log(`🌐 Server is running on http://localhost:${PORT}`);
});
