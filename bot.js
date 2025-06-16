const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot("7685580414:AAESieIhpTYC4cqu4rlsylautq99bA-W8Vg", { polling: true });

const pendingActions = {};

bot.on("callback_query", async (query) => {
	const chatId = query.message.chat.id;
	const data = query.data;

	if (data.startsWith("ban_") || data.startsWith("kick_")) {
		const [action, playerName] = data.split("_");
		pendingActions[chatId] = { action, playerName };

		bot.sendMessage(chatId, `🛠 Введите причину для ${action.toUpperCase()} игрока ${playerName} (или "." для стандартной, или "отмена")`);
	}

	if (data.startsWith("unban_")) {
		const playerName = data.split("_")[1];
		await axios.post("http://localhost:3000/roblox", {
			action: "unban",
			playerName,
		});
		bot.sendMessage(chatId, `🔓 Игрок ${playerName} разбанен`);
	}
});

bot.on("message", async (msg) => {
	const chatId = msg.chat.id;
	const text = msg.text?.trim();
	const actionData = pendingActions[chatId];

	if (!actionData) return;

	if (text.toLowerCase() === "отмена") {
		delete pendingActions[chatId];
		return bot.sendMessage(chatId, "❌ Действие отменено.");
	}

	const reason = text === "." ? "Без причины" : text;
	const { action, playerName } = actionData;
	delete pendingActions[chatId];

	try {
		await axios.post("http://localhost:3000/roblox", {
			action,
			playerName,
			reason,
		});
		bot.sendMessage(chatId, `✅ Команда ${action.toUpperCase()} отправлена для ${playerName}`);
	} catch (err) {
		console.error("Ошибка:", err.message);
		bot.sendMessage(chatId, `❌ Ошибка отправки команды: ${err.message}`);
	}
});
