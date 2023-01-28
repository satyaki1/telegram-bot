require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const { TOKEN, SERVER_URL, PORT } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = `${SERVER_URL}${URI}`;

const app = express();
app.use(bodyParser.json());

const init = async () => {
  console.log(WEBHOOK_URL);

  const webhookUrl = `${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}&drop_pending_updates=true`;
  const res = await axios.get(`${webhookUrl}`);
  console.log("init", res.data);
};

app.post(URI, async (req, res) => {
  console.log(req);

  const chatId = req.body.message.chat.id;
  const text = req.body.message.text;

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text: text,
  });

  return res.send()
});

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.end(`Hello! This is a telegram bot. Search and try Done! You will find it at <a href="https://t.me/whatsapp_without_save_bot">@whatsapp_without_save_bot</a> .`);
  });

app.listen(PORT || 5000, async () => {
  console.log(`App running on ${PORT || 5000}`);
  await init();
});

module.exports = app;