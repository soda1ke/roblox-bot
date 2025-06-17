const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

let currentCommand = null;

app.use(bodyParser.json());

// Получаем команду от Telegram-бота
app.post('/roblox', (req, res) => {
  currentCommand = req.body;
  console.log("📥 Получена команда:", currentCommand);
  res.sendStatus(200);
});

// Roblox опрашивает команду
app.get('/', (req, res) => {
  if (currentCommand) {
    res.json(currentCommand);
    currentCommand = null; // сброс после чтения
  } else {
    res.send("none");
  }
});

app.listen(port, () => {
  console.log(`🌐 Сервер запущен: http://localhost:${port}`);
});
