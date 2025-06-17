const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
process.env.BOT_TOKEN = "7685580414:AAESieIhpTYC4cqu4rlsylautq99bA-W8Vg";
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
// Получение callback-запросов от Telegram кнопок
app.post("/telegram", (req, res) => {
  const body = req.body;

  if (body.callback_query) {
    const data = body.callback_query.data;
    const callbackId = body.callback_query.id;

    const [action, playerName] = data.split("_");
    const reason = "Из Telegram"; // или жди причины позже

    // Сохраняем команду
    lastCommand = { action, playerName, reason };
    console.log("📩 Получена команда от кнопки Telegram:", lastCommand);

    // Ответить Telegram, чтобы убрать «загрузка» у кнопки
    const axios = require("axios");
    axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/answerCallbackQuery`, {
      callback_query_id: callbackId,
      text: `✅ Команда ${action} отправлена`,
      show_alert: false
    }).catch(console.error);

    return res.send("ok");
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
	console.log(`🌐 Server is running on http://localhost:${PORT}`);
});
app.get("/test", (req, res) => {
  res.send("🟢 Сервер работает");
});
app.get("/force", (req, res) => {
  try {
    const raw = req.query.data;
    const data = JSON.parse(raw);
    if (data && data.action && data.playerName) {
      latestCommand = data;
      res.send("✅ Команда принята");
    } else {
      res.status(400).send("❌ Неполные данные");
    }
  } catch (err) {
    res.status(500).send("❌ Ошибка парсинга JSON");
  }
});
