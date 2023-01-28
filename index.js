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

const REGEX = /^[+]{0,1}\d*$/

const init = async () => {
  console.log(WEBHOOK_URL);

  const webhookUrl = `${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}&drop_pending_updates=true`;
  const res = await axios.get(`${webhookUrl}`);
  console.log("init", res.data);
};

app.post(URI, async (req, res) => {
  console.log(`A new request from: ${JSON.stringify(req.body.message)}`);

  let result;
  const chatId = req.body.message.chat.id;
  const text = req.body.message.text.replace(/\s/g, '');

  if(REGEX.test(text)){
    const withoutCountryPrefixPlus = text.replace(/\+/g, '');
    result=`https://wa.me/${withoutCountryPrefixPlus}?text=Hi`
  } else {
    result = `❌😖❌ Please use correct contact numbers. example: +9190123123`
  }

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text: result || text,
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