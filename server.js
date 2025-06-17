const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');

const ROBLOX_WEBHOOK_URL = 'https://roblox-bot-w1gk.onrender.com'; // Roblox-сервер
const TELEGRAM_BOT_TOKEN = '7685580414:AAESieIhpTYC4cqu4rlsylautq99bA-W8Vg';
const TELEGRAM_CHAT_ID = '6976449100';  // ID чата Telegram

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
    const { message } = req.body;
    const command = message.text.trim().split(' ');

    if (command[0] === '/kick' && command[1]) {
        const username = command[1];
        try {
            // Отправка команды на сервер Roblox для кика
            await axios.get(`${ROBLOX_WEBHOOK_URL}?action=kick&username=${username}`);
            // Ответ в Telegram
            await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                chat_id: TELEGRAM_CHAT_ID,
                text: `Команда /kick отправлена для игрока ${username}`
            });
            res.send('OK');
        } catch (error) {
            res.status(500).send('Ошибка при выполнении команды');
        }
    } else if (command[0] === '/ban' && command[1]) {
        const username = command[1];
        const reason = command.slice(2).join(' ') || 'Без причины';

        // Отправка команды на сервер Roblox для бана
        await axios.get(`${ROBLOX_WEBHOOK_URL}?action=ban&username=${username}&reason=${reason}`);

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: `Игрок ${username} забанен по причине: ${reason}`
        });
        res.send('OK');
    } else if (command[0] === '/unban' && command[1]) {
        const username = command[1];

        // Отправка команды на сервер Roblox для разбана
        await axios.get(`${ROBLOX_WEBHOOK_URL}?action=unban&username=${username}`);

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: `Игрок ${username} разбанен.`
        });
        res.send('OK');
    } else {
        res.status(400).send('Команда не распознана');
    }
});

// Слушаем на порту
app.listen(3000, () => {
    console.log('Webhook server is running on http://localhost:3000');
});
