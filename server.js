const express = require("express");
const app = express();
const port = process.env.PORT || 10000;

let latestCommand = null;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 👂 Обработка запроса от Roblox (GET) и отдача команды
app.get("/", (req, res) => {
  if (req.query.data) {
    try {
      const data = JSON.parse(req.query.data);
      latestCommand = data;
      console.log("📥 Получена команда от Telegram:", data);
      res.send("✅ Команда получена");
    } catch (err) {
      console.error("❌ Ошибка JSON:", err);
      res.status(400).send("Неверный JSON в параметре data");
    }
  } else if (latestCommand) {
    res.json(latestCommand);
    latestCommand = null;
  } else {
    res.send("none");
  }
});

// ✅ Запуск
app.listen(port, () => {
  console.log(`🌐 Server is running on http://localhost:${port}`);
});
